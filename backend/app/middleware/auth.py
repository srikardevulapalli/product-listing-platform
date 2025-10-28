from fastapi import Header, HTTPException, Depends
from typing import Optional
import os
from app.services.firebase_service import firebase_service


def verify_api_key(x_api_key: Optional[str] = Header(None)) -> bool:
    api_secret = os.getenv("API_SECRET_KEY")
    
    if not api_secret:
        raise HTTPException(status_code=500, detail="API secret key not configured")
    
    if not x_api_key or x_api_key != api_secret:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    
    return True


def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    
    token = authorization.split("Bearer ")[1]
    
    user_data = firebase_service.verify_firebase_token(token)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    claims = firebase_service.get_user_claims(user_data['uid'])
    user_data['is_admin'] = claims.get('admin', False)
    
    return user_data


def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if not current_user.get('is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return current_user
