
const express = require('express')

const app = express()
app.use(express.json());
const port = 3000

const controller = require('./src/controller')

app.get('/game', (req, res) => {
  const response = controller.getGame(req)
  res.status(response.status).send(response)
})

app.post('/game', (req, res) => {
  const response = controller.postGame(req)
  res.status(response.status).send(response)
})

app.post('/create', (req, res) => {
  const response = controller.postCreate(req)
  res.status(response.status).send(response)
})

app.post('/join', (req, res) => {
  const response = controller.posJoin(req)
  res.status(response.status).send(response)
})

app.listen(port, () => {
  console.log(`Game api listening at http://localhost:${port}`)
})