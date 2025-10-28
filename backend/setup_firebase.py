import os
import json

print("""
Firebase Setup Helper
====================

This script will help you create a dummy Firebase service account file for testing.
For production, you should download the actual service account JSON from Firebase Console.

Firebase Console: https://console.firebase.google.com/
Navigate to: Project Settings > Service Accounts > Generate New Private Key
""")

project_id = input("\nEnter your Firebase Project ID: ").strip()

if not project_id:
    print("Project ID is required!")
    exit(1)

dummy_credentials = {
    "type": "service_account",
    "project_id": project_id,
    "private_key_id": "dummy_key_id",
    "private_key": "-----BEGIN PRIVATE KEY-----\nDUMMY_KEY\n-----END PRIVATE KEY-----\n",
    "client_email": f"firebase-adminsdk@{project_id}.iam.gserviceaccount.com",
    "client_id": "000000000000000000000",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40{project_id}.iam.gserviceaccount.com"
}

output_file = "firebase-service-account.json"

with open(output_file, 'w') as f:
    json.dump(dummy_credentials, f, indent=2)

print(f"\n✅ Created {output_file}")
print("\n⚠️  WARNING: This is a DUMMY file for structure reference only!")
print("For actual Firebase functionality, replace it with a real service account file from Firebase Console.")
print("\nNext steps:")
print("1. Go to Firebase Console > Project Settings > Service Accounts")
print("2. Click 'Generate New Private Key'")
print("3. Save the file as firebase-service-account.json in the backend directory")
