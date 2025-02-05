class HttpError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(details?: any) {
    super(400, "Bad Request", details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(details?: any) {
    super(401, "Unauthorized", details);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends HttpError {
  constructor(details?: any) {
    super(403, "Forbidden", details);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(details?: any) {
    super(404, "Not Found", details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class TeapotError extends HttpError {
  constructor(details?: any) {
    super(418, "I'm a Teapot", details);
    Object.setPrototypeOf(this, TeapotError.prototype);
  }
}

export class ServerError extends HttpError {
  constructor(status: number, details?: any) {
    super(status, "Server Error", details);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class UnknownHttpError extends HttpError {
  constructor(status: number, details?: any) {
    super(status, "Unknown HTTP Error", details);
    Object.setPrototypeOf(this, UnknownHttpError.prototype);
  }
}
