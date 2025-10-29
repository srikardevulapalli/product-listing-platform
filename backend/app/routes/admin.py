from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
import os
from app.schemas.product import ProductResponse, ProductStatusUpdate
from app.schemas.user import SetAdminRequest
from app.services.firebase_service import firebase_service
from app.middleware.auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/set-admin-role", response_model=dict)
async def set_admin_role(request: SetAdminRequest):
    """
    Secure endpoint to set admin role for a user.
    Requires MASTER_ADMIN_KEY environment variable to be set.
    
    Usage:
    POST /admin/set-admin-role
    {
        "user_id": "firebase_user_uid",
        "master_key": "your_master_admin_key"
    }
    """
    master_key = os.getenv("MASTER_ADMIN_KEY")
    
    if not master_key:
        raise HTTPException(
            status_code=500, 
            detail="Master admin key not configured on server"
        )
    
    if request.master_key != master_key:
        raise HTTPException(
            status_code=403, 
            detail="Invalid master key"
        )
    
    try:
        firebase_service.set_custom_claims(request.user_id, {'admin': True})
        
        return {
            "message": f"Admin role successfully set for user {request.user_id}",
            "user_id": request.user_id,
            "note": "User must log out and log back in for the claim to take effect"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/revoke-admin-role", response_model=dict)
async def revoke_admin_role(request: SetAdminRequest):
    """
    Secure endpoint to revoke admin role from a user.
    Requires MASTER_ADMIN_KEY environment variable to be set.
    
    Usage:
    POST /admin/revoke-admin-role
    {
        "user_id": "firebase_user_uid",
        "master_key": "your_master_admin_key"
    }
    """
    master_key = os.getenv("MASTER_ADMIN_KEY")
    
    if not master_key:
        raise HTTPException(
            status_code=500, 
            detail="Master admin key not configured on server"
        )
    
    if request.master_key != master_key:
        raise HTTPException(
            status_code=403, 
            detail="Invalid master key"
        )
    
    try:
        firebase_service.set_custom_claims(request.user_id, {'admin': False})
        
        return {
            "message": f"Admin role successfully revoked for user {request.user_id}",
            "user_id": request.user_id,
            "note": "User must log out and log back in for the change to take effect"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products", response_model=List[ProductResponse])
async def get_all_products(
    status: Optional[str] = None,
    current_user: dict = Depends(require_admin)
):
    """
    Get all products (admin only).
    Optionally filter by status: pending, approved, rejected.
    """
    try:
        products = firebase_service.get_all_products(status=status)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/products/{product_id}/status", response_model=dict)
async def update_product_status(
    product_id: str,
    status_update: ProductStatusUpdate,
    current_user: dict = Depends(require_admin)
):
    """
    Update product status (admin only).
    Status can be: pending, approved, rejected.
    """
    try:
        product = firebase_service.get_product(product_id)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        success = firebase_service.update_product_status(
            product_id, 
            status_update.status.value
        )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update product status")
        
        return {
            "message": f"Product status updated to {status_update.status.value}",
            "product_id": product_id,
            "new_status": status_update.status.value
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
