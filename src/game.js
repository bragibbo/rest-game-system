const dynamo = require('./aws/dynamo')
const path = require('path');
const fs = require('fs');
const { InvalidArgumentException } = require('./util/errors')
const { v4: uuidv4 } = require('uuid');

const modules = {}
const modulesFolder = '/modules/';
console.log('Loading modules...')
fs.readdirSync(__dirname + modulesFolder).forEach(moduleName => {
  console.log(moduleName)
  modules[path.parse(moduleName).name] = require( '.' + modulesFolder + moduleName )
});

module.exports.listOpenGames = () => {

}

module.exports.createGame = async (gameObj) => {
  if(!gameObj.gameName) throw new InvalidArgumentException("No game name provided")

  const newGameObj = modules[gameObj.gameName].create(gameObj, uuidv4())
  await dynamo.createItem(newGameObj)
  return newGameObj
}

module.exports.joinGame = async (gameReq) => {
  if(!gameReq.gameId) return "No game id provided"
  if(!gameReq.playerName) return "No player name provided"

  const gameObjects = await dynamo.getItem(gameReq.gameId)
  const oldGameObj = gameObjects.find(el => el.object_type && el.object_type.S === 'board')
  const players = gameObjects.map(el => el.object_type.S.includes('player'))
  const updatedGameObj = modules[oldGameObj.game_name.S].join({...oldGameObj}, players, gameReq.playerName)
  await dynamo.createItem(updatedGameObj)

  await insertPlayer(player)
  return { player: player, game: updatedGameObj }
}

module.exports.getGame = async (gameName) => {
  if(!gameObj.gameId) return "No game id provided"

  modules['connect4'].get()
}

module.exports.updateGame = async () => {
  if(!gameObj.gameId) return "No game id provided"

  modules['connect4'].update()
}

async function insertPlayer(playerObj) {
  const res = await dynamo.createItem('GameUsers', playerObj)
  return res
}

async function getPlayer(gameId, gameId, playerName) {
  const res = await dynamo.getItem('GameUsers', { game_id: gameId, user_name: playerName })
  return res
}