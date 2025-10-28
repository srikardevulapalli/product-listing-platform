# Admin Role Setup Guide

This guide explains how to create admin users for the Product Listing Platform.

## Overview

The application has two methods for setting admin roles:
1. **Secure API Endpoint** (Recommended for deployment)
2. **Server-Side Script** (For local development)

## Method 1: Secure API Endpoint (Recommended)

This method uses a master admin key to securely set admin roles via the backend API.

### Setup

1. **Set Master Admin Key**

   Add to your backend environment variables:
   ```env
   MASTER_ADMIN_KEY=your-secure-random-key-here
   ```

   Generate a secure random key:
   ```bash
   # Using Python
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   
   # Using OpenSSL
   openssl rand -base64 32
   ```

2. **Keep the Master Key Secure**
   - Never commit it to version control
   - Store it in environment variables only
   - Share it only with trusted administrators
   - Use different keys for development and production

### Usage

**Using cURL:**
```bash
curl -X POST https://your-backend-api.com/admin/set-admin-role \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "firebase_user_uid_here",
    "master_key": "your_master_admin_key"
  }'
```

**Using Postman:**
1. Method: POST
2. URL: `https://your-backend-api.com/admin/set-admin-role`
3. Headers:
   - Content-Type: application/json
4. Body (raw JSON):
   ```json
   {
     "user_id": "firebase_user_uid",
     "master_key": "your_master_admin_key"
   }
   ```

**Using Python:**
```python
import requests

response = requests.post(
    'https://your-backend-api.com/admin/set-admin-role',
    json={
        'user_id': 'firebase_user_uid_here',
        'master_key': 'your_master_admin_key'
    }
)

print(response.json())
```

**Using JavaScript:**
```javascript
fetch('https://your-backend-api.com/admin/set-admin-role', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 'firebase_user_uid_here',
    master_key: 'your_master_admin_key'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Getting User UID

1. **Via Firebase Console:**
   - Go to Firebase Console > Authentication > Users
   - Find the user by email
   - Copy their UID

2. **Via API** (as authenticated user):
   ```bash
   curl -X GET https://your-backend-api.com/auth/me \
     -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
   ```

### Response

**Success:**
```json
{
  "message": "Admin role successfully set for user abc123",
  "user_id": "abc123",
  "note": "User must log out and log back in for the claim to take effect"
}
```

**Error - Invalid Master Key:**
```json
{
  "detail": "Invalid master key"
}
```

**Error - User Not Found:**
```json
{
  "detail": "User not found"
}
```

### Important Notes

- **User must log out and log back in** after admin role is set
- The master key is validated server-side
- Invalid master keys result in 403 Forbidden
- The endpoint does not require user authentication (only master key)

## Method 2: Server-Side Script (Local Development)

For local development or when you have direct server access:

```bash
# SSH into your server or run locally
cd backend
python scripts/set_admin_claim.py <user_uid>
```

This method requires:
- Firebase service account JSON file
- Direct access to the backend server
- Python environment with firebase-admin installed

## Security Best Practices

1. **Master Key Management:**
   - Use environment variables, never hardcode
   - Rotate keys periodically
   - Use different keys for dev/staging/production
   - Store securely (e.g., in secret management systems)

2. **Access Control:**
   - Only share master key with trusted administrators
   - Consider implementing IP allowlisting for the endpoint
   - Monitor logs for unauthorized admin role attempts

3. **Audit Logging:**
   - Log all admin role assignments
   - Include timestamp, user ID, and requesting IP
   - Review logs regularly for suspicious activity

## For Loom Video Demonstration

When demonstrating admin functionality in your video:

1. **Show the setup:**
   - Briefly mention the MASTER_ADMIN_KEY environment variable
   - Explain it's kept secret and not committed to the repo

2. **Demonstrate setting admin role:**
   - Use Postman or cURL to call the endpoint
   - Show the successful response
   - Explain that the user must log out and log back in

3. **Show admin features:**
   - Log out as regular user
   - Log in as the admin user
   - Demonstrate admin dashboard and approval workflow

## Troubleshooting

### "Master admin key not configured on server"
- Ensure MASTER_ADMIN_KEY is set in your backend environment variables
- Restart the backend after adding the environment variable

### "Invalid master key"
- Double-check the master key value
- Ensure there are no extra spaces or newlines
- Verify you're using the correct environment (dev vs production)

### "User not found"
- Verify the user UID is correct
- Check Firebase Console to confirm the user exists
- Ensure Firebase Admin SDK is properly initialized

### Admin permissions not working after setting role
- User must log out and log back in
- Check Firebase custom claims in Authentication tab
- Verify admin middleware is checking claims correctly

## Example Workflow

```bash
# 1. Set master admin key in backend .env
echo "MASTER_ADMIN_KEY=$(openssl rand -base64 32)" >> backend/.env

# 2. Restart backend
# (Workflows restart automatically on Replit)

# 3. Register a new user via the app
# (or use existing user)

# 4. Get user UID from Firebase Console

# 5. Set admin role
curl -X POST http://localhost:8000/admin/set-admin-role \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_UID_HERE",
    "master_key": "YOUR_MASTER_KEY"
  }'

# 6. Have user log out and log back in

# 7. User now has admin access
```

## For Production Deployment

When deploying to production:

1. Generate a strong master key:
   ```bash
   openssl rand -base64 48
   ```

2. Add to your deployment platform:
   - **Render**: Environment Variables section
   - **Vercel**: Environment Variables (if using serverless functions)
   - **Google Cloud Run**: Secret Manager
   - **Railway**: Environment Variables section

3. Test the endpoint:
   ```bash
   curl -X POST https://your-production-api.com/admin/set-admin-role \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "production_user_uid",
       "master_key": "your_production_master_key"
     }'
   ```

4. Verify admin access in production

## Summary

The secure API endpoint method provides:
- ✅ Easy to use via HTTP requests
- ✅ Works with any deployment platform
- ✅ No server SSH access required
- ✅ Secure with master key authentication
- ✅ Perfect for demonstration in Loom video
- ✅ Production-ready

Use this method for your technical assessment submission and production deployments.
