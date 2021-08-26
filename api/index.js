// server port
const port = process.env.PORT || 3000

// express server
const express = require('express')
const app = express()

// load apis / endpoints
require('./youtube-rest-endpoints.js')(app)

// start the server
app.listen(port, () => {
  console.log('server running on port', port)
})
