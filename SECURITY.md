# Security Architecture

## Overview
This application implements a multi-layered security approach using Firebase Authentication for identity management and custom security rules for data access control.

## Authentication Flow

### User Authentication
1. **Frontend**: Users authenticate via Firebase Authentication (Email/Password or Google Sign-In)
2. **Token Generation**: Firebase generates a JWT ID token
3. **API Requests**: Frontend includes Firebase ID token in Authorization header
4. **Backend Validation**: FastAPI validates token using Firebase Admin SDK
5. **Authorization**: Backend checks user identity and custom claims (admin role)

### No Exposed Secrets
- ❌ **No API keys in frontend code** - All authentication is handled by Firebase tokens
- ✅ **Server-side validation only** - Backend verifies tokens using Firebase Admin SDK
- ✅ **Custom claims for roles** - Admin status stored as Firebase custom claim

## API Security

### Authentication Middleware
All API endpoints (except root and health check) require valid Firebase ID tokens:

```python
def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    # Validates Firebase ID token
    # Returns user data with custom claims
    # Raises 401 if token is invalid
```

### Authorization Levels

#### 1. Authenticated Users
Can access:
- Their own products (`GET /products/my-products`)
- AI description generation (`POST /products/generate-ai-description`)
- Product creation (`POST /products/`)
- Update/delete their own products

#### 2. Admin Users
Additional access:
- View all products (`GET /admin/products`)
- Update product status (`PATCH /admin/products/{id}/status`)

### Admin Role Management

**✅ Secure Method**: Use server-side script with Firebase credentials
```bash
python backend/scripts/set_admin_claim.py <user_uid>
```

**❌ Insecure Method**: Public API endpoint (removed for security)
- The previous `/admin/set-admin/{uid}` endpoint has been removed
- Admin claims can only be set server-side with proper Firebase Admin credentials

## Firebase Security Rules

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /products/{productId} {
      // Users can read their own products or admins can read all
      allow read: if isAuthenticated() && (
        isOwner(resource.data.user_id) || isAdmin()
      );
      
      // Users can create products
      allow create: if isAuthenticated() && 
        request.resource.data.user_id == request.auth.uid &&
        request.resource.data.status == 'pending';
      
      // Users can update their own products, admins can update any
      allow update: if isAuthenticated() && (
        (isOwner(resource.data.user_id) && 
         request.resource.data.status == resource.data.status) ||
        isAdmin()
      );
      
      // Only admins can delete
      allow delete: if isAdmin();
    }
  }
}
```

**Key Features:**
- User isolation - users can only access their own products
- Admin override - admins can access all products
- Status protection - users cannot change their product status
- Validation - enforces proper data structure on creation

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{userId}/{allPaths=**} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      
      // Users can only write to their own folder
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        request.resource.size < 5 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*');
      
      // Users and admins can delete
      allow delete: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.admin == true);
    }
  }
}
```

**Key Features:**
- Path-based user isolation
- File size limits (5MB)
- Content type validation (images only)
- Admin delete capability

## Data Protection

### Environment Variables
**Backend (.env):**
```env
OPENAI_API_KEY=server_side_only
FIREBASE_CREDENTIALS_PATH=server_side_only
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
GOOGLE_CLOUD_PROJECT=your_project_id
FRONTEND_URL=http://localhost:5000
```

**Frontend (.env.local):**
```env
# Public Firebase config (safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Sensitive Data
- ❌ Never commit `.env` files to version control
- ❌ Never log sensitive tokens or credentials
- ✅ Use environment variables for all secrets
- ✅ Firebase web config is safe to expose (protected by security rules)

## Input Validation

### Backend (Pydantic Schemas)
```python
class ProductCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    keywords: Optional[List[str]] = None
    image_url: str
    user_id: str
```

### Frontend (Form Validation)
- Required field validation
- Type checking (TypeScript)
- File type validation (images only)
- Size validation before upload

## CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],  # Specific origin only in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Production Configuration:**
- Replace `allow_origins=["*"]` with specific frontend domain
- Use HTTPS in production
- Configure proper CORS headers

## Security Checklist

### Development
- [x] Firebase ID tokens for authentication
- [x] No API keys exposed in frontend
- [x] Server-side token validation
- [x] Firebase security rules deployed
- [x] Input validation on backend
- [x] Environment variables for secrets

### Production
- [ ] HTTPS enabled
- [ ] CORS restricted to frontend domain
- [ ] Firebase App Check enabled
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up
- [ ] Regular security audits
- [ ] Dependency updates automated
- [ ] Error messages don't expose sensitive info

## Threat Model

### Mitigated Threats
✅ **Unauthorized Access**: Firebase tokens + security rules prevent unauthorized data access
✅ **Privilege Escalation**: Admin claims only set server-side with proper credentials
✅ **Data Tampering**: Firestore rules prevent users from modifying others' data
✅ **Injection Attacks**: Pydantic validation and Firebase SDK prevent injection
✅ **Exposed Secrets**: No secrets in frontend code or version control

### Remaining Considerations
⚠️ **Rate Limiting**: Consider adding rate limits to prevent abuse
⚠️ **DDoS Protection**: Use Cloud Armor or similar for production
⚠️ **Account Takeover**: Consider multi-factor authentication
⚠️ **Data Backup**: Implement regular Firestore backups
⚠️ **Audit Logging**: Add logging for security-relevant events

## Incident Response

If you suspect a security issue:

1. **Don't panic** - Assess the situation calmly
2. **Document** - Record what you observed
3. **Isolate** - Disable affected components if necessary
4. **Rotate** - Change any potentially compromised credentials
5. **Review** - Check logs for unauthorized access
6. **Fix** - Apply necessary security patches
7. **Monitor** - Watch for continued suspicious activity

## Security Best Practices

1. **Keep dependencies updated** - Regular `npm audit` and `pip audit`
2. **Use strong passwords** - For Firebase service accounts and admin users
3. **Enable 2FA** - On Firebase project and all admin accounts
4. **Monitor logs** - Regular review of Firebase Auth and API logs
5. **Principle of least privilege** - Only grant admin to necessary users
6. **Regular backups** - Automated Firestore and Storage backups
7. **Security testing** - Regular penetration testing and code reviews

## Contact

For security issues, please email: [your-security-email@domain.com]

Do not disclose security vulnerabilities publicly until they are fixed.
