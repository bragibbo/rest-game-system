const dynamo = require('./aws/dynamo')
const path = require('path');
const fs = require('fs');
const { InvalidArgumentException, IsNotPlayersTurn, InvalidPlayerToken } = require('./util/errors')
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

module.exports.createGame = async (gameReq) => {
  if(!gameReq.gameName) throw new InvalidArgumentException("No game name provided")

  const newGameObj = modules[gameReq.gameName].create(uuidv4())
  await dynamo.createItem(newGameObj)
  return newGameObj
}

module.exports.joinGame = async (gameReq) => {
  if(!gameReq.gameId) throw new InvalidArgumentException("No game id provided")
  if(!gameReq.playerName) throw new InvalidArgumentException("No player name provided")

  const gameObjects = await dynamo.getItem(gameReq.gameId)
  const oldGameObj = gameObjects.find(el => el.object_type && el.object_type === 'board')
  const players = gameObjects.filter(el => el.object_type.includes('player'))
  const { gameObj, newPlayer } = await modules[oldGameObj.game_name].join({...oldGameObj}, players, gameReq.playerName)
  await dynamo.createItem(gameObj)
  await dynamo.createItem(newPlayer)
  return { player: newPlayer, game: gameObj }
}

module.exports.getGame = async (gameId) => {
  if (gameId) {
    const gameObjects = await dynamo.getItem(gameId)
    const gameObj = gameObjects.find(el => el.object_type && el.object_type === 'board')
    return gameObj
  } else {
    return await dynamo.getAllItems('board')
  }
}

module.exports.updateGame = async (gameReq) => {
  if(!gameReq.gameId) throw InvalidArgumentException("No game id provided")

  const gameObjects = await dynamo.getItem(gameReq.gameId)
  const oldGameObj = gameObjects.find(el => el.object_type && el.object_type === 'board')
  
  const player = gameObjects.find(el => el.token === gameReq.token)
  if (!player) throw new InvalidPlayerToken("Provided token is not valid")
  if (oldGameObj.player_turn !== player.user_name) throw new IsNotPlayersTurn('It is not the provided players turn')

  const gameObj = await modules[oldGameObj.game_name].update({...oldGameObj}, gameReq, player)
  await dynamo.createItem(gameObj)
  return gameObj
}