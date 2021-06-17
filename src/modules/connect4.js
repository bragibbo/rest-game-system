const dynamo = require('../aws/dynamo')
const { InvalidPlayerNumberException, 
        UnableToJoinInProgressGame, 
        UnableToJoinOrUpdateFinishedGame, 
        InvalidMove} = require('../util/errors')
const { v4: uuidv4 } = require('uuid');

const GAME_NAME = 'connect4'
const MAX_NUM_PLAYERS = 2
const MIN_NUM_PLAYERS = 2
const MAX_COLUMNS = 6
const MAX_ROWS = 5
const EMPTY_TOKEN = '-'

module.exports.create = (gameId) => {
  return {
    game_id: gameId,
    object_type: 'board',
    game_name: GAME_NAME,
    max_players: MAX_NUM_PLAYERS,
    min_players: MIN_NUM_PLAYERS,
    num_players: 0,
    player_turn: null,
    players: [],
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

  gameObj.players.push(newPlayer.user_name)
  players.push(newPlayer)
  if (gameObj.num_players >= gameObj.min_players) {
    gameObj.state = 'Ready'
    gameObj.player_turn = players[Math.floor(Math.random() * players.length)].user_name
  }

  return { gameObj, newPlayer }
}

module.exports.update = async (gameObj, updateObj, player) => {
  if (gameObj.state === 'Finish') throw new UnableToJoinOrUpdateFinishedGame('Unable to update game. Game already finished.')
  const { i, j } = validateMove(updateObj.move, gameObj.board)
  gameObj.board[i][j] = player.game_token
  console.log(gameObj.board)
  const isWin = checkWinCondition(player.game_token, gameObj.board)
  const hasNoMoreMoves = checkNoMoreMoves(gameObj.board)
  if (isWin) {
    gameObj.winner = player.user_name
    gameObj.state = 'Finish'
  } else if (hasNoMoreMoves) {
    gameObj.winner = 'Tie'
    gameObj.state = 'Finish'
  } 
    
  const nextPlayerIndex = (gameObj.players.indexOf(player.user_name) + 1) % gameObj.max_players
  gameObj.player_turn = gameObj.players[nextPlayerIndex]

  return gameObj
}

function validateMove(move, board) {
  if(move < 0 || move > MAX_COLUMNS) throw new Error("Player move out of column bounds")
  for(let i = MAX_ROWS; i >= 0; i--) {
    if(board[i][move] === EMPTY_TOKEN) {
      return { i, j: move }
    }
  }
  throw new InvalidMove('No more space in indicated column')
}

function checkWinCondition(player, board) {

  // horizontalCheck 
  for (let j = 0; j<MAX_ROWS-3 ; j++ ){
      for (let i = 0; i<MAX_COLUMNS; i++){
          if (board[i][j] === player && board[i][j+1] === player && board[i][j+2] === player && board[i][j+3] === player){
              return true;
          }           
      }
  }
  // verticalCheck
  for (let i = 0; i<MAX_COLUMNS-3 ; i++ ){
      for (let j = 0; j<MAX_ROWS; j++){
          if (board[i][j] === player && board[i+1][j] === player && board[i+2][j] === player && board[i+3][j] === player){
              return true;
          }           
      }
  }
  // ascendingDiagonalCheck 
  for (let i=3; i<MAX_COLUMNS; i++){
      for (let j=0; j<MAX_ROWS-3; j++){
          if (board[i][j] === player && board[i-1][j+1] === player && board[i-2][j+2] === player && board[i-3][j+3] === player)
              return true;
      }
  }
  // descendingDiagonalCheck
  for (let i=3; i<MAX_COLUMNS; i++){
      for (let j=3; j<MAX_ROWS; j++){
          if (board[i][j] === player && board[i-1][j-1] === player && board[i-2][j-2] === player && board[i-3][j-3] === player)
              return true;
      }
  }
  return false;
}

function checkNoMoreMoves(board) {
  for (let i = 0; i<MAX_ROWS; i++ ){
      for (let j = 0; j<MAX_COLUMNS; j++){
          if (board[i][j] === EMPTY_TOKEN){
              return false;
          }           
      }
  }
 
  return true;
}