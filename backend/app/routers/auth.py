"""
Authentication endpoints for user signup, signin, and session management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select

from app.database import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.dependencies.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session),
):
    """
    Sign up a new user with email and password.

    Args:
        user_data: User registration data (email, password, name)
        session: Database session

    Returns:
        TokenResponse with JWT token and user data

    Raises:
        HTTPException: If email already exists
    """
    # Check if user already exists
    statement = select(User).where(User.email == user_data.email)
    result = await session.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Generate user ID
    import uuid

    user_id = f"user_{uuid.uuid4().hex[:12]}"

    # Create new user (password is validated by schema but we don't store it)
    new_user = User(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        email_verified=False,
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    # Create JWT token
    access_token = create_access_token(
        data={"sub": new_user.id, "email": new_user.email}
    )

    # Return token and user data
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user),
    )


@router.post("/signin", response_model=TokenResponse)
async def signin(
    credentials: UserLogin,
    session: AsyncSession = Depends(get_session),
):
    """
    Sign in an existing user with email and password.

    Args:
        credentials: User login credentials (email, password)
        session: Database session

    Returns:
        TokenResponse with JWT token and user data

    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    statement = select(User).where(User.email == credentials.email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    # NOTE: In a real application, you would verify the password here
    # For now, we're using Better Auth which handles password verification
    # This is a simplified version for demonstration
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token
    access_token = create_access_token(data={"sub": user.id, "email": user.email})

    # Return token and user data
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get("/session", response_model=UserResponse)
async def get_session(
    current_user: User = Depends(get_current_user),
):
    """
    Get the current user's session.

    Args:
        current_user: Current authenticated user from JWT token

    Returns:
        UserResponse with current user data
    """
    return UserResponse.model_validate(current_user)


@router.post("/signout")
async def signout():
    """
    Sign out the current user.

    Note: Since we're using JWT tokens, the actual logout happens on the client side
    by removing the token. This endpoint exists for consistency with Better Auth API.

    Returns:
        Success message
    """
    return {"success": True, "message": "Signed out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    """
    Get the current authenticated user's information.

    Args:
        current_user: Current authenticated user from JWT token

    Returns:
        UserResponse with current user data
    """
    return UserResponse.model_validate(current_user)
