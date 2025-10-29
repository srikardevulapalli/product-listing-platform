# Deployment Guide - Product Listing Platform

Complete guide for deploying your Full-Stack application (Next.js + FastAPI + Firebase) to production.

---

## 📋 Pre-Deployment Checklist

### 1. Firebase Configuration
- ✅ Firestore database created and rules published
- ✅ Firebase Storage configured with proper rules
- ✅ Firebase Authentication enabled
- ✅ All environment secrets configured

### 2. Code Ready
- ✅ All features tested locally
- ✅ No console errors
- ✅ Image upload working
- ✅ AI description generation working
- ✅ Admin panel functional

---

## 🚀 Deployment Steps

## Part 1: Deploy Backend (FastAPI)

### Option A: Deploy to Render (Recommended)

**Step 1: Prepare Backend**
```bash
# Make sure you have these files in /backend
# - requirements.txt
# - app/
# - main.py or similar entry point
```

**Step 2: Create Render Account**
1. Go to https://render.com
2. Sign up with GitHub

**Step 3: Create New Web Service**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `product-listing-api` (or your choice)
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Step 4: Add Environment Variables**
Go to "Environment" tab and add:
```
FIREBASE_SERVICE_ACCOUNT_JSON=<your_firebase_service_account_json>
OPENAI_API_KEY=<your_openai_api_key>
SESSION_SECRET=<generate_random_secret>
MASTER_ADMIN_KEY=<generate_random_key_for_admin>
```

**Step 5: Deploy**
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your API URL will be: `https://product-listing-api.onrender.com`

---

### Option B: Deploy to Google Cloud Run

**Step 1: Create Dockerfile** (in /backend)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

**Step 2: Deploy**
```bash
cd backend
gcloud run deploy product-listing-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Step 3: Set Environment Variables**
```bash
gcloud run services update product-listing-api \
  --update-env-vars FIREBASE_SERVICE_ACCOUNT_JSON="..." \
  --update-env-vars OPENAI_API_KEY="..."
```

---

## Part 2: Deploy Frontend (Next.js)

### Option A: Deploy to Vercel (Recommended)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
cd frontend
vercel
```

**Step 3: Configure Environment Variables**
In Vercel Dashboard → Project → Settings → Environment Variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=<your_api_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<project_id>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<project_id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<project_id>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<app_id>
NEXT_PUBLIC_API_URL=https://product-listing-api.onrender.com
```

**Step 4: Redeploy**
```bash
vercel --prod
```

Your frontend will be live at: `https://your-project.vercel.app`

---

### Option B: Deploy to Netlify

**Step 1: Build Configuration**
Create `netlify.toml` in /frontend:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Step 2: Deploy**
1. Go to https://netlify.com
2. Connect GitHub repository
3. Set build directory: `frontend`
4. Set build command: `npm run build`
5. Add environment variables (same as Vercel above)

---

## Part 3: Update Frontend API URL

**Update Frontend to Use Production API**

Edit `frontend/lib/api.ts`:
```typescript
// Change this:
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// To this (replace with your actual API URL):
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://product-listing-api.onrender.com';
```

---

## Part 4: Firebase Configuration for Production

### 1. Update Firestore Rules
Already configured! Your current rules work for production.

### 2. Update Firebase Storage Rules
Already configured! Your current storage rules work for production.

### 3. Add Production Domains to Firebase
1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", add:
   - `your-project.vercel.app`
   - `product-listing-api.onrender.com`

---

## 🔐 Part 5: Admin Access After Deployment

### Method 1: Using API Endpoint (Recommended)

**Step 1: Make sure MASTER_ADMIN_KEY is set** in your backend environment variables

**Step 2: Get Your User UID**
1. Sign up on your production app
2. Go to Firebase Console → Authentication → Users
3. Copy your UID

**Step 3: Call the Admin Endpoint**
```bash
curl -X POST https://product-listing-api.onrender.com/admin/set-admin-role \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_UID_HERE",
    "master_key": "YOUR_MASTER_ADMIN_KEY"
  }'
```

**Step 4: Sign Out and Back In**
Admin access will be active!

---

### Method 2: Using Firebase Console (Alternative)

1. Go to Firebase Console → Authentication → Users
2. Click on your user
3. In "Custom claims" section, add:
```json
{
  "admin": true
}
```

**Note**: This requires Firebase Admin SDK setup, Method 1 is easier.

---

## 🧪 Testing Deployment

### 1. Test Backend API
```bash
# Health check
curl https://product-listing-api.onrender.com/

# Should return: {"message": "Product Listing API"}
```

### 2. Test Frontend
1. Visit your Vercel URL
2. Sign up / Sign in
3. Upload a product
4. Check dashboard

### 3. Test Admin Panel
1. Set admin role (see Part 5 above)
2. Sign in
3. Visit `/admin`
4. Approve/reject products

---

## 🔄 Updating After Deployment

### Update Backend
```bash
git push origin main
# Render/Cloud Run will auto-deploy
```

### Update Frontend
```bash
cd frontend
vercel --prod
# Or push to main for auto-deploy
```

---

## 🌐 Custom Domain (Optional)

### For Vercel (Frontend)
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain: `yourproduct.com`
3. Update DNS records as shown

### For Render (Backend)
1. Render Dashboard → Web Service → Settings → Custom Domains
2. Add your API domain: `api.yourproduct.com`
3. Update DNS records

---

## 📊 Monitoring & Logs

### Backend Logs (Render)
- Go to Render Dashboard → Your Service → Logs
- Real-time logs and errors

### Frontend Logs (Vercel)
- Go to Vercel Dashboard → Project → Deployments → Logs
- Runtime errors and build logs

### Firebase Logs
- Firebase Console → Firestore → Usage
- Monitor reads/writes/storage

---

## 🔒 Security Best Practices (Production)

### 1. Environment Variables
- ✅ Never commit secrets to Git
- ✅ Use platform environment variables
- ✅ Rotate keys periodically

### 2. CORS Configuration
Update `backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",
        "https://yourproduct.com"  # your custom domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Firebase Security
- ✅ Firestore rules restrict access
- ✅ Storage rules require authentication
- ✅ Admin claims properly validated

---

## 📝 Submission Checklist

For your technical assessment submission:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Test user account created
- [ ] At least one product uploaded
- [ ] Admin access configured
- [ ] Loom video recorded (5-7 minutes)
- [ ] Email sent to elisabeth@boxsy.io and nish@boxsy.io

### Email Template
```
Subject: Full-Stack Engineer Assessment - [Your Name]

Hi Elisabeth and Nish,

I've completed the Full-Stack Engineering technical assessment. Here are the details:

**Live URLs:**
- Frontend: https://your-project.vercel.app
- Backend API: https://product-listing-api.onrender.com

**Demo Video:**
- Loom: [Your Loom URL]

**Test Credentials:**
- Email: demo@example.com
- Password: demo123

**Features Implemented:**
✅ Firebase Authentication (email/password)
✅ Product upload with image storage
✅ AI-powered descriptions (OpenAI Vision)
✅ Real-time dashboard with Firestore
✅ Admin review panel
✅ Responsive UI with loading states

**Tech Stack:**
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- Services: Firebase (Auth, Firestore, Storage), OpenAI Vision API

Looking forward to discussing the implementation!

Best regards,
[Your Name]
```

---

## 🆘 Troubleshooting

### Issue: CORS Errors
**Solution**: Update CORS settings in backend to include production domains

### Issue: Firebase 403 Errors
**Solution**: Check Firestore rules and ensure authorized domains are added

### Issue: Images Not Loading
**Solution**: Verify Firebase Storage rules and CORS configuration

### Issue: API 500 Errors
**Solution**: Check backend logs in Render/Cloud Run dashboard

### Issue: "Module not found" on Vercel
**Solution**: Ensure all dependencies are in package.json

---

## ✅ Final Notes

- **Build time**: Render free tier may take 1-2 minutes to wake up
- **Costs**: Free tiers should cover assessment requirements
- **Admin access**: Must be set after first deployment
- **Video**: Show product upload → AI generation → admin approval flow

Good luck with your deployment! 🚀

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
