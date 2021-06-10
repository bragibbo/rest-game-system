const dynamo = require('./aws/dynamo')


export function listOpenGames() {

}

export function createGame(gameObj) {
  if(!gameObj.gameName) return "No game name provided"
  if(!gameObj.playerName) return "No player name provided"


}

export function joinGame(req) {
  if(!gameObj.gameId) return "No game name provided"
  if(!gameObj.playerName) return "No player name provided"


}

export function getGame(gameName) {

}

export function updateGame() {

}