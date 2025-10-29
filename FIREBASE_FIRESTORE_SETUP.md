# Enable Firestore Database

Your Firebase project needs Firestore to be enabled. Follow these steps:

## Quick Setup:

1. **Go directly to Firestore setup**:
   - Click this link: https://console.cloud.google.com/datastore/setup?project=boxsy-product
   - OR go to https://console.firebase.google.com → Select "boxsy-product" → Click "Firestore Database" in the left menu

2. **Create Database**:
   - Click **"Create Database"** button
   
3. **Choose Location**:
   - **Production mode** (recommended - we already have security rules in code)
   - Select a location closest to your users:
     - `us-central` (United States)
     - `europe-west` (Europe)
     - `asia-southeast` (Asia)
   - Click **Next**

4. **Security Rules**:
   - Select **"Start in production mode"**
   - Click **Enable**
   - Wait 1-2 minutes for database to be created

5. **Verify**:
   - You should see "Cloud Firestore" page with an empty database
   - Your app will now work!

## Security Rules (Already Configured in Code)

Your app already has Firestore security rules configured. The backend validates users with Firebase Admin SDK, so production mode is safe.

## After Setup:

Refresh your app and try:
- Signing in
- Uploading a product
- Viewing your dashboard

Everything should work now! 🎉
