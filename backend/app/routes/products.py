from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse, 
    AIGenerationRequest, AIGenerationResponse
)
from app.services.firebase_service import firebase_service
from app.services.ai_service import ai_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/generate-ai-description", response_model=AIGenerationResponse)
async def generate_ai_description(
    request: AIGenerationRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        result = ai_service.generate_product_description(request.image_data)
        return AIGenerationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=dict)
async def create_product(
    product: ProductCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        product_data = product.model_dump()
        product_data['user_id'] = current_user['uid']
        product_data['status'] = 'pending'
        
        product_id = firebase_service.create_product(product_data)
        
        return {
            "id": product_id,
            "message": "Product created successfully",
            "status": "pending"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-products", response_model=List[ProductResponse])
async def get_my_products(current_user: dict = Depends(get_current_user)):
    try:
        products = firebase_service.get_products_by_user(current_user['uid'])
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        product = firebase_service.get_product(product_id)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if product['user_id'] != current_user['uid'] and not current_user.get('is_admin'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{product_id}", response_model=dict)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: dict = Depends(get_current_user)
):
    try:
        product = firebase_service.get_product(product_id)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if product['user_id'] != current_user['uid']:
            raise HTTPException(status_code=403, detail="Access denied")
        
        update_data = product_update.model_dump(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No update data provided")
        
        success = firebase_service.update_product(product_id, update_data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update product")
        
        return {"message": "Product updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{product_id}", response_model=dict)
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        product = firebase_service.get_product(product_id)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if product['user_id'] != current_user['uid']:
            raise HTTPException(status_code=403, detail="Access denied")
        
        success = firebase_service.soft_delete_product(product_id)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete product")
        
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
