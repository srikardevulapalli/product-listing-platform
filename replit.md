# Product Listing Platform - Replit Project

## Overview
This is an AI-powered product listing platform built for a Full-Stack Engineer technical assessment. The application enables users to upload product images and leverages OpenAI Vision API to automatically generate product titles, descriptions, and keywords.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, ShadCN UI
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
│   │   ├── middleware/        # Firebase token authentication
│   │   └── main.py           # FastAPI app entry point
│   ├── scripts/               # Utility scripts
│   │   └── set_admin_claim.py # Server-side admin claim script
│   └── requirements.txt
├── frontend/                   # Next.js frontend
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities & configs
│   ├── types/                 # TypeScript definitions
│   └── contexts/              # React contexts (AuthContext)
├── firestore.rules            # Firestore security rules
├── storage.rules              # Firebase Storage rules
├── README.md                  # Main documentation
├── DEPLOYMENT.md              # Deployment guide
└── SECURITY.md                # Security architecture documentation
```

## Current State
- ✅ Backend API running on port 8000
- ✅ Frontend running on port 5000
- ✅ Security hardened (Firebase token auth only)
- ⚠️ Requires Firebase and OpenAI credentials to be functional

## Recent Changes (October 28, 2025)

### Critical Security Fixes
1. **Removed API Secret Exposure**: Eliminated `NEXT_PUBLIC_API_SECRET_KEY` from frontend
2. **Firebase-Only Authentication**: All API endpoints now validate Firebase ID tokens exclusively
3. **Admin Elevation Secured**: Removed public `/admin/set-admin` endpoint
4. **Server-Side Admin Script**: Created `backend/scripts/set_admin_claim.py` for secure admin provisioning
5. **Comprehensive Security Documentation**: Added detailed `SECURITY.md` covering authentication flow, authorization, and threat model

### Architecture Updates
- Authentication middleware now solely validates Firebase ID tokens
- Admin role verification uses Firebase custom claims
- CORS configuration ready for production restriction
- Tailwind CSS v4 properly configured with PostCSS

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
```

**Note**: No API secret key is needed in the frontend. Authentication is handled exclusively via Firebase ID tokens.

## Features Implemented

### Authentication
- Email/Password authentication
- Google Sign-In
- Protected routes
- Role-based access control (admin via Firebase custom claims)
- Firebase ID token validation on all API endpoints

### Product Management
- Image upload to Firebase Storage
- AI-powered description generation using GPT-4 Vision
- CRUD operations for products
- Soft delete functionality
- Product status (pending, approved, rejected)

### User Dashboard
- View user's own products
- Real-time status updates via Firestore listeners
- Responsive design
- Loading states and error handling
- Edit and delete own products

### Admin Dashboard
- View all products or filter by status
- Approve/reject product listings
- Real-time updates via Firestore listeners
- Admin role verification via Firebase custom claims

### Security
- **Firebase ID Token Authentication**: All API endpoints validate Firebase tokens
- **No Exposed Secrets**: Frontend has no API keys or secrets
- **Firestore Security Rules**: User isolation and admin override
- **Storage Security Rules**: Path-based access control with size/type limits
- **Server-Side Admin Provisioning**: Admin claims set only via server script
- **Input Validation**: Pydantic schemas on backend, TypeScript on frontend

## Development Workflows

Both workflows are configured and running:
- **Backend API**: Port 8000 (console output)
- **Frontend**: Port 5000 (webview output)

## Next Steps for User

1. **Setup Firebase**:
   - Create Firebase project
   - Download service account credentials
   - Configure environment variables
   - Deploy Firestore and Storage security rules

2. **Setup OpenAI**:
   - Get API key (requires GPT-4 Vision access)
   - Add to backend `.env`

3. **Deploy Security Rules**:
   ```bash
   firebase login
   firebase init
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

4. **Create Admin User**:
   - Register first user via the app
   - Get user UID from Firebase Console > Authentication
   - Run: `python backend/scripts/set_admin_claim.py <user_uid>`
   - User must log out and log back in for admin claim to take effect

5. **Test Features**:
   - User registration/login
   - Product upload with AI generation
   - Dashboard real-time updates
   - Admin approval workflow

6. **Deploy to Production**:
   - See `DEPLOYMENT.md` for detailed deployment guide
   - Recommended: Vercel (frontend) + Render (backend)
   - Update CORS to restrict to frontend domain
   - Enable Firebase App Check for production

## Documentation
- `README.md` - Comprehensive setup and feature documentation
- `DEPLOYMENT.md` - Production deployment guide (Vercel, Render, Cloud Run)
- `SECURITY.md` - Security architecture and best practices
- API documentation - Available at `http://localhost:8000/docs` (FastAPI auto-generated)

## Technical Assessment Submission Checklist

- [x] Next.js 15+ with App Router
- [x] FastAPI backend with proper structure
- [x] Firebase Authentication (Email/Password + Google Sign-In)
- [x] Firebase Firestore for database
- [x] Firebase Storage for images
- [x] OpenAI Vision API integration
- [x] AI-generated product titles/descriptions
- [x] User dashboard with real-time updates
- [x] Admin review/approval system
- [x] Role-based access control
- [x] Security rules (Firestore + Storage)
- [x] Comprehensive documentation
- [x] Production-ready security architecture
- [ ] Live deployment URLs (frontend + backend)
- [ ] Loom video demonstration (5-7 minutes)

## Notes
- The project uses placeholder Firebase credentials for structure demonstration
- Replace with actual credentials for full functionality
- Both workflows restart automatically on package changes
- Frontend serves on port 5000 (required for Replit webview)
- Backend API uses CORS to allow frontend access
- Security architecture follows industry best practices with no exposed secrets
