# Usage Guide

## Quick Start

### First Time Setup

1. **Start the Application**
   - Both workflows should already be running
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:5000

2. **Configure Credentials**
   - Update `backend/.env` with your Firebase and OpenAI credentials
   - Update `frontend/.env.local` with your Firebase web config
   - Restart workflows after updating environment variables

3. **Deploy Firebase Rules**
   - Copy contents of `firestore.rules` to Firebase Console > Firestore > Rules
   - Copy contents of `storage.rules` to Firebase Console > Storage > Rules

### User Flow

#### 1. Registration
- Navigate to http://localhost:5000
- Click "Sign Up"
- Enter email and password OR use Google Sign-In
- Automatically redirected to dashboard

#### 2. Upload Product
- Click "Upload Product" from dashboard
- Select a product image
- Click "Generate Description with AI" (requires OpenAI API key)
- AI will populate title, description, and keywords
- Edit if needed
- Click "Create Product"
- Product status will be "pending"

#### 3. View Dashboard
- See all your uploaded products
- Status badges: pending (yellow), approved (green), rejected (red)
- Real-time updates when admin changes status
- View product details including keywords

#### 4. Admin Access (if admin)
- Click "Admin Panel" from dashboard
- Filter by "Pending Only" or "All Products"
- Review product listings
- Click "Approve" or "Reject"
- Changes reflect in real-time

### Admin Setup

To create an admin user, you need to set custom claims via the backend API or Firebase Console.

#### Method 1: Using Backend API

```bash
# First, register a user and get their Firebase UID from:
# Firebase Console > Authentication > Users

# Get the user's Firebase ID token (from browser DevTools)
# Application > IndexedDB > firebaseLocalStorage

# Set admin claim
curl -X POST http://localhost:8000/admin/set-admin/USER_UID_HERE \
  -H "X-API-Key: dev-secret-key-change-in-production" \
  -H "Authorization: Bearer FIREBASE_ID_TOKEN_HERE"
```

#### Method 2: Using Firebase Admin SDK

Create a script `backend/create_admin.py`:

```python
import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate('firebase-service-account.json')
firebase_admin.initialize_app(cred)

uid = 'USER_UID_HERE'
auth.set_custom_user_claims(uid, {'admin': True})
print(f'Admin claim set for user {uid}')
```

Run: `python backend/create_admin.py`

### API Endpoints

#### Public Endpoints
- `GET /` - API status
- `GET /health` - Health check

#### Product Endpoints (requires authentication)
- `POST /products/generate-ai-description` - Generate AI description
- `POST /products/` - Create product
- `GET /products/my-products` - Get user's products
- `GET /products/{product_id}` - Get specific product
- `PATCH /products/{product_id}` - Update product
- `DELETE /products/{product_id}` - Soft delete product

#### Admin Endpoints (requires admin role)
- `GET /admin/products` - Get all products
- `PATCH /admin/products/{product_id}/status` - Update product status
- `POST /admin/set-admin/{uid}` - Set admin role for user

### Testing the Application

1. **Test User Registration**
   - Register with email/password
   - Verify user appears in Firebase Console > Authentication

2. **Test Google Sign-In**
   - Click "Sign in with Google"
   - Authorize the app
   - Verify successful login

3. **Test Product Upload**
   - Select an image (JPEG, PNG)
   - Verify AI generates title and description
   - Submit product
   - Check Firebase Console > Firestore > products collection

4. **Test Real-time Updates**
   - Open dashboard in two browser windows
   - In one window, act as admin and approve/reject
   - In other window, verify status updates in real-time

5. **Test Admin Functions**
   - Login as admin user
   - Access admin panel
   - Approve/reject products
   - Verify real-time updates

### Troubleshooting

#### "AI generation failed"
- Check OPENAI_API_KEY is set correctly
- Verify OpenAI account has credits
- Check image size (must be < 20MB for base64 encoding)

#### "Firebase initialization failed"
- Verify firebase-service-account.json exists
- Check FIREBASE_CREDENTIALS_PATH is correct
- Verify Firebase project ID in environment variables

#### "Real-time updates not working"
- Check Firestore rules are deployed
- Verify user is authenticated
- Check browser console for errors
- Ensure Firebase SDK is properly initialized

#### "Cannot upload images"
- Check Storage rules are deployed
- Verify FIREBASE_STORAGE_BUCKET is correct
- Check user authentication
- Verify image file type is allowed (JPEG, PNG, GIF, WebP)

#### "Admin panel not visible"
- Verify user has admin custom claim
- Check Firebase Authentication > Users > Custom Claims
- Re-login after setting admin claim (token needs refresh)

### Development Tips

1. **View API Documentation**
   - Navigate to http://localhost:8000/docs
   - Interactive Swagger UI for testing endpoints

2. **Monitor Logs**
   - Backend logs show in console
   - Frontend logs in browser DevTools
   - Check Firestore Console for data changes

3. **Debugging**
   - Use browser DevTools > Network tab for API calls
   - Check browser Console for errors
   - View Firestore data in Firebase Console

4. **Hot Reload**
   - Backend: Auto-reloads on file changes (uvicorn --reload)
   - Frontend: Next.js Fast Refresh on save

### Best Practices

1. **Security**
   - Never commit `.env` files
   - Use strong API secret keys in production
   - Rotate keys regularly
   - Keep Firebase service account secure

2. **Image Uploads**
   - Compress large images before upload
   - Use appropriate file formats (JPEG for photos, PNG for graphics)
   - Check file size before processing

3. **AI Generation**
   - Review AI-generated content before saving
   - Edit descriptions to match your brand voice
   - Keep keywords relevant and specific

4. **Admin Actions**
   - Review products carefully before approving
   - Provide feedback for rejected products (future feature)
   - Monitor pending queue regularly

### Performance Optimization

1. **Frontend**
   - Images are lazy-loaded
   - Real-time listeners automatically cleanup
   - Component memoization where needed

2. **Backend**
   - Connection pooling for Firebase
   - Lazy initialization of services
   - Efficient Firestore queries with indexes

3. **Firebase**
   - Composite indexes for complex queries
   - Security rules prevent over-fetching
   - Storage rules limit file sizes

### Deployment Checklist

Before deploying to production:

- [ ] Update all placeholder credentials
- [ ] Deploy Firebase security rules
- [ ] Configure production domains in Firebase Auth
- [ ] Update CORS settings for production URLs
- [ ] Set strong API secret keys
- [ ] Enable Firebase App Check (optional)
- [ ] Set up monitoring and logging
- [ ] Test all features in production environment
- [ ] Create backup strategy for Firestore data
- [ ] Document admin user creation process

For detailed deployment instructions, see `DEPLOYMENT.md`.
