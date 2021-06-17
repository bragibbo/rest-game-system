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
const EMPTY_TOKEN = 0

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
    board: [[0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]
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

  const isWin = chkWinner(gameObj.board) === player.game_token
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

function chkLine(a,b,c,d) {
  // Check first cell non-zero and all cells match
  return ((a != 0) && (a ==b) && (a == c) && (a == d));
}

function chkWinner(bd) {
  console.log(bd)
  // Check down
  for (r = 0; r < 3; r++)
      for (c = 0; c < 7; c++)
          if (chkLine(bd[r][c], bd[r+1][c], bd[r+2][c], bd[r+3][c]))
              return bd[r][c];

  // Check right
  for (r = 0; r < 6; r++)
      for (c = 0; c < 4; c++)
          if (chkLine(bd[r][c], bd[r][c+1], bd[r][c+2], bd[r][c+3]))
              return bd[r][c];

  // Check down-right
  for (r = 0; r < 3; r++)
      for (c = 0; c < 4; c++)
          if (chkLine(bd[r][c], bd[r+1][c+1], bd[r+2][c+2], bd[r+3][c+3]))
              return bd[r][c];

  // Check down-left
  for (r = 3; r < 6; r++)
      for (c = 0; c < 4; c++)
          if (chkLine(bd[r][c], bd[r-1][c+1], bd[r-2][c+2], bd[r-3][c+3]))
              return bd[r][c];
  return 0;
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