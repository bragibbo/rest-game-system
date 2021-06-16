
const express = require('express')

const app = express()
app.use(express.json());
const port = 3000

const controller = require('./src/controller')

app.get('/game', async (req, res) => {
  const response = await controller.getGame(req)
  res.status(response.status).send(response)
})

app.post('/game', async (req, res) => {
  const response = await controller.postGame(req)
  res.status(response.status).send(response)
})

app.post('/create', async (req, res) => {
  const response = await controller.postCreate(req)
  res.status(response.status).send(response)
})

app.post('/join', async (req, res) => {
  const response = await controller.postJoin(req)
  res.status(response.status).send(response)
})

app.listen(port, () => {
  console.log(`Game api listening at http://localhost:${port}`)
})