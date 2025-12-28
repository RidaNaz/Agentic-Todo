"""
FastAPI application entry point.
Configures the application, middleware, and routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db, close_db
from app.routers import auth_router, tasks_router
from app.middleware.security import SecurityHeadersMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print(f"🚀 Starting {settings.app_name}")
    print(f"📍 Environment: {settings.environment}")
    # Store settings in app state for middleware access
    app.state.settings = settings
    # Note: Database tables created via Alembic migrations, not here
    yield
    # Shutdown
    await close_db()
    print("👋 Shutting down")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Phase II Backend - Multi-user Todo Application with Authentication",
    lifespan=lifespan,
)


# Configure middleware (order matters - first added is outermost)
# Security headers
app.add_middleware(SecurityHeadersMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint - health check."""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "environment": settings.environment,
    }


# Include routers
app.include_router(auth_router)
app.include_router(tasks_router)
