import { AI } from 'firebase/ai';
// FIX: Use Firebase v9 compat imports to support v8 syntax.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// External API Response Types
export interface UnsplashImage {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  categories: string[];
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship: any | null;
  topic_submissions: any;
  user: {
    id: string;
    updated_at: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string | null;
    twitter_username: string | null;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
      following: string;
      followers: string;
    };
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    instagram_username: string | null;
    total_collections: number;
    total_likes: number;
    total_photos: number;
    accepted_tos: boolean;
    for_hire: boolean;
    social: {
      instagram_username: string | null;
      portfolio_url: string | null;
      twitter_username: string | null;
      paypal_email: string | null;
    };
  };
}

export interface UnsplashResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export interface GeminiImageResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
}

export interface GitHubUploadResponse {
  content: {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    _links: {
      self: string;
      git: string;
      html: string;
    };
  };
  commit: {
    sha: string;
    node_id: string;
    url: string;
    html_url: string;
    author: {
      date: string;
      name: string;
      email: string;
    };
    committer: {
      date: string;
      name: string;
      email: string;
    };
    message: string;
    tree: {
      url: string;
      sha: string;
    };
    parents: Array<{
      url: string;
      sha: string;
    }>;
  };
}

// Application Types
export interface User {
  uid: string;
  id: string; // user1 or user2
  username: string;
  partnerId: string;
  email: string;
}

export interface DailyContent {
  date: string; // YYYY-MM-DD
  imageUrl: string;
  question: string;
}

export interface Answer {
  userId: string;
  answer: string;
}

export interface ChatMessage {
  id?: string;
  userId: string;
  username: string;
  message: string;
  // FIX: Switched to the v8 namespaced Timestamp type.
  timestamp: firebase.firestore.Timestamp;
}

export interface DailyData {
  date: string;
  imageUrl: string;
  question: string;
  questionBy: string;
  answers: Answer[];
  chat?: ChatMessage[]; // Chat wordt nu als subcollectie geladen
}

export type AllData = {
  [date: string]: DailyData;
};

export interface AppState {
    loading: boolean;
    error: string | null;
}

export interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  error: string | null;
  isMobile: boolean;
}

export interface MainViewProps {
  currentUser: User;
  onLogout: () => void;
  isMobile: boolean;
  onImageLoad: (imageUrl: string) => void;
}

export interface QuestionChoiceModalProps {
  username: string;
  onGenerate: () => Promise<void>;
  onSubmit: (question: string) => Promise<void>;
  onClose?: () => void;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  availableDates: string[];
  currentDate: string;
}