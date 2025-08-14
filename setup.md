# Personal Cloud Storage - Setup Guide

## Prerequisites

- Node.js 16+ and npm
- Firebase account
- Git

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd personal-cloud-storage

# Install all dependencies
npm run install-all
```

## Step 2: Firebase Configuration

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "personal-cloud-storage")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2.2 Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click "Email/Password"
3. Enable it and click "Save"

### 2.3 Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you
5. Click "Done"

### 2.4 Setup Firebase Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location
5. Click "Done"

### 2.5 Get Project Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon
4. Register app with a nickname
5. Copy the config object

### 2.6 Get Service Account Key (for backend)
1. In Project Settings, go to "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Keep this secure - it contains sensitive information

## Step 3: Environment Variables

### 3.1 Backend (.env in root directory)
Copy `env.example` to `.env` and fill in:

```env
# Firebase Config (from service account JSON)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_PRIVATE_KEY_ID=from_service_account_json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=from_service_account_json
FIREBASE_CLIENT_ID=from_service_account_json

# Server Config
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3.2 Frontend (.env in client directory)
Create `.env` file in the `client` folder:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 4: Run Development Server

```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

## Step 5: Test the Application

1. Open http://localhost:3000
2. Create a new account
3. Upload some files
4. Test file operations (download, delete, preview)

## Step 6: Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Set environment variables in Vercel dashboard
5. Deploy

### Backend (Render)
1. Go to [Render](https://render.com/)
2. Connect your GitHub repository
3. Create new Web Service
4. Set environment variables
5. Deploy

## Troubleshooting

### Common Issues

1. **Firebase initialization error**
   - Check if all environment variables are set correctly
   - Verify Firebase project ID and API key

2. **CORS errors**
   - Ensure CLIENT_URL is set correctly in backend .env
   - Check if frontend URL matches the CORS configuration

3. **File upload fails**
   - Verify Firebase Storage rules allow uploads
   - Check file size limits (100MB max)

4. **Authentication issues**
   - Ensure Firebase Auth is enabled
   - Check if email/password sign-in is enabled

### Firebase Security Rules

Update your Firestore and Storage rules for production:

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /files/{fileId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify all environment variables are set
4. Ensure Firebase services are properly configured
