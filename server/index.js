// server port
const port = 3000

// express server
const express = require('express')
const app = express()

// add body-parser to express
// register as middleware
app.use( express.json() )

// add cookie-parser to express
const cookieParser = require('cookie-parser')
// register as middleware
app.use(cookieParser())

// add express-session to express
const session = require('express-session')
// register as middleware
app.use( session( {
  secret: 'keyboard cat boddyfollymeskaweq456',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
} ) )

const DbHandler = require('./DbHandler')
let db = new DbHandler('./data.db')

// load apis / endpoints

require('./youtube-rest-endpoints.js')(app, db)

require('./data-rest-endpoints.js')(app, db)


// example client
const path = require('path')
app.use(express.static(path.join(__dirname, '../client')))

// start the server
app.listen(port, () => {
  console.log('server running on port', port)
})


