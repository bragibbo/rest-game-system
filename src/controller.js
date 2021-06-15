const game = require('./game')
const { InvalidArgumentException, InvalidPlayerNumberException } = require('./util/errors')

module.exports.listOpenGames = () => {

}

module.exports.postCreate = async (req) => {
  try {
    const body = await game.createGame(req.body)
    return { status: 201, game: body }
  } catch (e) {
    return handleError(e);
  }
}

module.exports.postJoin = async (req) => {
  try {
    const body = await game.joinGame(req.body)
    return { status: 201, ...body }
  } catch (e) {
    return handleError(e);
  }
}

module.exports.getGame = async (req) => {
  try {
    const body = await game.getGame(req.query.id)
    return { status: 200, game: body }
  } catch (e) {
    return handleError(e);
  }
}

module.exports.postGame = async (req) => {
  try {
    const body = await game.updateGame(req.body)
    return { status: 201, ...body }
  } catch (e) {
    return handleError(e);
  }
}

function handleError(e) {
  if (e instanceof InvalidArgumentException) {
    return { status: 400, message: e.message}
  } else if (e instanceof InvalidArgumentException) {
    return { status: 400, message: e.message}
  } else {
    console.error(e)
    return { status: 500, message: e.message}
  }
}