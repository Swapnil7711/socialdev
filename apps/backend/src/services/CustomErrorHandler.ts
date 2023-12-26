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
}

export default CustomErrorHandler;
