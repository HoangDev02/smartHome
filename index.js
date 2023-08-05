
const express = require('express')
const app = express()
var cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const dotenv = require('dotenv')
const locationRoute = require('./api/routes/location.route')
const connect = require("./api/connect/connect")


const port = 8080
dotenv.config()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.use('/v1/api/location', locationRoute)

app.listen(port, () => {
  connect()
  console.log(`Example app listening on port ${port}`)
})