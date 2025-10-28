# Product Listing Platform - Replit Project

## Overview
This is an AI-powered product listing platform built for a Full-Stack Engineer technical assessment. The application enables users to upload product images and leverages OpenAI Vision API to automatically generate product titles, descriptions, and keywords.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: FastAPI, Python 3.11
- **Database & Auth**: Firebase (Firestore, Authentication, Storage)
- **AI**: OpenAI Vision API (GPT-4o)

## Project Structure
```
/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── routes/            # API endpoints (products, admin)
│   │   ├── services/          # Firebase & AI services
│   │   ├── schemas/           # Pydantic models
│   │   ├── middleware/        # Authentication middleware
│   │   └── main.py           # FastAPI app entry point
│   └── requirements.txt
├── frontend/                   # Next.js frontend
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities & configs
│   ├── types/                 # TypeScript definitions
│   └── contexts/              # React contexts
├── firestore.rules            # Firestore security rules
├── storage.rules              # Firebase Storage rules
├── README.md                  # Main documentation
└── DEPLOYMENT.md             # Deployment guide
```

## Current State
- ✅ Backend API running on port 8000
- ✅ Frontend running on port 5000
- ⚠️ Requires Firebase and OpenAI credentials to be functional

## Setup Required

### 1. Firebase Configuration
You need to create a Firebase project and configure credentials:

1. Create project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password, Google Sign-In)
3. Create Firestore Database
4. Setup Firebase Storage
5. Download service account JSON to `backend/firebase-service-account.json`
6. Update `backend/.env` with your Firebase project ID
7. Update `frontend/.env.local` with your Firebase web app config

### 2. OpenAI API Key
1. Get API key from https://platform.openai.com/api-keys
2. Update `OPENAI_API_KEY` in `backend/.env`

### 3. Environment Variables

Backend (`backend/.env`):
```env
OPENAI_API_KEY=your_openai_api_key
FIREBASE_CREDENTIALS_PATH=firebase-service-account.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
API_SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5000
GOOGLE_CLOUD_PROJECT=your-project-id
```

Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_SECRET_KEY=same_as_backend_secret
```

## Features Implemented

### Authentication
- Email/Password authentication
- Google Sign-In
- Protected routes
- Role-based access control (admin)

### Product Management
- Image upload to Firebase Storage
- AI-powered description generation
- CRUD operations for products
- Soft delete functionality
- Product status (pending, approved, rejected)

### User Dashboard
- View user's own products
- Real-time status updates via Firestore listeners
- Responsive design
- Loading states and error handling

### Admin Dashboard
- View all products or filter by status
- Approve/reject product listings
- Real-time updates
- Admin role verification

### Security
- API key authentication for backend
- Firebase ID token validation
- Firestore security rules
- Storage security rules
- Environment variable protection

## Development Workflows

Both workflows are configured and running:
- **Backend API**: Port 8000 (console output)
- **Frontend**: Port 5000 (webview output)

## Next Steps for User

1. **Setup Firebase**:
   - Create Firebase project
   - Download service account credentials
   - Configure environment variables

2. **Setup OpenAI**:
   - Get API key
   - Add to backend `.env`

3. **Deploy Firestore Rules**:
   - Copy `firestore.rules` to Firebase Console
   - Copy `storage.rules` to Firebase Console

4. **Create Admin User**:
   - Register first user
   - Use backend API to set admin role

5. **Test Features**:
   - User registration/login
   - Product upload with AI generation
   - Dashboard real-time updates
   - Admin approval workflow

## Documentation
- See `README.md` for comprehensive setup instructions
- See `DEPLOYMENT.md` for production deployment guide
- API documentation available at `http://localhost:8000/docs`

## Notes
- The project uses dummy Firebase credentials for structure demonstration
- Replace with actual credentials for full functionality
- Both workflows restart automatically on package changes
- Frontend serves on port 5000 (required for Replit webview)
- Backend API uses CORS to allow frontend access
