class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class InvalidArgumentException extends CustomError { }
class InvalidPlayerNumberException extends CustomError { }

module.exports.InvalidArgumentException = InvalidArgumentException
module.exports.InvalidPlayerNumberException = InvalidPlayerNumberException