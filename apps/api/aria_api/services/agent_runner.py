"""
Aria Agent Runner — stateless per-request agent instantiation.

Wraps the aria-agents runtime (rebranded PraisonAI) with tenant config injection.
Two-stage LLM routing:
  Stage 1: GPT-4o-mini classifier — can we answer from KB?
  Stage 2a: GPT-4o-mini + RAG retrieval
  Stage 2b: GPT-4o reasoning (complex queries only)
"""
import asyncio
from typing import AsyncGenerator
from uuid import UUID
from aria_api.models import Employee
from aria_api.config import get_settings

settings = get_settings()


ROLE_SYSTEM_PROMPTS = {
    "customer_support": """You are {name}, a helpful and professional customer support representative.
Your job is to assist customers with their questions and issues.
Always be polite, empathetic, and solution-focused.
If you cannot resolve an issue, say so clearly and offer to escalate to a human agent.
Only use information from the provided knowledge base — do not make up answers.
{persona_prompt}""",

    "sdr": """You are {name}, a skilled sales development representative.
Your job is to qualify leads, research prospects, and craft personalized outreach.
Be professional, concise, and value-focused in all communications.
{persona_prompt}""",

    "ops_coordinator": """You are {name}, an efficient operations coordinator.
Your job is to handle scheduling, internal requests, data entry, and reporting tasks.
Be organized, precise, and proactive.
{persona_prompt}""",
}


async def run_agent_stream(
    employee: Employee,
    user_message: str,
    conversation_id: UUID,
) -> AsyncGenerator[dict, None]:
    """
    Stream agent response tokens for a given employee + message.
    Yields dicts: {"type": "token", "content": "..."}
                  {"type": "escalation", "reason": "..."}
                  {"type": "done", "conversation_id": "..."}
    """
    try:
        import litellm
        litellm.drop_params = True

        system_prompt = ROLE_SYSTEM_PROMPTS.get(employee.role_type.value, "").format(
            name=employee.name,
            persona_prompt=employee.persona_prompt or "",
        )

        kb_context = await _retrieve_from_kb(employee, user_message)

        if kb_context:
            system_prompt += f"\n\nKnowledge Base Context:\n{kb_context}"
            model = employee.llm_model
        else:
            model = employee.llm_model_reasoning

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ]

        response = await litellm.acompletion(
            model=model,
            messages=messages,
            stream=True,
            api_key=settings.openai_api_key,
        )

        full_response = []
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                token = chunk.choices[0].delta.content
                full_response.append(token)
                yield {"type": "token", "content": token}

        full_text = "".join(full_response)

        if employee.guardrails_enabled:
            should_escalate = await _check_escalation(full_text, user_message)
            if should_escalate:
                yield {"type": "escalation", "reason": "Guardrail triggered — routing to human agent"}
                return

        yield {"type": "done", "conversation_id": str(conversation_id)}

    except Exception as e:
        yield {"type": "error", "message": f"Agent error: {str(e)}"}


async def _retrieve_from_kb(employee: Employee, query: str) -> str | None:
    """Retrieve relevant context from the tenant-namespaced ChromaDB collection."""
    try:
        import chromadb
        from aria_api.config import get_settings
        settings = get_settings()

        client = chromadb.HttpClient(host=settings.chroma_host, port=settings.chroma_port)
        collection_name = employee.chroma_collection_name

        try:
            collection = client.get_collection(collection_name)
        except Exception:
            return None

        import litellm
        embedding_response = await litellm.aembedding(
            model="text-embedding-3-small",
            input=[query],
            api_key=settings.openai_api_key,
        )
        query_embedding = embedding_response.data[0]["embedding"]

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=5,
            include=["documents", "distances"],
        )

        if not results["documents"] or not results["documents"][0]:
            return None

        relevant_docs = [
            doc for doc, dist in zip(results["documents"][0], results["distances"][0])
            if dist < 0.8
        ]

        if not relevant_docs:
            return None

        return "\n\n".join(relevant_docs[:3])

    except Exception:
        return None


async def _check_escalation(response: str, query: str) -> bool:
    """Use LLM guardrail to check if this response should be escalated."""
    try:
        import litellm
        check = await litellm.acompletion(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a quality checker. Reply ONLY with 'escalate' or 'ok'.",
                },
                {
                    "role": "user",
                    "content": f"Query: {query}\nResponse: {response}\n\n"
                               "Should this be escalated to a human? Reply 'escalate' if the response "
                               "contains harmful content, makes up facts, or is clearly wrong. "
                               "Otherwise reply 'ok'.",
                },
            ],
            max_tokens=5,
            api_key=settings.openai_api_key,
        )
        answer = check.choices[0].message.content.strip().lower()
        return "escalate" in answer
    except Exception:
        return False
