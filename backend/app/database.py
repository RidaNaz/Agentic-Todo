"""
Database connection setup using SQLModel with async PostgreSQL.
Provides session management and connection pooling.
"""

from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

from app.config import settings


# Create async engine
async_engine: AsyncEngine = create_async_engine(
    settings.database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=not settings.is_production,
    future=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args={
        "ssl": "require",  # SSL configuration for asyncpg with Neon
    },
)


# Create async session factory
async_session_factory = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting async database session.
    Yields a session and ensures it's closed after use.
    """
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables (for development/testing only)."""
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db() -> None:
    """Close database connections."""
    await async_engine.dispose()
