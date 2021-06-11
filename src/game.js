const dynamo = require('./aws/dynamo')
const path = require('path');
const fs = require('fs');
const errors = require('./util/errors')


const modules = {}
const modulesFolder = '/modules/';
console.log('Loading modules...')
fs.readdirSync(__dirname + modulesFolder).forEach(moduleName => {
  console.log(moduleName)
  modules[path.parse(moduleName).name] = require( '.' + modulesFolder + moduleName )
});

module.exports.listOpenGames = () => {

}

module.exports.createGame = (gameObj) => {
  if(!gameObj.gameName) throw new errors.InvalidArgumentException("No game name provided")
  if(!gameObj.playerName) throw new errors.InvalidArgumentException("No player name provided")

  modules[gameObj.gameName].create(gameObj)

}

module.exports.joinGame = (req) => {
  if(!gameObj.gameId) return "No game name provided"
  if(!gameObj.playerName) return "No player name provided"

  modules['connect4'].join()

}

module.exports.getGame = (gameName) => {
  modules['connect4'].get()
}

module.exports.updateGame = () => {
  modules['connect4'].update()
}