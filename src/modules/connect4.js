const dynamo = require('../aws/dynamo')
const { InvalidPlayerNumberException } = require('../util/errors')

const GAME_NAME = 'connect4'
const MAX_NUM_PLAYERS = 2

module.exports.create = (gameObj, gameId) => {
  return {
    game_id: gameId,
    game_name: GAME_NAME,
    max_players: MAX_NUM_PLAYERS,
    players: [],
    playerTurn: null,
    state: 'Waiting',
    board: [['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-']]
  }
}

module.exports.join = async (gameObj, playerName) => {
  if (gameObj.players.length > gameObj.max_players) throw new InvalidPlayerNumberException(`Too many player. Max of ${MAX_NUM_PLAYERS} for ${GAME_NAME}`)
  
  let token = ''
  if (gameObj.players.length == 0) {
    token = 'X'
  } else {
    token = 'O'
  }
  
  gameObj.players.push({ player_name: playerName, player_token: token})
  return gameObj
}

module.exports.update = async () => {

}

module.exports.get = async () => {

}