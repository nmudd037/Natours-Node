class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //We set this on operational errors to diiferentiate them from programming errors

    Error.captureStackTrace(this, this.constructor); //This way when a new object is created and constructor function is called then that function call is not gonna appearin the stack trace, and will not pollute it
  }
}

module.exports = AppError;
