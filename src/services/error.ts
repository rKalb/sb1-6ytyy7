export class PLMError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'PLMError';
  }

  static fromAWSError(error: any): PLMError {
    console.error('AWS Error:', {
      name: error.name,
      message: error.message,
      code: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId
    });

    if (error.name === 'AccessDeniedException') {
      return new PLMError(
        'Access denied. Please check your AWS credentials and permissions.',
        'ACCESS_DENIED',
        error
      );
    }

    if (error.name === 'ResourceNotFoundException') {
      return new PLMError(
        'The requested resource was not found. Please check your configuration.',
        'RESOURCE_NOT_FOUND',
        error
      );
    }

    if (error.name === 'ValidationException') {
      return new PLMError(
        `Invalid data provided: ${error.message}`,
        'VALIDATION_ERROR',
        error
      );
    }

    if (error.name === 'ConditionalCheckFailedException') {
      return new PLMError(
        'Update failed: The part may have been modified by another user.',
        'CONDITION_CHECK_FAILED',
        error
      );
    }

    return new PLMError(
      `An unexpected error occurred: ${error.message}`,
      'UNKNOWN_ERROR',
      error
    );
  }
}