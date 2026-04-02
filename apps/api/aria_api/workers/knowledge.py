"""Celery workers for async knowledge base ingestion."""
from celery import Celery
from aria_api.config import get_settings

settings = get_settings()

celery_app = Celery("aria", broker=settings.celery_broker_url)
celery_app.conf.task_serializer = "json"
celery_app.conf.result_serializer = "json"


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def ingest_url_task(self, source_id: str, url: str, collection_name: str):
    """Crawl a URL and index its content into ChromaDB."""
    import asyncio
    try:
        asyncio.get_event_loop().run_until_complete(
            _async_ingest_url(source_id, url, collection_name)
        )
    except Exception as exc:
        raise self.retry(exc=exc)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def ingest_file_task(self, source_id: str, file_bytes: bytes, filename: str, collection_name: str):
    """Parse and index a PDF/DOCX file into ChromaDB."""
    import asyncio
    try:
        asyncio.get_event_loop().run_until_complete(
            _async_ingest_file(source_id, file_bytes, filename, collection_name)
        )
    except Exception as exc:
        raise self.retry(exc=exc)


async def _async_ingest_url(source_id: str, url: str, collection_name: str):
    from aria_api.db.base import AsyncSessionLocal
    from aria_api.models import KnowledgeSource, KnowledgeSourceStatus
    from sqlalchemy import select
    from datetime import datetime, timezone

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(KnowledgeSource).where(KnowledgeSource.id == source_id))
        source = result.scalar_one_or_none()
        if not source:
            return

        source.status = KnowledgeSourceStatus.processing
        await db.commit()

        try:
            from crawl4ai import AsyncWebCrawler
            async with AsyncWebCrawler() as crawler:
                crawl_result = await crawler.arun(url=url)
                text = crawl_result.markdown or crawl_result.cleaned_html or ""

            chunks = _chunk_text(text)
            await _store_chunks(chunks, collection_name)

            source.status = KnowledgeSourceStatus.indexed
            source.chunk_count = len(chunks)
            source.indexed_at = datetime.now(timezone.utc)
        except Exception as e:
            source.status = KnowledgeSourceStatus.failed
            source.error_message = str(e)
            raise

        finally:
            await db.commit()


async def _async_ingest_file(source_id: str, file_bytes: bytes, filename: str, collection_name: str):
    from aria_api.db.base import AsyncSessionLocal
    from aria_api.models import KnowledgeSource, KnowledgeSourceStatus
    from sqlalchemy import select
    from datetime import datetime, timezone
    import io

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(KnowledgeSource).where(KnowledgeSource.id == source_id))
        source = result.scalar_one_or_none()
        if not source:
            return

        source.status = KnowledgeSourceStatus.processing
        await db.commit()

        try:
            if filename.lower().endswith(".pdf"):
                import PyPDF2
                reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                text = "\n".join(page.extract_text() or "" for page in reader.pages)
            else:
                from docx import Document
                doc = Document(io.BytesIO(file_bytes))
                text = "\n".join(p.text for p in doc.paragraphs)

            chunks = _chunk_text(text)
            await _store_chunks(chunks, collection_name)

            source.status = KnowledgeSourceStatus.indexed
            source.chunk_count = len(chunks)
            source.indexed_at = datetime.now(timezone.utc)
        except Exception as e:
            source.status = KnowledgeSourceStatus.failed
            source.error_message = str(e)
            raise
        finally:
            await db.commit()


def _chunk_text(text: str, chunk_size: int = 512, overlap: int = 51) -> list[str]:
    """Simple token-approximate chunking with overlap."""
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
        i += chunk_size - overlap
    return chunks


async def _store_chunks(chunks: list[str], collection_name: str):
    """Embed chunks and store in ChromaDB under the tenant-namespaced collection."""
    import litellm
    import chromadb

    if not chunks:
        return

    settings_obj = get_settings()
    client = chromadb.HttpClient(host=settings_obj.chroma_host, port=settings_obj.chroma_port)

    try:
        collection = client.get_or_create_collection(collection_name)
    except Exception:
        collection = client.create_collection(collection_name)

    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        embedding_response = await litellm.aembedding(
            model="text-embedding-3-small",
            input=batch,
            api_key=settings_obj.openai_api_key,
        )
        embeddings = [r["embedding"] for r in embedding_response.data]
        ids = [f"chunk_{i + j}" for j in range(len(batch))]
        collection.upsert(ids=ids, documents=batch, embeddings=embeddings)
