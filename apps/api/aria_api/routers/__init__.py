from fastapi import APIRouter
from .tenants import router as tenants_router
from .employees import router as employees_router
from .channels import router as channels_router
from .knowledge import router as knowledge_router
from .conversations import router as conversations_router
from .analytics import router as analytics_router
from .webhooks import router as webhooks_router
from .billing import router as billing_router
from .chat import router as chat_router

api_router = APIRouter()
api_router.include_router(tenants_router, prefix="/tenants", tags=["tenants"])
api_router.include_router(employees_router, prefix="/employees", tags=["employees"])
api_router.include_router(channels_router, prefix="/channels", tags=["channels"])
api_router.include_router(knowledge_router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(conversations_router, prefix="/conversations", tags=["conversations"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
api_router.include_router(webhooks_router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(billing_router, prefix="/billing", tags=["billing"])
api_router.include_router(chat_router, prefix="/chat", tags=["chat"])
