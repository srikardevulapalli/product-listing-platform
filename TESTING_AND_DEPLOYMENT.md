# Testing & Deployment Guide

## ✅ Current Status

Your Product Listing Platform is **fully configured and running** on Replit!

- **Frontend**: Running on port 5000 (webview)
- **Backend API**: Running on port 8000
- **All Firebase services configured**: Authentication, Firestore, Storage
- **OpenAI integration active**: AI description generation ready

---

## 🧪 Testing on Replit

### 1. **Test Authentication**
1. Click **"Sign Up"** button
2. Enter:
   - Email: `test@example.com`
   - Password: `test123` (min 6 characters)
   - Display Name: `Test User`
3. Click **"Create Account"**
4. You should be redirected to the dashboard

### 2. **Test Product Upload**
1. After logging in, click **"Add Product"** in the navigation
2. Upload an image (click "Choose File")
3. Click **"Generate AI Description"** - AI will analyze the image
4. Fill in:
   - Title: `Sample Product`
   - Keywords: `sample, test, product`
5. Click **"Create Product"**
6. Product should appear in your dashboard

### 3. **Test Dashboard**
1. Navigate to **"Dashboard"**
2. You should see your products
3. Try editing/deleting a product

---

## 🚀 Deployment Instructions

### **Frontend Deployment (Vercel)**

#### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Product Listing Platform - Ready for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-project>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-project>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
NEXT_PUBLIC_API_URL=<your-backend-url-from-render>
```

#### Step 4: Deploy
Click **"Deploy"** and wait for build to complete.

---

### **Backend Deployment (Render)**

#### Step 1: Deploy to Render
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `product-listing-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### Step 2: Add Environment Variables
In Render service → Environment, add:

```
OPENAI_API_KEY=<your-openai-key>
FIREBASE_SERVICE_ACCOUNT_JSON=<your-service-account-json>
SESSION_SECRET=<random-secure-string>
MASTER_ADMIN_KEY=<your-admin-master-key>
FRONTEND_URL=<your-vercel-url>
```

**Important**: For `FIREBASE_SERVICE_ACCOUNT_JSON`, paste the entire JSON content from your service account file.

#### Step 3: Deploy
Click **"Create Web Service"** and wait for deployment.

#### Step 4: Update Frontend
1. Copy your Render backend URL (e.g., `https://product-listing-backend.onrender.com`)
2. Go back to Vercel → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` with your Render URL
4. Redeploy frontend

---

## 🔐 Setting Up Admin Access

After deployment, you'll need to set up your first admin user:

### Step 1: Get Your Firebase UID
1. Sign up on your deployed app
2. Open browser DevTools → Console
3. Look for your Firebase UID (it will be logged or visible in the Auth state)

### Step 2: Set Admin Role
Use this curl command (replace placeholders):

```bash
curl -X POST https://your-backend-url/admin/set-admin-role \
  -H "Content-Type: application/json" \
  -H "X-Master-Key: your-master-admin-key" \
  -d '{
    "uid": "your-firebase-uid",
    "is_admin": true
  }'
```

### Step 3: Verify Admin Access
1. Log out and log back in
2. You should now see "Admin" link in navigation
3. Access admin dashboard to review products

---

## 📹 Loom Video Recording Script

### Introduction (30 seconds)
*"Hi, I'm [Your Name]. I built a comprehensive AI-powered product listing platform as part of the Full-Stack Engineering assessment. Let me walk you through the features."*

### Authentication Demo (1 minute)
- Show signup page
- Create a new account
- Demonstrate login
- Show protected routes

### Product Upload & AI Features (2 minutes)
- Navigate to "Add Product"
- Upload a product image
- Click "Generate AI Description"
- Show AI-generated description
- Fill in title and keywords
- Submit product
- Show product in dashboard

### Dashboard Features (1.5 minutes)
- Show product list
- Demonstrate edit functionality
- Show delete confirmation
- Explain real-time updates

### Admin Features (1.5 minutes)
- Log in as admin
- Access admin dashboard
- Show product review system
- Approve/reject products
- Demonstrate status updates

### Technical Overview (1 minute)
- Briefly mention tech stack:
  - Next.js 15 frontend with App Router
  - FastAPI backend
  - Firebase (Auth, Firestore, Storage)
  - OpenAI Vision API
- Show clean folder structure
- Mention deployment readiness

### Closing (30 seconds)
*"Thank you for reviewing my submission. All code is available in the GitHub repository, and both frontend and backend are deployed and accessible via the links provided in my email."*

---

## 📧 Submission Email Template

**Subject**: Full-Stack Engineering Assessment - [Your Name]

**To**: elisabeth@boxsy.io, nish@boxsy.io

**Body**:

```
Hi Elisabeth and Nish,

I've completed the Full-Stack Engineering technical assessment. Please find the details below:

🔗 Live URLs:
- Frontend: https://your-app.vercel.app
- Backend API: https://your-backend.onrender.com
- API Documentation: https://your-backend.onrender.com/docs

📹 Loom Demo Video:
https://www.loom.com/share/your-video-id

💻 GitHub Repository:
https://github.com/your-username/your-repo

✨ Key Features Implemented:
- User authentication with Firebase
- AI-powered product descriptions using OpenAI Vision API
- Real-time product dashboard with CRUD operations
- Admin review system for product approval
- Image upload to Firebase Storage
- Secure backend with Firebase ID token verification
- Responsive UI with Next.js 15 and Tailwind CSS

🧪 Test Credentials:
- Regular User: Create your own via signup
- Admin Access: Contact me for admin demo credentials

Technical Stack:
- Frontend: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- Backend: FastAPI, Python 3.11
- Database: Firebase Firestore
- Storage: Firebase Storage
- AI: OpenAI Vision API
- Auth: Firebase Authentication
- Deployment: Vercel (Frontend) + Render (Backend)

Thank you for your time and consideration. I'm available for any questions or clarifications.

Best regards,
[Your Name]
[Your Email]
[Your Phone - Optional]
```

---

## 🎯 Checklist Before Submission

- [ ] Both frontend and backend deployed successfully
- [ ] All environment variables configured correctly
- [ ] Test signup and login functionality
- [ ] Test product upload with AI description generation
- [ ] Test dashboard CRUD operations
- [ ] Set up at least one admin user
- [ ] Test admin product review flow
- [ ] Record Loom video (5-7 minutes)
- [ ] Upload video to Loom
- [ ] Push all code to GitHub repository
- [ ] Write submission email with all links
- [ ] Send email to both recipients before deadline

---

## 📝 Notes

- **Deadline**: Wednesday, October 29th
- **Submission**: Email to elisabeth@boxsy.io and nish@boxsy.io
- **Video Length**: 5-7 minutes
- **Required**: Live URLs + Loom video + GitHub repo

Good luck! 🚀
