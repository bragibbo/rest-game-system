const dynamo = require('../aws/dynamo')
const { InvalidPlayerNumberException, UnableToJoinInProgressGame, UnableToJoinOrUpdateFinishedGame } = require('../util/errors')
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
    min_players: 0,
    num_players: 0,
    player_turn: null,
    winner: null,
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
  if (gameObj.state === 'Play') throw new UnableToJoinInProgressGame('Unable to join game. Game already in progress')
  if (gameObj.state === 'Finish') throw new UnableToJoinOrUpdateFinishedGame('Unable to join game. Game already finished.')
  if (players.length >= gameObj.max_players) throw new InvalidPlayerNumberException(`Too many players. Max of ${MAX_NUM_PLAYERS} for ${GAME_NAME}`)
  gameObj.num_players += 1

  const newPlayer = {
    game_id: gameObj.game_id,
    object_type: `player#${newPlayerName}#${gameObj.num_players}`,
    user_name: newPlayerName,
    game_token: gameObj.num_players,
    token: uuidv4()
  }

  players.push(newPlayer)
  if (gameObj.num_players >= gameObj.min_players) {
    gameObj.state = 'Ready'
    gameObj.player_turn = players[Math.floor(Math.random() * players.length)].user_name
  }

  return { gameObj, newPlayer }
}

module.exports.update = async (gameObj, updateObj, players) => {
  if (gameObj.state === 'Finish') throw new UnableToJoinOrUpdateFinishedGame('Unable to update game. Game already finished.')

}

module.exports.get = async () => {

}

function validateMove(move) {
  if(move < 0 || move > MAX_COLUMNS) throw new Error("Player move out of bounds")
  return true
}
