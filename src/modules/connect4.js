const dynamo = require('../aws/dynamo')
const { InvalidPlayerNumberException } = require('../util/errors')
const { v4: uuidv4 } = require('uuid');

const GAME_NAME = 'connect4'
const MAX_NUM_PLAYERS = 2
const MAX_COLUMNS = 6

module.exports.create = (gameObj, gameId) => {
  return {
    game_id: gameId,
    object_type: 'board',
    game_name: GAME_NAME,
    max_players: MAX_NUM_PLAYERS,
    num_players: 0,
    player_turn: null,
    state: 'Waiting',
    board: [['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-']]
  }
}

module.exports.join = async (gameObj, players, newPlayerName) => {
  if (players.length > gameObj.max_players) throw new InvalidPlayerNumberException(`Too many players. Max of ${MAX_NUM_PLAYERS} for ${GAME_NAME}`)
  gameObj.num_players += 1
  
  const newPlayer = {
    game_id: newGameObj.game_id,
    user_name: newPlayerName,
    game_token: 123,
    token: uuidv4()
  }

  return gameObj, newPlayer
}

module.exports.update = async () => {

}

module.exports.get = async () => {

}

function validateMove(move) {
  if(move < 0 || move > MAX_COLUMNS) throw new Error("Player move out of bounds")
  return true
}