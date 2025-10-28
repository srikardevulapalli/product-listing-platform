import firebase_admin
from firebase_admin import credentials, firestore, storage, auth
from typing import Dict, List, Optional
from datetime import datetime
import os


class FirebaseService:
    def __init__(self):
        if not firebase_admin._apps:
            cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
            else:
                cred = credentials.ApplicationDefault()
            
            firebase_admin.initialize_app(cred, {
                'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET")
            })
        
        self.db = firestore.client()
        self.bucket = storage.bucket()
    
    def create_product(self, product_data: Dict) -> str:
        product_data['created_at'] = datetime.utcnow().isoformat()
        product_data['updated_at'] = datetime.utcnow().isoformat()
        product_data['is_deleted'] = False
        
        doc_ref = self.db.collection('products').document()
        doc_ref.set(product_data)
        return doc_ref.id
    
    def get_product(self, product_id: str) -> Optional[Dict]:
        doc_ref = self.db.collection('products').document(product_id)
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return data
        return None
    
    def get_products_by_user(self, user_id: str, include_deleted: bool = False) -> List[Dict]:
        query = self.db.collection('products').where('user_id', '==', user_id)
        
        if not include_deleted:
            query = query.where('is_deleted', '==', False)
        
        docs = query.stream()
        products = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            products.append(data)
        
        return products
    
    def get_all_products(self, status: Optional[str] = None, include_deleted: bool = False) -> List[Dict]:
        query = self.db.collection('products')
        
        if status:
            query = query.where('status', '==', status)
        
        if not include_deleted:
            query = query.where('is_deleted', '==', False)
        
        docs = query.stream()
        products = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            products.append(data)
        
        return products
    
    def update_product(self, product_id: str, update_data: Dict) -> bool:
        doc_ref = self.db.collection('products').document(product_id)
        
        if not doc_ref.get().exists:
            return False
        
        update_data['updated_at'] = datetime.utcnow().isoformat()
        doc_ref.update(update_data)
        return True
    
    def update_product_status(self, product_id: str, status: str) -> bool:
        return self.update_product(product_id, {'status': status})
    
    def soft_delete_product(self, product_id: str) -> bool:
        return self.update_product(product_id, {'is_deleted': True})
    
    def verify_firebase_token(self, token: str) -> Optional[Dict]:
        try:
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            print(f"Error verifying token: {e}")
            return None
    
    def get_user_claims(self, uid: str) -> Dict:
        try:
            user = auth.get_user(uid)
            return user.custom_claims or {}
        except Exception as e:
            print(f"Error getting user claims: {e}")
            return {}
    
    def set_admin_claim(self, uid: str, is_admin: bool = True) -> bool:
        try:
            auth.set_custom_user_claims(uid, {'admin': is_admin})
            return True
        except Exception as e:
            print(f"Error setting admin claim: {e}")
            return False


firebase_service = FirebaseService()
