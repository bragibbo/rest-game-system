class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class InvalidArgumentException extends CustomError { }
class InvalidPlayerNumberException extends CustomError { }
class UnableToJoinInProgressGame extends CustomError { }
class UnableToJoinOrUpdateFinishedGame extends CustomError { }
class IsNotPlayersTurn extends CustomError { }
class InvalidPlayerToken extends CustomError { }
class InvalidMove extends CustomError { }

module.exports.InvalidArgumentException = InvalidArgumentException
module.exports.InvalidPlayerNumberException = InvalidPlayerNumberException
module.exports.UnableToJoinInProgressGame = UnableToJoinInProgressGame
module.exports.UnableToJoinOrUpdateFinishedGame = UnableToJoinOrUpdateFinishedGame
module.exports.IsNotPlayersTurn = IsNotPlayersTurn
module.exports.InvalidPlayerToken = InvalidPlayerToken
module.exports.InvalidMove = InvalidMove