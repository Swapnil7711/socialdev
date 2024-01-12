class CustomErrorHandler extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomErrorHandler.prototype); // Fix prototype chain for instanceof checks
  }

  static alreadyExists(message: string) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message: string) {
    return new CustomErrorHandler(401, message);
  }
  static unAuthorised(message: string) {
    return new CustomErrorHandler(401, message);
  }
  static notFound(message: string) {
    return new CustomErrorHandler(404, message);
  }

  static serverError(message: string) {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
