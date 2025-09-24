// Image Processing Constants
export const IMAGE_PROCESSING = {
  COMPRESSION_QUALITY: 0.8,
  MAX_WIDTH: 768,
  MAX_HEIGHT: 768,
  OUTPUT_FORMAT: 'webp' as const,
  FALLBACK_FORMAT: 'jpeg' as const,
} as const;

// Date and Time Constants
export const WEEKDAYS = {
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

// UI Constants
export const UI = {
  MOBILE_BREAKPOINT: 768,
  CHAT_MAX_LENGTH: 500,
  ANSWER_MAX_LENGTH: 1000,
} as const;

// Validation Constants
export const VALIDATION = {
  MAX_ANSWER_LENGTH: 1000,
  MAX_MESSAGE_LENGTH: 500,
  MAX_USERS: 2,
} as const;

// Firebase Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  DAILY_MOMENTS: 'dailyMoments',
  CHAT: 'chat',
} as const;

// Error Messages (Dutch)
export const ERROR_MESSAGES = {
  UNAUTHORIZED_EMAIL: 'E-mailadres niet toegestaan',
  INVALID_CREDENTIALS: 'E-mail of wachtwoord onjuist',
  GENERIC_LOGIN_ERROR: 'Inloggen mislukt',
  DAILY_CONTENT_FETCH_FAILED: 'Kon dagelijkse inhoud niet ophalen',
  IMAGE_GENERATION_FAILED: 'Kon afbeelding niet genereren',
  UPLOAD_FAILED: 'Kon afbeelding niet uploaden',
  SAVE_FAILED: 'Opslaan mislukt',
  SEND_FAILED: 'Versturen mislukt',
} as const;

// Success Messages (Dutch)
export const SUCCESS_MESSAGES = {
  ANSWER_SAVED: 'Je antwoord is opgeslagen ✨',
  QUESTION_SET: 'De vraag voor vandaag is ingesteld!',
  IMAGE_GENERATED: 'Afbeelding succesvol gegenereerd',
} as const;