// YouTubeMusicApi
// https://github.com/emresenyuva/youtube-music-api
const YoutubeMusicApi = require('../api/index')
const api = new YoutubeMusicApi()
api.initalize()

function createTables(db) {
  db.query(`
    CREATE TABLE IF NOT EXISTS ytm_cache (
      request_url TEXT PRIMARY KEY,
      response_body TEXT NOT NULL
    )
  `)
}

async function ytmCached(req, res, db, methodName, argsToUse){
  // attempt to get from cached (notice that an empty response body will always pass through to fetch new)
  let data = await db.query("SELECT * FROM ytm_cache WHERE request_url = ?", req.originalUrl)
  if(data[0] && data[0].response_body){
    res.set('x-from-cache', true)
    data = JSON.parse(data[0].response_body)
  }else{
    // fetch new
    data = await api[methodName](...argsToUse).catch(console.error)
    // encode continuation
    if(data.continuation) {
      data.next = encodeURIComponent(JSON.stringify(data.continuation))
      delete data.continuation
    }
    // and respond
    res.set('x-from-cache', false)
    // then cache
    let {error} = await db.query("INSERT INTO ytm_cache VALUES(?, ?)", [req.originalUrl, JSON.stringify(data)])
    if(error){
      console.log(error)
      res.status(500)
    }
  }
  return data
}

module.exports = (app, db) => {
  createTables(db)

  // general search (useful for getting a mixed search result with songs, albums, playlists, videos, artists..)
  app.get('/api/yt/search/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, db, 'search', [req.params.searchString])
    res.json(data)
  })

  // search suggestions (for autocomplete)
  app.get('/api/yt/suggestions/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, db, 'getSearchSuggestions', [req.params.searchString])
    res.json(data)
  })

  // search for songs
  app.get('/api/yt/songs/:searchString', async (req, res) => {
    let next = req.query.next
    let method = next ? 'searchNext' : 'search'
    let args = next ? [JSON.parse(decodeURIComponent(next)), "song"] 
                    : [req.params.searchString, "song"]

    let data = await ytmCached(req, res, db, method, args)
    res.json(data)
  })

  // // get song by id
  app.get('/api/yt/song/:songId', async (req, res) => {
    let data = await ytmCached(req, res, db, 'search', [req.params.songId, "song"])
    if(data.content.length) {
      res.json(data.content[0])
    } else {
      res.json(null)
    }
  })

  // search for artists
  app.get('/api/yt/artists/:searchString', async (req, res) => {
    let next = req.query.next
    let method = next ? 'searchNext' : 'search'
    let args = next ? [JSON.parse(decodeURIComponent(next)), "artist"] 
                    : [req.params.searchString, "artist"]

    let data = await ytmCached(req, res, db, method, args)
    res.json(data)
  })

  // get artist by id
  app.get('/api/yt/artist/:browseId', async (req, res) => {
    let data = await ytmCached(req, res, db, 'getArtist', [req.params.browseId])
    res.json(data)
  })

  // search for albums
  app.get('/api/yt/albums/:searchString', async (req, res) => {
    let next = req.query.next
    let method = next ? 'searchNext' : 'search'
    let args = next ? [JSON.parse(decodeURIComponent(next)), "album"] 
                    : [req.params.searchString, "album"]

    let data = await ytmCached(req, res, db, method, args)
    res.json(data)
  })

  // get album by id
  app.get('/api/yt/album/:browseId', async (req, res) => {
    let data = await ytmCached(req, res, db, 'getAlbum', [req.params.browseId])
    res.json(data)
  })

  // search for videos
  app.get('/api/yt/videos/:searchString', async (req, res) => {
    let next = req.query.next
    let method = next ? 'searchNext' : 'search'
    let args = next ? [JSON.parse(decodeURIComponent(next)), "video"] 
                    : [req.params.searchString, "video"]

    let data = await ytmCached(req, res, db, method, args)
    res.json(data)
  })
  
  // get video by id
  app.get('/api/yt/video/:videoId', async (req, res) => {
    let data = await ytmCached(req, res, db, 'search', [req.params.videoId, "video"])
    if(data.content.length) {
      res.json(data.content[0])
    } else {
      res.json(null)
    }
  })
  
  // search for playlists
  app.get('/api/yt/playlists/:searchString', async (req, res) => {
    let next = req.query.next
    let method = next ? 'searchNext' : 'search'
    let args = next ? [JSON.parse(decodeURIComponent(next)), "playlist"] 
                    : [req.params.searchString, "playlist"]

    let data = await ytmCached(req, res, db, method, args)
    res.json(data)
  })

  // TODO: WORKS PARTLY - browseId MUST START WITH 'VL' or 'PL'
  // get playlist by id
  app.get('/api/yt/playlist/:browseId', async (req, res) => {
    let data = await ytmCached(req, res, db, 'getPlaylist', [req.params.browseId])
    res.json(data)
  })

  // yt api 404 for any remaining requests on all methods
  app.all('/api/yt/*', async (req, res) => {
    res.status(404)
    res.end()
  })

}

