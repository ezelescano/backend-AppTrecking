import { HttpError } from "./HttpErrors";

export const BadRequest = (message = "Bad Request") =>
  new HttpError(message, 400);

export const Unauthorized = (message = "Unauthorized") =>
  new HttpError(message, 401);

export const Forbidden = (message = "Forbidden") =>
  new HttpError(message, 403);

export const NotFound = (message = "Not Found") =>
  new HttpError(message, 404);

export const Conflict = (message = "Conflict") =>
  new HttpError(message, 409);

export const InternalError = (message = "Internal Server Error") =>
  new HttpError(message, 500);