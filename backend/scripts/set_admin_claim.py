#!/usr/bin/env python3
"""
Script to set admin claims for a Firebase user.
This should be run server-side with proper Firebase Admin credentials.

Usage:
    python backend/scripts/set_admin_claim.py <user_uid>
"""

import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv

load_dotenv()

def set_admin_claim(uid: str):
    """Set admin custom claim for a user."""
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-service-account.json")
    
    if not os.path.exists(cred_path):
        print(f"Error: Firebase credentials file not found at {cred_path}")
        print("Please download your service account JSON from Firebase Console")
        return False
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    
    try:
        user = auth.get_user(uid)
        print(f"Found user: {user.email}")
        
        auth.set_custom_user_claims(uid, {'admin': True})
        print(f"✅ Admin claim set successfully for user {uid}")
        print("\nNote: The user must log out and log back in for the claim to take effect.")
        return True
    
    except auth.UserNotFoundError:
        print(f"Error: User with UID {uid} not found")
        return False
    except Exception as e:
        print(f"Error setting admin claim: {e}")
        return False


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python set_admin_claim.py <user_uid>")
        print("\nTo find user UID:")
        print("1. Go to Firebase Console > Authentication > Users")
        print("2. Find the user and copy their UID")
        sys.exit(1)
    
    user_uid = sys.argv[1]
    success = set_admin_claim(user_uid)
    sys.exit(0 if success else 1)
