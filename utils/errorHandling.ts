export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ERROR_CODES = {
  UNAUTHORIZED_EMAIL: 'UNAUTHORIZED_EMAIL',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  GENERIC_LOGIN_ERROR: 'GENERIC_LOGIN_ERROR',
  DAILY_CONTENT_FETCH_FAILED: 'DAILY_CONTENT_FETCH_FAILED',
  IMAGE_GENERATION_FAILED: 'IMAGE_GENERATION_FAILED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  SAVE_FAILED: 'SAVE_FAILED',
  SEND_FAILED: 'SEND_FAILED',
  FIRESTORE_ERROR: 'FIRESTORE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];