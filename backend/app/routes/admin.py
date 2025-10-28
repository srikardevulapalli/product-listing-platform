from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.schemas.product import ProductResponse, ProductStatusUpdate
from app.services.firebase_service import firebase_service
from app.middleware.auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/products", response_model=List[ProductResponse])
async def get_all_products(
    status: Optional[str] = None,
    current_user: dict = Depends(require_admin)
):
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
