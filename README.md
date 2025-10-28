# AI-Powered Product Listing Platform

A full-stack application built with Next.js 15, FastAPI, and Firebase that enables users to upload product images and leverage AI to automatically generate product titles, descriptions, and keywords.

## Features

- **Firebase Authentication**: Email/Password and Google Sign-In
- **AI-Powered Descriptions**: OpenAI Vision API generates product metadata from images
- **Real-time Updates**: Firestore real-time listeners for instant status changes
- **Admin Dashboard**: Approve/reject product listings with role-based access
- **Secure Storage**: Firebase Storage with comprehensive security rules
- **Responsive UI**: Built with Tailwind CSS and ShadCN components
- **Type-Safe**: Full TypeScript implementation

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- Firebase SDK (Auth, Firestore, Storage)

### Backend
- FastAPI
- Python 3.11+
- Firebase Admin SDK
- OpenAI Python SDK
- Pydantic for validation

## Project Structure

```
/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── schemas/        # Pydantic models
│   │   ├── middleware/     # Auth middleware
│   │   └── main.py         # FastAPI app
│   └── requirements.txt
├── frontend/               # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   └── contexts/         # React contexts
├── firestore.rules        # Firestore security rules
└── storage.rules          # Storage security rules
```

## Setup Instructions

### Prerequisites
- Node.js 20+
- Python 3.11+
- Firebase project
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with the following variables:
```env
OPENAI_API_KEY=your_openai_api_key
FIREBASE_CREDENTIALS_PATH=path_to_service_account.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
API_SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:3000
```

4. Download Firebase service account credentials:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Generate new private key
   - Save as `firebase-service-account.json` in the backend directory

5. Run the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_SECRET_KEY=your_secret_key
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Firebase Configuration

1. **Deploy Firestore Rules**:
   - Copy contents of `firestore.rules`
   - Paste in Firebase Console > Firestore Database > Rules
   - Publish rules

2. **Deploy Storage Rules**:
   - Copy contents of `storage.rules`
   - Paste in Firebase Console > Storage > Rules
   - Publish rules

3. **Set Admin User** (after first user registration):
   ```bash
   curl -X POST http://localhost:8000/admin/set-admin/{user_uid} \
     -H "X-API-Key: your_api_secret_key" \
     -H "Authorization: Bearer {firebase_id_token}"
   ```

## API Documentation

Once the backend is running, visit:
- API docs: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend (Render / Cloud Run)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

## Features Demonstration

### User Flow
1. **Sign Up/Login**: Email/Password or Google Sign-In
2. **Upload Product**: 
   - Select image
   - Generate AI description (automatic title, description, keywords)
   - Submit product listing (status: pending)
3. **View Dashboard**: Real-time updates when admin changes status

### Admin Flow
1. **Login as Admin**: Must be set via backend API
2. **Review Products**: View all pending products
3. **Approve/Reject**: Update product status
4. **Real-time Updates**: Users see status changes instantly

## Security Features

- API key authentication for backend endpoints
- Firebase ID token validation
- Role-based access control (admin)
- Firestore security rules
- Storage security rules with file size and type validation
- Environment variable protection

## License

MIT

## Contact

For questions or issues, please open an issue on GitHub.
