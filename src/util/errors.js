class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class InvalidArgumentException extends CustomError { }

module.exports.InvalidArgumentException = InvalidArgumentException