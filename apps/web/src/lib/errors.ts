export class RateLimitError extends Error {
  constructor() {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
  }
}

export class PublicError extends Error {}

export class AuthenticationError extends PublicError {
  constructor() {
    super('You must be logged in to view this content');
    this.name = 'AuthenticationError';
  }
}
export class UnAuthorizedError extends PublicError {
  constructor() {
    super('you do not have access to this content');
    this.name = 'UnAuthorizedError';
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super('Email is already in use');
    this.name = 'EmailInUseError';
  }
}

export class NotFoundError extends PublicError {
  constructor(message?: string) {
    super(message ?? 'Resource not found');
    this.name = 'NotFoundError';
  }
}

export class TokenExpiredError extends PublicError {
  constructor() {
    super('Token has expired');
    this.name = 'TokenExpiredError';
  }
}

export class LoginError extends PublicError {
  constructor() {
    super('Invalid email or password');
    this.name = 'LoginError';
  }
}
