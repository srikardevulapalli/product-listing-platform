# Update Firestore Security Rules

Your Firestore rules need to be updated to allow admins to approve products.

## Quick Fix (2 minutes):

### 1. Open Firestore Rules:
- Go to: https://console.firebase.google.com/project/boxsy-product/firestore/rules
- OR: Firebase Console → Firestore Database → Rules tab

### 2. Replace ALL rules with this (copy exactly):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      // Admins can read/write ALL products
      allow read, write: if request.auth != null && 
                            request.auth.token.admin == true;
      
      // Users can read/write their OWN products
      allow read, write: if request.auth != null && 
                            resource.data.user_id == request.auth.uid;
      
      // Users can create new products
      allow create: if request.auth != null && 
                       request.resource.data.user_id == request.auth.uid;
    }
  }
}
```

### 3. Click "Publish"

### 4. Refresh your admin panel

---

## What These Rules Do:

✅ **Admins can read/write ALL products** (checks for `admin: true` claim)
✅ **Regular users can only read/write their own products** (checks `user_id` matches)
✅ **Everyone can create products** (if authenticated)
✅ **Blocks unauthorized access**

---

## After Publishing:

1. Make sure you're logged in as admin (run `python make_admin.py your_email@example.com` if you haven't)
2. Sign out and back in (required for admin claim to work)
3. Go to `/admin` 
4. You'll see all pending products
5. Click "Approve" - it will work! ✅

---

## Why the Error Happened:

The previous rules only allowed users to see products where `user_id == their_uid`. Admins need special permission to see ALL products, which the new rules provide by checking `request.auth.token.admin == true`.
