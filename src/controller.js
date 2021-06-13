const game = require('./game')
const { InvalidArgumentException } = require('./util/errors')

module.exports.listOpenGames = () => {

}

module.exports.postCreate = (req) => {
  try {
    game.createGame(req.body)


  } catch (e) {
    return handleError(e);
  }
}

module.exports.postJoin = (req) => {
  try {
    game.joinGame(req.body)

  } catch (e) {
    return handleError(e);
  }
}

module.exports.getGame = (req) => {
  try {
    game.getGame(req.query.id)
  } catch (e) {
    return handleError(e);
  }
}

module.exports.postGame = (req) => {
  try {
    game.updateGame(req.body)
  } catch (e) {
    return handleError(e);
  }
}

function handleError(e) {
  if (e instanceof InvalidArgumentException) {
    return { status: 400, message: e.message}
  } else {
    console.error(e)
    return { status: 500, message: e.message}
  }
}