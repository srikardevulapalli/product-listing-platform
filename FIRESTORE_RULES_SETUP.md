# Update Firestore Security Rules

Your products are being created successfully, but the dashboard can't load them because Firestore security rules are blocking access.

## Quick Fix (2 minutes):

### 1. Open Firestore Rules:
- Go to: https://console.firebase.google.com/project/boxsy-product/firestore/rules
- OR: Firebase Console → Firestore Database → Rules tab

### 2. Replace the existing rules with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection
    match /products/{productId} {
      // Allow users to read their own products
      allow read: if request.auth != null && 
                     resource.data.user_id == request.auth.uid;
      
      // Allow users to create products (handled by backend, but frontend can write)
      allow create: if request.auth != null && 
                       request.resource.data.user_id == request.auth.uid;
      
      // Allow users to update their own products
      allow update: if request.auth != null && 
                       resource.data.user_id == request.auth.uid;
      
      // Allow users to delete their own products
      allow delete: if request.auth != null && 
                       resource.data.user_id == request.auth.uid;
    }
    
    // Admin can read all products
    match /products/{productId} {
      allow read, write: if request.auth != null && 
                            request.auth.token.admin == true;
    }
  }
}
```

### 3. Click "Publish"

### 4. Refresh your dashboard

That's it! Your products will now load on the dashboard.

---

## What These Rules Do:

✅ **Users can read/write their own products** (based on `user_id` field)
✅ **Admins can read/write all products** (based on admin claim)
✅ **Blocks unauthorized access** (requires authentication)
✅ **Secure and production-ready**

---

## After Publishing:

1. Go to your dashboard
2. You should see "Vibrant Red Nike Free Flyknit Sneakers" product
3. Stats should show: 1 Total Product, 1 Pending Review
4. Everything will work! 🎉
