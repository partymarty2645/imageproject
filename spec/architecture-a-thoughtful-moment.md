---
title: A Thoughtful Moment - Couples Journaling App Architecture
version: 1.0
date_created: 2025-09-24
last_updated: 2025-09-24
owner: Development Team
tags: ['architecture', 'app', 'react', 'firebase', 'ai']
---

# Introduction

This specification defines the architecture, requirements, and constraints for "A Thoughtful Moment", a private couples journaling application that creates daily intimate moments through AI-generated images, thoughtful questions, and shared conversations.

## 1. Purpose & Scope

This specification defines the system architecture for a React-based web application that enables couples to maintain daily journaling rituals. The application supports exactly two predefined users, generates AI-powered content, and manages partner-based interactions with strict security controls.

**Intended Audience**: Frontend developers, backend engineers, DevOps engineers, and QA testers working on the application.

**Assumptions**: The application is designed for exactly two users with predefined email addresses and partner relationships.

## 2. Definitions

- **Daily Moment**: A complete journaling entry consisting of an AI-generated image, a question, partner answers, and optional chat messages
- **Question Rotation**: Weekly schedule where each partner gets one day to create custom questions (Fridays for user1, Saturdays for user2)
- **Partner Relationship**: Bidirectional relationship between exactly two users (user1 and user2)
- **AI Generation**: Automated creation of fantasy artwork using Google Gemini API with fallback to curated images
- **Real-time Updates**: Live synchronization of data changes using Firestore listeners
- **Image Hosting**: External GitHub repository used for storing and serving generated images

## 3. Requirements, Constraints & Guidelines

### Functional Requirements
- **FUN-001**: Application must support exactly two predefined users with email/password authentication
- **FUN-002**: Daily content must be automatically generated on weekdays (Monday-Thursday) using random questions
- **FUN-003**: User1 must be able to create custom questions on Fridays, user2 on Saturdays
- **FUN-004**: Partner answers must be private until the next day
- **FUN-005**: Chat functionality must be available for yesterday's content only
- **FUN-006**: Calendar navigation must allow browsing of all available dates
- **FUN-007**: AI-generated images must be compressed and hosted externally

### Security Requirements
- **SEC-001**: Only authenticated users can access application data
- **SEC-002**: Users can only read/write their own data and their partner's data
- **SEC-003**: Firestore security rules must validate all data structure requirements
- **SEC-004**: API keys must be stored securely in environment variables
- **SEC-005**: Image URLs must be validated before storage

### Performance Requirements
- **PER-001**: Application must load within 3 seconds on standard broadband connections
- **PER-002**: Images must be compressed to WebP format with 80% quality
- **PER-003**: Real-time listeners must update UI within 500ms of data changes
- **PER-004**: Mobile interface must be responsive and touch-optimized

### Technical Constraints
- **CON-001**: Frontend must use React 19 with TypeScript
- **CON-002**: Backend must use Firebase (Auth, Firestore) exclusively
- **CON-003**: Build system must use Vite for development and production
- **CON-004**: All text content must be in Dutch language
- **CON-005**: Application must support only two hardcoded users
- **CON-006**: Images must be hosted on external GitHub repository

### Design Guidelines
- **GUD-001**: UI must use magical/serene theme with purple/lavender color palette
- **GUD-002**: Components must be mobile-first and responsive
- **GUD-003**: Error messages must be user-friendly and in Dutch
- **GUD-004**: Loading states must provide clear feedback to users
- **GUD-005**: Modal dialogs must use glassmorphism effects

## 4. Interfaces & Data Contracts

### Core Data Structures

```typescript
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

interface Answer {
  userId: string;
  answer: string;
}

interface ChatMessage {
  id?: string;
  userId: string;
  username: string;
  message: string;
  timestamp: firebase.firestore.Timestamp;
}
```

### API Interfaces

#### Authentication Service
- `login(email: string, password: string): Promise<boolean>`
- `logout(): Promise<void>`
- `getCurrentUser(): User | null`

#### Firestore Service
- `getDailyData(date: string): Promise<DailyData | null>`
- `createDailyData(date: string, data: DailyData): Promise<void>`
- `saveAnswer(date: string, userId: string, answer: string): Promise<void>`
- `addChatMessage(date: string, message: ChatMessage): Promise<void>`
- `listenToDailyData(date: string, callback: Function): UnsubscribeFunction`

#### AI Image Service
- `generateDailyImage(ai: AI): Promise<string>`

### Component Interfaces

```typescript
interface MainViewProps {
  currentUser: User;
  onLogout: () => void;
  ai: AI;
  isMobile: boolean;
  onImageLoad: (imageUrl: string) => void;
}

interface QuestionChoiceModalProps {
  username: string;
  onGenerate: () => Promise<void>;
  onSubmit: (question: string) => Promise<void>;
}
```

## 5. Acceptance Criteria

- **AC-001**: Given a user logs in with valid credentials, when they access the app, then they see today's content or question selection modal based on the day of week
- **AC-002**: Given it's Friday and user1 is logged in, when the app initializes, then the QuestionChoiceModal is displayed
- **AC-003**: Given a user submits a custom question, when the operation completes, then the modal closes and daily content is created
- **AC-004**: Given a user views yesterday's content, when they submit an answer, then it becomes visible to their partner
- **AC-005**: Given a user views yesterday's content, when they send a chat message, then it appears in real-time for both partners
- **AC-006**: Given an AI image generation fails, when the fallback system activates, then a curated image is used instead
- **AC-007**: Given a user navigates to a past date, when they select it from calendar, then the content loads and displays correctly

## 6. Test Automation Strategy

### Test Levels
- **Unit Tests**: Component logic, service functions, utility functions
- **Integration Tests**: Firebase operations, AI service integration, image processing
- **End-to-End Tests**: Complete user workflows, authentication flows

### Frameworks
- **Unit Testing**: Jest + React Testing Library
- **Integration Testing**: Firebase emulators for Firestore/Auth testing
- **E2E Testing**: Playwright for browser automation

### Test Data Management
- Mock Firebase data for unit tests
- Predefined test users and content for integration tests
- Environment-specific test data isolation

### CI/CD Integration
- Automated testing on every pull request
- Firebase emulator tests in CI pipeline
- Visual regression testing for UI components

### Coverage Requirements
- Minimum 80% code coverage for critical business logic
- 100% coverage for authentication and data validation functions
- All user workflows must have corresponding E2E tests

### Performance Testing
- Lighthouse CI for performance budgets
- Image loading performance validation
- Real-time update latency testing

## 7. Rationale & Context

### Design Decisions
- **Two-User Constraint**: Application is designed specifically for couples, eliminating the complexity of dynamic user management
- **External Image Hosting**: GitHub provides better CDN performance and geographic distribution compared to Firebase Storage
- **Weekly Question Rotation**: Creates engagement by giving each partner ownership of content creation one day per week
- **Private Answers**: Builds anticipation and intimacy by revealing answers only after both partners have responded
- **Dutch Language**: Application is designed for Dutch-speaking users, ensuring cultural relevance

### Technical Choices
- **React 19**: Latest React version for modern features and performance
- **Firebase**: Serverless backend eliminates infrastructure management complexity
- **Vite**: Fast development experience and optimized production builds
- **TypeScript**: Type safety prevents runtime errors in complex state management

## 8. Dependencies & External Integrations

### External Systems
- **EXT-001**: Google Gemini AI - Image generation with fallback to curated images
- **EXT-002**: GitHub API - Image storage and hosting via repository
- **EXT-003**: Unsplash API - Fallback image sourcing for curated content

### Third-Party Services
- **SVC-001**: Firebase Authentication - User authentication and session management
- **SVC-002**: Firebase Firestore - Real-time database for application data
- **SVC-003**: Google Gemini API - AI-powered image generation

### Infrastructure Dependencies
- **INF-001**: Firebase Hosting - Static web application hosting
- **INF-002**: GitHub Repository - External image storage and CDN

### Data Dependencies
- **DAT-001**: Predefined user accounts - Exactly two hardcoded users with partner relationships
- **DAT-002**: Curated question library - 20 predefined thoughtful questions in Dutch
- **DAT-003**: Fallback image collection - 10 curated Unsplash images for AI failure scenarios

### Technology Platform Dependencies
- **PLT-001**: Node.js v18+ - Runtime environment for development and build tools
- **PLT-002**: React 19 - Frontend framework with modern features
- **PLT-003**: TypeScript 5.8+ - Type safety and developer experience
- **PLT-004**: Vite 6+ - Build tool and development server

## 9. Examples & Edge Cases

### Normal Workflow Example
```typescript
// Friday - User1 creates custom question
const fridayFlow = {
  dayOfWeek: 5, // Friday
  currentUser: { id: 'user1' },
  action: 'showQuestionChoiceModal',
  expectedResult: 'User can create custom question'
};

// Monday - Automatic question generation
const mondayFlow = {
  dayOfWeek: 1, // Monday
  currentUser: { id: 'user1' },
  action: 'autoGenerateQuestion',
  expectedResult: 'Random question from DAILY_QUESTIONS array'
};
```

### Edge Cases
- **Network Failure**: AI generation fails → fallback to Unsplash images
- **Authentication Timeout**: User session expires → redirect to login
- **Date Navigation**: User navigates to non-existent date → show appropriate message
- **Concurrent Access**: Both users access app simultaneously → real-time updates work correctly
- **Image Loading**: Large images → automatic compression and WebP conversion
- **Chat Overflow**: Long conversation threads → automatic scrolling and performance optimization

## 10. Validation Criteria

- All TypeScript interfaces must compile without errors
- Firestore security rules must pass validation tests
- Application must build successfully with Vite
- All acceptance criteria must pass manual testing
- Performance benchmarks must meet requirements
- Security audit must pass with no critical vulnerabilities

## 11. Related Specifications / Further Reading

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [React 19 Migration Guide](https://react.dev/blog/2024/04/25/react-19)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Vite Build Tool Documentation](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)