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
  // await dynamo.createItem('GameObjects', newGameObj)
  return newGameObj
}

module.exports.joinGame = async (req) => {
  if(!gameObj.gameId) return "No game id provided"
  if(!gameObj.playerName) return "No player name provided"

  const oldGameObj = await dynamo.getItem('GameObjects', { game_id: gameName.gameId })
  const updatedGameObj = modules[gameObj.gameName].join({...oldGameObj}, playerName)
  await dynamo.createItem('GameObjects', updatedGameObj)
  const player = {
    game_id: newGameObj.game_id,
    user_name: gameObj.playerName,
    token: uuidv4()
  }
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