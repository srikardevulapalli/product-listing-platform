from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.firebase_service import firebase_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=dict)
async def register_user(user: UserCreate):
    """
    Register a new user with email and password.
    Firebase Authentication handles the actual user creation.
    """
    try:
        result = firebase_service.create_user_with_email(
            email=user.email,
            password=user.password,
            display_name=user.display_name
        )
        
        return {
            "message": "User created successfully",
            "uid": result.get("uid"),
            "email": result.get("email")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=dict)
async def login_user(credentials: UserLogin):
    """
    Login endpoint (for documentation purposes).
    Actual login is handled by Firebase client SDK on the frontend.
    This endpoint can be used to verify credentials server-side if needed.
    """
    return {
        "message": "Please use Firebase client SDK for login",
        "info": "This endpoint is for documentation purposes. Use Firebase Authentication on the frontend."
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user information.
    Requires valid Firebase ID token.
    """
    return UserResponse(
        uid=current_user['uid'],
        email=current_user.get('email', ''),
        display_name=current_user.get('name', ''),
        is_admin=current_user.get('is_admin', False)
    )


@router.post("/verify-token", response_model=dict)
async def verify_token(current_user: dict = Depends(get_current_user)):
    """
    Verify Firebase ID token validity.
    Returns user information if token is valid.
    """
    return {
        "valid": True,
        "uid": current_user['uid'],
        "email": current_user.get('email'),
        "is_admin": current_user.get('is_admin', False)
    }
