# A Thoughtful Moment - Complete Development Instructions

## Overview

""A Thoughtful Moment"" is a private couples journaling application that creates daily intimate moments through AI-generated images, thoughtful questions, and shared conversations. Built with React 19 + TypeScript + Vite, it supports exactly two predefined users with partner-based interactions, real-time chat, and automated content generation.

## Architecture

### Core Components
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini for daily image generation
- **Styling**: Inline CSS with magical/serene theme

### Key Workflows
- **Authentication**: Firebase Auth with 2 hardcoded users
- **Daily Content**: AI-generated images → compressed to WebP → hosted on GitHub
- **Question Rotation**: Weekly schedule (Fridays: user1, Saturdays: user2, weekdays: auto)
- **Privacy Logic**: Today's answers private, yesterday's revealed
- **Real-time Chat**: Available for yesterday's content only

### Data Structure
`	ypescript
interface User {
  uid: string;
  id: string; // 'user1' | 'user2'
  username: string;
  partnerId: string;
  email: string;
}

interface DailyData {
  date: string; // YYYY-MM-DD
  imageUrl: string;
  question: string;
  questionBy: string; // 'user1' | 'user2'
  answers: Answer[];
}

interface ChatMessage {
  id?: string;
  userId: string;
  username: string;
  message: string;
  timestamp: firebase.firestore.Timestamp;
}
`

## Requirements & Constraints

### Development Principles
- No increase in complexity if not strictly necessary
- No use of paid features allowed
- No use of features requiring a billing account setup allowed
- Getting the images right is a very important part of the project, mainly the thematic and the styling
- Start by creating a MVP
- Simplicity is key, functionality paramount
- GitHub for image processing has been setup already, Firestore database as well, realtime database can still be setup
- Shadcn-ui MCP setup available to help with the styling if needed

### Functional Requirements
- Support exactly two predefined users with email/password authentication
- Daily content automatically generated on weekdays using random questions
- User1 creates custom questions on Fridays, user2 on Saturdays
- Partner answers private until next day
- Chat functionality for yesterday's content only
- Calendar navigation for all available dates
- AI-generated images compressed and hosted externally

### Security Requirements
- Only authenticated users can access data
- Users read/write own data and partner's data
- Firestore security rules validate all data structures
- API keys stored securely in environment variables

### Performance Requirements
- Application loads within 3 seconds on standard broadband
- Images compressed to WebP format with 80% quality
- Real-time updates within 500ms latency
- Mobile-responsive interface

### Technical Constraints
- React 19 with TypeScript frontend
- Firebase backend (Auth + Firestore only)
- Vite build system
- Dutch language interface
- Exactly two hardcoded users
- External GitHub repository for image hosting

## Implementation Plan

### Phase 1: Core Infrastructure & Authentication
- Initialize Vite React 19 project with TypeScript
- Configure Firebase Auth and Firestore
- Implement authentication service
- Define TypeScript interfaces
- Set up environment configuration

### Phase 2: User Management & Security
- Create hardcoded user definitions
- Implement LoginScreen component
- Create Firestore security rules
- Add authentication guards

### Phase 3: AI Image Generation & Processing
- Create Gemini AI service for image generation
- Implement image compression utilities
- Create optimized image processor for WebP conversion
- Implement Unsplash fallback service
- Create GitHub upload service for hosting

### Phase 4: Daily Content Management
- Create Firestore service with CRUD operations
- Implement daily data creation with questions and images
- Add answer saving with user validation
- Create real-time listeners for updates
- Implement date-based navigation

### Phase 5: Question Management System
- Create predefined questions array in Dutch
- Implement weekly rotation logic
- Create QuestionChoiceModal component
- Add question generation and validation

### Phase 6: Real-time Chat System
- Create chat message data structure
- Implement chat message sending
- Add real-time chat listeners
- Create chat UI with emoji picker
- Add chat restrictions (yesterday's content only)

### Phase 7: User Interface & Experience
- Create MainView component with daily content display
- Implement mobile-responsive design
- Add glassmorphism effects and purple/lavender theme
- Create CalendarModal for navigation
- Implement LoadingSpinner and Toast notifications
- Add error boundaries and handling

### Phase 8: State Management & Business Logic
- Create useDailyView custom hook
- Implement daily data initialization logic
- Add partner waiting states and modal logic
- Create answer privacy logic
- Implement date navigation and viewing states

### Phase 9: Testing & Quality Assurance
- Set up Jest and React Testing Library
- Create unit tests for utilities and services
- Implement integration tests for Firebase operations
- Add component tests for UI interactions
- Create end-to-end tests for user workflows
- Implement performance testing with Lighthouse CI

### Phase 10: Deployment & Production Setup
- Configure Vite production build optimization
- Set up Firebase hosting deployment
- Implement environment variable management
- Add error monitoring and logging
- Create deployment documentation and scripts
- Implement CI/CD pipeline with automated testing

## Development Workflow

### Development Process
- All code changes through pull request review
- TypeScript compilation must pass before merge
- Code follows established project structure
- New features include corresponding tests
- Documentation updated for API changes

### Testing Strategy
- **Unit Tests**: Jest + React Testing Library (80% coverage minimum)
- **Integration Tests**: Firebase emulators for backend operations
- **E2E Tests**: Playwright for complete user workflows
- **Performance Tests**: Lighthouse CI for loading times and latency

### Test Execution
- **Pre-commit**: TypeScript compilation and linting
- **Pull Request**: Full test suite with coverage reporting
- **Merge**: Integration and E2E tests on main branch
- **Release**: Full regression testing and performance validation

### CI/CD Pipeline
- GitHub Actions for automated testing on pushes/PRs
- Firebase emulators for local testing
- Codecov for coverage reporting
- Automated deployment to Firebase Hosting on main branch merge

## Environment Setup

### Development Environment
`ash
# Required environment variables in .env.local
GEMINI_API_KEY=""your-gemini-api-key-here""
VITE_FIREBASE_API_KEY=""your-firebase-api-key""
VITE_FIREBASE_AUTH_DOMAIN=""your-project.firebaseapp.com""
VITE_FIREBASE_PROJECT_ID=""your-project-id""
VITE_FIREBASE_STORAGE_BUCKET=""your-project.appspot.com""
VITE_FIREBASE_MESSAGING_SENDER_ID=""123456789""
VITE_FIREBASE_APP_ID=""1:123456789:web:abcdef123456""

# Commands
npm install
npm run dev  # Starts Vite dev server on port 3000
`

### Production Environment
`ash
NODE_ENV=production
# Same Firebase config variables
GEMINI_API_KEY=""prod-gemini-key""
GITHUB_TOKEN=""prod-github-token""
`

## Dependencies & Integrations

### Core Dependencies
- **React 19** - Frontend framework
- **Firebase SDK v12.3.0** - Auth and database
- **TypeScript 5.8+** - Type safety
- **Vite 6+** - Build tool
- **Google Gemini AI API** - Image generation
- **GitHub API** - Image hosting
- **Unsplash API** - Fallback images

### Development Tools
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **Firebase Emulators** - Local testing
- **Lighthouse CI** - Performance testing

### External Services
- **Firebase Hosting** - Production deployment
- **GitHub Repository** - External image storage
- **Google Gemini** - AI image generation
- **Unsplash** - Curated fallback images

## File Structure

`
App.tsx                    # Main app with routing
types.ts                   # TypeScript interfaces
constants.ts               # App constants and user definitions
firebase/config.ts         # Firebase configuration
services/
  authService.ts           # Authentication operations
  firestoreService.ts      # Database operations
  geminiService.ts         # AI image generation
  unsplashService.ts       # Fallback image service
hooks/
  useDailyView.ts          # Main state management hook
components/
  MainView.tsx             # Primary UI component
  LoginScreen.tsx          # Authentication interface
  QuestionChoiceModal.tsx  # Question creation modal
  CalendarModal.tsx        # Date navigation
  EmojiPicker.tsx          # Chat emoji picker
  LoadingSpinner.tsx       # Loading indicator
  Toast.tsx                # Notification system
utils/
  imageCompressor.ts       # Image processing
  optimizedImageProcessor.ts # WebP conversion
contexts/
  ToastContext.tsx         # Notification context
`

## Key Workflows

### Daily Content Generation
1. Check current day of week
2. If Friday (user1) or Saturday (user2): Show QuestionChoiceModal
3. If weekday: Auto-generate from predefined questions
4. Generate AI image via Gemini API
5. Compress to WebP format
6. Upload to GitHub repository
7. Store URL in Firestore dailyMoments/{date}

### Authentication Flow
1. User enters email/password
2. Firebase Auth validates credentials
3. Check against hardcoded user definitions
4. Set current user and partner relationship
5. Redirect to MainView

### Answer Privacy Logic
- **Today**: Answers visible only to submitting user
- **Yesterday**: Both partners can see all answers
- **Chat**: Available only for yesterday's content
- **Future dates**: No answers visible

### Real-time Synchronization
- Firestore listeners on dailyMoments/{date}
- Chat listeners on dailyMoments/{date}/chat subcollection
- UI updates within 500ms of data changes
- Automatic cleanup on component unmount

## Testing Strategy

### Test Pyramid
- **Unit Tests** (80%+ coverage): Component logic, hooks, utilities, services
- **Integration Tests**: Firebase operations, AI service integration
- **E2E Tests**: Complete user workflows from login to chat

### Test Data Management
- Unit tests: Mock data and stubbed dependencies
- Integration tests: Firebase emulator with predefined data
- E2E tests: Isolated environment with clean state

### Performance Testing
- Lighthouse CI for performance budgets
- Image loading time validation
- Real-time update latency testing
- Mobile responsiveness verification

## Deployment Process

### Build Process
`ash
npm run build  # Creates optimized production bundle
`

### Deployment Steps
`ash
firebase deploy --only hosting          # Deploy to Firebase Hosting
firebase deploy --only firestore:rules  # Deploy security rules
`

### Post-deployment Verification
- Application loads correctly
- Authentication works
- Daily content generation functions
- Real-time features operational
- Mobile responsiveness confirmed

## Acceptance Criteria

### Core Functionality
- Users can authenticate with valid credentials
- Daily content appears based on day/week logic
- Question creation modal shows on appropriate days
- Answers remain private until next day
- Chat functions for yesterday's content
- Calendar navigation works for all dates
- AI image generation succeeds with fallbacks

### Performance & Quality
- Application loads within 3 seconds
- Images compress to WebP successfully
- Real-time updates occur within 500ms
- Mobile interface is fully responsive
- All TypeScript compilation passes
- Test coverage meets minimum requirements

### Security & Reliability
- Only authenticated users can access data
- Users can only read/write authorized data
- Firestore rules validate all operations
- API keys properly secured
- Error handling provides user-friendly messages
- Fallback systems work when primary services fail

## Risk Management

### Technical Risks
- **Gemini API Rate Limits**: Could affect image generation reliability
- **GitHub API Limits**: May impact image uploads during peak usage
- **Firebase Free Tier**: Limitations for production usage
- **Network Dependencies**: External APIs must remain available

### Mitigation Strategies
- Implement comprehensive fallback systems
- Monitor API usage and implement rate limiting
- Design for graceful degradation
- Implement caching and offline capabilities
- Regular testing of fallback scenarios

## Validation & Quality Gates

### Pre-merge Checks
- TypeScript compilation succeeds
- Unit tests pass with 80%+ coverage
- Integration tests validate Firebase operations
- Code follows established patterns

### Release Validation
- Full test suite passes
- Performance benchmarks met
- Security scans pass
- Manual testing confirms user workflows
- Staging environment validation

### Production Monitoring
- Error tracking and logging implemented
- Performance monitoring active
- User feedback collection
- Automated health checks

## Related Documentation

- [Architecture Specification](./spec/architecture-a-thoughtful-moment.md)
- [Implementation Plan](./plan/feature-couples-journaling-1.md)
- [Development Workflow](./spec/process-development-workflow.md)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React 19 Documentation](https://react.dev)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [Vite Build Tool](https://vitejs.dev)
