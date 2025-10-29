#!/usr/bin/env python3
"""
Quick script to make yourself an admin user.
Run this to enable access to the Admin Panel.
"""

import os
import sys
import json
from firebase_admin import auth, credentials
import firebase_admin

def make_admin(email):
    """Make a user admin by email address"""
    
    # Initialize Firebase Admin
    if not firebase_admin._apps:
        service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
        if not service_account_json:
            print("❌ Error: FIREBASE_SERVICE_ACCOUNT_JSON environment variable not found")
            sys.exit(1)
        
        try:
            service_account_dict = json.loads(service_account_json)
            cred = credentials.Certificate(service_account_dict)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK initialized")
        except Exception as e:
            print(f"❌ Error initializing Firebase: {e}")
            sys.exit(1)
    
    try:
        # Get user by email
        user = auth.get_user_by_email(email)
        print(f"✅ Found user: {user.email} (UID: {user.uid})")
        
        # Set admin claim
        auth.set_custom_user_claims(user.uid, {'admin': True})
        print(f"✅ Admin role set for {user.email}")
        print("\n⚠️  IMPORTANT: You must sign out and sign back in for changes to take effect!")
        print(f"\nYou can now access the Admin Panel at: /admin")
        
    except auth.UserNotFoundError:
        print(f"❌ Error: No user found with email {email}")
        print("Make sure the user has signed up in your app first.")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <your_email@example.com>")
        print("\nExample:")
        print("  python make_admin.py john@example.com")
        sys.exit(1)
    
    email = sys.argv[1]
    print(f"🔧 Setting admin role for: {email}")
    print("=" * 50)
    make_admin(email)
