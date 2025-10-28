# Deployment Guide

## Quick Setup for Testing

### 1. Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com/

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-In

3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy the security rules from `firestore.rules`

4. Setup Firebase Storage:
   - Go to Storage
   - Get started
   - Deploy the security rules from `storage.rules`

5. Get Firebase Config:
   - Go to Project Settings
   - Scroll to "Your apps"
   - Click "Web" icon to add a web app
   - Copy the firebaseConfig object

6. Download Service Account:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `backend/firebase-service-account.json`

### 2. OpenAI Setup

1. Get API Key from https://platform.openai.com/api-keys
2. Copy the key for backend `.env` file

### 3. Backend Configuration

Create `backend/.env`:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
FIREBASE_CREDENTIALS_PATH=firebase-service-account.json
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
GOOGLE_CLOUD_PROJECT=your-project-id
FRONTEND_URL=http://localhost:5000
```

### 4. Frontend Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note**: No API secret key is needed in the frontend. Authentication is handled exclusively via Firebase ID tokens.

### 5. Run Locally

Terminal 1 - Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

### 6. Create Admin User

After registering your first user, set them as admin:

```bash
# Get the user UID from Firebase Console > Authentication
# Get a Firebase ID token (you can get this from browser DevTools > Application > IndexedDB > firebaseLocalStorage)

curl -X POST http://localhost:8000/admin/set-admin/YOUR_USER_UID \
  -H "X-API-Key: your-secret-key" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

Or use the Firebase Console:
- Go to Authentication
- Find your user
- Note the UID
- Use Firebase CLI or Admin SDK to set custom claim

## Production Deployment

### Backend (Render)

1. Create New Web Service on Render
2. Connect GitHub repo
3. Configuration:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. Environment Variables:
   ```
   OPENAI_API_KEY=your-key
   FIREBASE_STORAGE_BUCKET=your-bucket
   API_SECRET_KEY=your-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. Secret Files (in Render dashboard):
   - Add `firebase-service-account.json` as a secret file
   - Set `FIREBASE_CREDENTIALS_PATH=firebase-service-account.json`

### Backend (Google Cloud Run)

1. Build and push Docker image:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy product-listing-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

3. Set environment variables in Cloud Run console

### Frontend (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Root Directory: `frontend`
4. Framework Preset: Next.js
5. Add all `NEXT_PUBLIC_*` environment variables
6. Deploy!

### Frontend (Netlify)

1. Connect GitHub repo
2. Build Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`
3. Add environment variables
4. Deploy

## Post-Deployment

1. Update CORS in backend to allow your frontend domain
2. Update Firebase Auth authorized domains
3. Test all features:
   - User registration
   - User login  
   - Product upload
   - AI generation
   - Admin approval
   - Real-time updates

## Troubleshooting

### Backend won't start
- Check Firebase credentials path
- Verify all environment variables are set
- Check logs for specific errors

### Frontend can't connect
- Verify API URL is correct
- Check CORS settings
- Verify API secret key matches

### AI generation fails
- Check OpenAI API key
- Verify account has credits
- Check image size (must be < 20MB)

### Real-time updates not working
- Verify Firestore rules are deployed
- Check browser console for errors
- Ensure user is authenticated
