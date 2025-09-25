<div align="center">
<img width="1200### Environment Setup
Create `.env.local` file in the root directory:
```bash
GEMINI_API_KEY="your-gemini-api-key-here"
GITHUB_TOKEN="your-github-personal-access-token"
GITHUB_OWNER="partymarty2645"
GITHUB_REPO="bingoimages"
GITHUB_BRANCH="main"
GITHUB_IMAGES_PATH="images"
```ght="475" alt## Firebase Configuration

### Security Rules
- **Firestore**: Only authenticated users can access data
- **Authentication**: Email/password authentication for 2 predefined users

### Project Structure
```
firebase/
├── config.ts          # Firebase client configuration
├── firestore.rules    # Database security rules
└── storage.rules      # Not used (images hosted on GitHub)
```

## GitHub Image Hosting

Images are hosted in a dedicated GitHub repository for better performance and no geographic restrictions.

### Setup Requirements
1. Create a GitHub repository (e.g., `bingoimages`)
2. Generate a Personal Access Token with `repo` permissions
3. Add the token to `.env.local` as `GITHUB_TOKEN`

### Image Workflow
- AI generates image → compressed to WebP → uploaded to GitHub → raw URL stored in Firestore
- Images are served via GitHub's CDN for fast loading
- Repository acts as private image galleryc="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# A Thoughtful Moment - Couples Journaling App

A private, magical journaling app for couples featuring daily AI-generated artwork, thoughtful questions, and intimate conversations.

## Prerequisites

- **Node.js** v18+ (currently using v24.8.0)
- **npm** v9+ (currently using v11.6.0)
- **Firebase CLI** v14+ (currently using v14.17.0)
- **Google Gemini API Key** (for AI image generation)

## Quick Start

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd a-thoughtful-moment
npm install
```

### 2. Environment Setup
Create `.env.local` file in the root directory:
```bash
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Firebase Setup
The Firebase project is already configured. If you need to set up a new project:

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init --project your-project-id

# Select these features:
# - Firestore
# - Hosting
# - Storage

# Deploy security rules
firebase deploy --only firestore:rules,storage
```

### 4. Run Locally
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

## Firebase Configuration

### Security Rules
- **Firestore**: Only authenticated users can access data
- **Storage**: Only authenticated users can upload/download images
- **Authentication**: Email/password authentication for 2 predefined users

### Project Structure
```
firebase/
├── config.ts          # Firebase client configuration
├── firestore.rules    # Database security rules
└── storage.rules      # Storage security rules
```

## Build & Deploy

### Development
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Deploy to Firebase
```bash
# Build the app
npm run build

# Copy build files to public directory (Firebase hosting expects files in public/)
cp -r dist/* public/

# Deploy to Firebase
firebase deploy --only hosting
```

### Architecture
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Firebase Firestore (database only)
- **AI**: Google Gemini for daily image generation
- **Image Hosting**: GitHub repository (bingoimages)
- **Styling**: Custom CSS with magical theme

### Key Features
- Daily AI-generated fantasy artwork (hosted on GitHub)
- Partner-based question selection (alternating days)
- Private answers revealed the next day
- Real-time chat conversations
- Calendar view for past entries
- Mobile-responsive design

## Development

### Project Structure
```
src/
├── components/     # React components
├── services/       # Firebase & API integrations
├── hooks/         # Custom React hooks
├── utils/         # Helper functions
├── types.ts       # TypeScript interfaces
└── constants.ts   # App configuration
```

### Firebase Console
Access your Firebase project at: https://console.firebase.google.com/project/thoughtfulmoment-73ec0/overview