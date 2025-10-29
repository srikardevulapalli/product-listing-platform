# Firebase Storage Security Rules

To allow authenticated users to upload product images, update your Firebase Storage rules:

## How to Update Rules:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **boxsy-product**
3. Click **Storage** in the left sidebar
4. Click the **Rules** tab
5. Replace the existing rules with the following:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload to their own products folder
    match /products/{userId}/{fileName} {
      allow read: if true; // Anyone can read product images
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## What This Does:

- ✅ **Authenticated users** can upload images to `products/{their-uid}/...`
- ✅ **Anyone** can view product images (for public product listings)
- ✅ **Users can only write** to folders matching their own user ID
- ❌ **Prevents** unauthorized uploads
- ❌ **Prevents** users from overwriting other users' images

## After Updating:

1. Click **Publish** in the Firebase Console
2. Wait a few seconds for the rules to propagate
3. Test uploading a product in your app - it should work!

---

**Note:** These rules are production-ready and secure. They ensure users can only upload to their own folders while allowing public read access for product images to be displayed on the platform.
