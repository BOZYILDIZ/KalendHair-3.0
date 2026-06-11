// Erreurs métier typées — chaque erreur a un code machine + message humain

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'SALON_NOT_FOUND'
  | 'EMPLOYEE_NOT_FOUND'
  | 'SERVICE_NOT_FOUND'
  | 'APPOINTMENT_NOT_FOUND'
  | 'SLOT_UNAVAILABLE'
  | 'EMPLOYEE_INACTIVE'
  | 'SERVICE_INACTIVE'
  | 'SALON_CLOSED'
  | 'CONNECTOR_AUTH_FAILED'
  | 'CONNECTOR_SYNC_FAILED'
  | 'PAYMENT_FAILED'
  | 'INTERNAL_ERROR'

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Helper pour retourner des erreurs JSON depuis les API routes
export function toApiError(error: unknown): { error: string; code: string } {
  if (error instanceof AppError) {
    return { error: error.message, code: error.code }
  }
  console.error('[UnhandledError]', error)
  return { error: 'Une erreur inattendue est survenue', code: 'INTERNAL_ERROR' }
}

// Helper pour les Server Actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: ErrorCode }

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

export function actionError<T>(error: AppError | string): ActionResult<T> {
  if (error instanceof AppError) {
    return { success: false, error: error.message, code: error.code }
  }
  return { success: false, error: error, code: 'INTERNAL_ERROR' }
}
