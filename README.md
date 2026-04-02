# Aria — Your AI Workforce, Built for Business

Aria is a multi-tenant SaaS platform that lets businesses hire pre-built AI employees for customer support, sales development, and operations — connected to Slack, WhatsApp, email, and web chat. Set up in 30 minutes. No engineers needed.

## Structure

```
aria/
├── apps/
│   ├── web/          # Next.js marketing site (aria.ai)
│   ├── dashboard/    # Next.js customer dashboard (app.aria.ai)
│   ├── api/          # FastAPI multi-tenant backend (api.aria.ai)
│   └── widget/       # Embeddable web chat widget (Vite IIFE)
├── packages/
│   ├── aria-agents/  # Core agent runtime
│   ├── aria-core/    # Platform package
│   └── ui/           # Shared React component library
└── docker/           # Docker Compose stack
```

## Getting Started

### Marketing site
```bash
cd apps/web
npm install
npm run dev   # http://localhost:3000
```

### Dashboard
```bash
cd apps/dashboard
npm install
npm run dev   # http://localhost:3001
```

### API backend
```bash
cd apps/api
cp .env.example .env
pip install -e .
uvicorn aria_api.main:app --reload
```

### Full stack (Docker)
```bash
cd docker
cp ../.env.example .env
docker compose up
```

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, PostgreSQL, Redis, Celery, ChromaDB
- **AI:** LiteLLM (multi-provider), two-stage routing (GPT-4o-mini + GPT-4o)
- **Auth:** Clerk (SMB) / Auth0 SAML (enterprise)
- **Billing:** Stripe Subscriptions + metered usage
- **Channels:** Slack, WhatsApp, Email, Telegram, Web widget

## License

See [NOTICES.md](./NOTICES.md) for third-party attributions.
