# How to Approve Products

## What is "Pending Review"?

When you create a product, it gets the status **"pending"**. This means:
- ✅ Product is saved successfully
- ⏳ Waiting for admin approval
- 📋 Shows up in "Pending Review" section on dashboard

## How to Approve Products (3 Steps)

### **Step 1: Make Yourself an Admin**

Run this command in the Replit Shell (replace with your email):

```bash
python make_admin.py your_email@example.com
```

**Example:**
```bash
python make_admin.py john@example.com
```

You'll see:
```
✅ Found user: john@example.com (UID: abc123...)
✅ Admin role set for john@example.com
⚠️  IMPORTANT: You must sign out and sign back in for changes to take effect!
```

---

### **Step 2: Sign Out and Back In**

1. Click "Sign Out" button in your dashboard
2. Sign in again with the same email
3. You'll now have admin access!

---

### **Step 3: Access Admin Panel**

1. Go to your dashboard
2. You'll now see **"Admin Panel"** button in the header
3. Click it to go to `/admin`
4. You'll see all pending products
5. Click **"Approve"** or **"Reject"** buttons

---

## Admin Panel Features

Once you're an admin, you can:

- ✅ **View all products** from all users
- ✅ **Filter by status**: Pending, All
- ✅ **Approve products**: Changes status to "approved"
- ✅ **Reject products**: Changes status to "rejected"
- ✅ **Real-time updates**: See changes instantly

---

## Product Status Workflow

```
User uploads product
        ↓
    [PENDING] ← Default status
        ↓
    Admin reviews
        ↓
    ┌───────┴───────┐
    ↓               ↓
[APPROVED]    [REJECTED]
```

---

## For Your Demo Video

To demonstrate the full workflow in your Loom video:

1. **Create a product** as a regular user (pending status)
2. **Make yourself admin** using the script
3. **Sign out and back in**
4. **Access Admin Panel** (show the button appears)
5. **Approve the product** (click approve button)
6. **Go back to dashboard** (show it now says "1 Approved")

This showcases the complete review workflow! 🎉
