"""
Task model for database.
"""

from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship


class Task(SQLModel, table=True):
    """
    Task model representing a user's todo item.

    Attributes:
        id: Unique task identifier
        user_id: Foreign key to user who owns this task
        title: Task title (required, 1-200 characters)
        description: Optional task description (max 1000 characters)
        completed: Whether task is completed
        created_at: Timestamp when task was created
        updated_at: Timestamp when task was last updated
    """

    __tablename__ = "tasks"

    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
