"""
Alembic environment configuration for async SQLModel migrations.
"""

from logging.config import fileConfig
import asyncio

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.engine import Connection
from alembic import context

from sqlmodel import SQLModel

# Import app config
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parents[1]))

from app.config import settings

# Import all models here to ensure they're registered with SQLModel
from app.models.user import User
from app.models.task import Task

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# SQLModel metadata
target_metadata = SQLModel.metadata

# Database URL from settings
DATABASE_URL = settings.database_url.replace(
    "postgresql://", "postgresql+asyncpg://"
)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """Execute migrations with the given connection."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations in 'online' mode with async engine."""
    connectable = create_async_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
        connect_args={
            "ssl": "require",  # SSL configuration for asyncpg with Neon
        },
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
