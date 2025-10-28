# Technical Assessment Submission Checklist

## Assessment Deadline
**Due Date**: Wednesday, October 29th  
**Submission Email**: elisabeth@boxsy.io and nish@boxsy.io

## What to Submit

1. **Loom Video** (5-7 minutes)
   - Demonstrate complete user flow
   - Show admin approval workflow
   - Highlight AI generation feature
   - Show real-time updates

2. **GitHub Repository Link**
   - Complete source code
   - Documentation (README, DEPLOYMENT, SECURITY)
   - Security rules (Firestore, Storage)

3. **Live Deployment URLs**
   - Frontend URL (e.g., https://your-app.vercel.app)
   - Backend API URL (e.g., https://your-api.onrender.com)

## Pre-Submission Checklist

### 1. Firebase Setup (Required for Functionality)
- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password + Google Sign-In)
- [ ] Firestore database created
- [ ] Firebase Storage enabled
- [ ] Service account JSON downloaded
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] At least one admin user created

### 2. Environment Configuration
- [ ] Backend `.env` configured with:
  - [ ] OPENAI_API_KEY
  - [ ] FIREBASE_CREDENTIALS_PATH
  - [ ] FIREBASE_STORAGE_BUCKET
  - [ ] GOOGLE_CLOUD_PROJECT
  - [ ] FRONTEND_URL
- [ ] Frontend `.env.local` configured with:
  - [ ] All NEXT_PUBLIC_FIREBASE_* variables
  - [ ] NEXT_PUBLIC_API_URL

### 3. Local Testing
- [ ] Backend API running on port 8000
- [ ] Frontend running on port 5000
- [ ] User registration works
- [ ] User login works (Email + Google)
- [ ] Product image upload works
- [ ] AI description generation works
- [ ] User dashboard shows products
- [ ] Real-time updates work (status changes)
- [ ] Admin can view all products
- [ ] Admin can approve/reject products
- [ ] Security rules prevent unauthorized access

### 4. Code Quality
- [ ] No exposed API keys or secrets
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Responsive design
- [ ] Clean code structure
- [ ] Comprehensive documentation

### 5. Deployment Preparation
- [ ] Choose frontend platform (Vercel recommended)
- [ ] Choose backend platform (Render recommended)
- [ ] Update CORS to restrict to frontend domain
- [ ] Configure environment variables in deployment platforms
- [ ] Upload Firebase service account to backend platform
- [ ] Test deployed application

### 6. Video Recording Preparation
- [ ] Create test user account
- [ ] Create admin user account
- [ ] Prepare sample product images
- [ ] Practice demonstration flow
- [ ] Ensure screen recording is clear

## Loom Video Script (5-7 minutes)

### Introduction (30 seconds)
"Hi, I'm [Your Name], and this is my submission for the Full-Stack Engineer technical assessment. I've built an AI-powered product listing platform using Next.js 15, FastAPI, Firebase, and OpenAI Vision API."

### User Flow (2 minutes)
1. **Sign Up/Login**
   - Show email/password registration
   - OR show Google Sign-In
   - Explain Firebase Authentication

2. **Upload Product**
   - Navigate to upload page
   - Select product image
   - Click "Generate AI Description"
   - Show AI-generated title and description
   - Explain OpenAI Vision API integration
   - Submit product

3. **User Dashboard**
   - Show pending product
   - Explain real-time Firestore listeners
   - Show product status updates instantly

### Admin Flow (2 minutes)
1. **Admin Login**
   - Logout as user
   - Login as admin
   - Navigate to admin dashboard

2. **Review Products**
   - Show all pending products
   - Filter by status
   - Approve a product
   - Show real-time update on user dashboard
   - Reject a product

### Technical Highlights (1-2 minutes)
1. **Architecture**
   - Monorepo structure (backend + frontend)
   - Next.js 15 App Router
   - FastAPI with proper structure
   - Firebase integration

2. **Security**
   - Firebase ID token authentication
   - No exposed API keys
   - Firestore security rules
   - Storage security rules
   - Role-based access control

3. **Features**
   - Real-time updates
   - AI-powered descriptions
   - Responsive design
   - Error handling

### Closing (30 seconds)
"The application is fully deployed with live URLs provided. All source code, documentation, and deployment guides are available in the GitHub repository. Thank you for reviewing my submission!"

## Quick Deployment Guide

### Frontend (Vercel)
```bash
cd frontend
vercel
# Follow prompts
# Add environment variables in Vercel dashboard
vercel --prod
```

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repo
3. Set root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Upload Firebase service account as secret file
8. Deploy

### Post-Deployment
- [ ] Test frontend URL
- [ ] Test backend API (visit `/docs` endpoint)
- [ ] Test complete user flow
- [ ] Test admin flow
- [ ] Verify real-time updates work

## Creating Admin User

After deploying:

```bash
# Option 1: Local with Firebase credentials
python backend/scripts/set_admin_claim.py <user_uid>

# Option 2: SSH into backend server (Render)
# Navigate to your service shell
python scripts/set_admin_claim.py <user_uid>
```

To get user UID:
1. Go to Firebase Console > Authentication > Users
2. Find user email
3. Copy UID

**Important**: User must log out and log back in after admin claim is set.

## Email Template

**Subject**: Full-Stack Engineer Assessment Submission - [Your Name]

**Body**:
```
Hello Elisabeth and Nish,

I'm submitting my completed Full-Stack Engineer technical assessment.

Project: AI-Powered Product Listing Platform

Deliverables:
- Loom Video: [your-loom-link]
- GitHub Repository: [your-github-repo-link]
- Live Frontend: [your-frontend-url]
- Live Backend API: [your-backend-api-url]

Tech Stack:
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- Database/Auth: Firebase (Firestore, Authentication, Storage)
- AI: OpenAI Vision API (GPT-4o)

Key Features:
- User authentication (Email/Password + Google Sign-In)
- AI-powered product description generation
- Real-time dashboard updates
- Admin review/approval system
- Comprehensive security implementation

Test Accounts:
- User: [test-user@email.com] / [password]
- Admin: [admin@email.com] / [password]

All source code includes comprehensive documentation and deployment guides.

Thank you for the opportunity!

Best regards,
[Your Name]
```

## Common Issues & Solutions

### Issue: Firebase service account not found
**Solution**: Ensure service account JSON is uploaded to backend platform at correct path

### Issue: CORS errors
**Solution**: Update FRONTEND_URL in backend .env and restart backend

### Issue: AI generation fails
**Solution**: Verify OPENAI_API_KEY is correct and has GPT-4 Vision access

### Issue: Admin can't approve products
**Solution**: Verify admin claim is set and user has logged out/in

### Issue: Real-time updates not working
**Solution**: Check Firestore security rules are deployed

## Final Review

Before submission, verify:
- [ ] All features demonstrated in video work correctly
- [ ] Live URLs are accessible
- [ ] GitHub repo is public (or access granted)
- [ ] Email sent to both recipients
- [ ] Loom video is viewable by anyone with link
- [ ] Test accounts work (if provided)

## Time Management

Suggested timeline for completion:
- **4-6 hours before deadline**: Deploy applications
- **3-4 hours before deadline**: Test deployed version
- **2-3 hours before deadline**: Record Loom video
- **1-2 hours before deadline**: Review and submit email
- **Buffer**: 1 hour for unexpected issues

## Good Luck!

You've built a comprehensive, production-ready application that demonstrates:
- Full-stack development skills
- Modern tech stack proficiency
- Security best practices
- Clean code and documentation
- Real-time features
- AI integration

Your submission showcases professional-level work. Best of luck with your assessment!
