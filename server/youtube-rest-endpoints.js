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

  // WORKS
  // general search (useful for getting a mixed search result with songs, albums, playlists, videos, artists..)
  app.get('/api/yt/search/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, db, 'search', [req.params.searchString])
    res.json(data)
  })

  // WORKS
  // search suggestions (for autocomplete)
  app.get('/api/yt/suggestions/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, db, 'getSearchSuggestions', [req.params.searchString])
    res.json(data)
  })

  // WORKS
  // search for songs
  app.get('/api/yt/songs/:searchString', async (req, res) => {
    let data
    let next = req.query.next
    if (next && next != 'undefined') {
      data = await ytmCached(req, res, db, 'searchNext', [JSON.parse(next), "song"])
    } else {
      data = await ytmCached(req, res, db, 'search', [req.params.searchString, "song"])
    }
    res.json(data)
  })
  // there is no get song by id because you are supposed to do it directly in the client

  // // get song by id
  // app.get('/api/yt/song/:songId', async (req, res) => {
  //   let data = await db.query("SELECT value FROM ytm_cache_songs WHERE key = ?", req.params.songId).catch(() => {})
  //   res.json(data[0] ? JSON.parse(data[0].value) : {})
  // })

  // // cache song
  // app.post('/api/yt/song', async (req, res) => {
  //   let song = req.body
  //   await db.query("INSERT INTO ytm_cache_songs VALUES(?, ?)", [song.videoId, JSON.stringify(song)]).catch(() => {})
  //   res.json({message: 'ok'})
  // })


  // WORKS
  // search for artists
  app.get('/api/yt/artists/:searchString', async (req, res) => {
    let data
    let next = req.query.next
    if (next && next != 'undefined') {
      data = await ytmCached(req, res, db, 'searchNext', [JSON.parse(next), "artist"])
    } else {
      data = await ytmCached(req, res, db, 'search', [req.params.searchString, "artist"])
    }
    res.json(data)
  })

  // WORKS
  // get artist by id
  app.get('/api/yt/artist/:browseId', async (req, res) => {
    let data = await ytmCached(req, res, db, 'getArtist', [req.params.browseId])
    res.json(data)
  })

  // TODO: WORKS - THOUGH URLS FOR ALBUM AND PLAYLIST DOES NOT WORK
  // search for albums
  // app.get('/api/yt/albums/:searchString', async (req, res) => {
  //   let data = await ytmCached(req, res, db, 'search', [req.params.searchString, "album"])
  //   res.json(data)
  // })

  // TODO: BROKEN
  // get album by id
  // app.get('/api/yt/album/:browseId', async (req, res) => {
  //   let data = await ytmCached(req, res, db, 'getAlbum', [req.params.browseId])
  //   res.json(data)
  // })

  // WORKS
  // search for videos
  app.get('/api/yt/videos/:searchString', async (req, res) => {
    let data
    let next = req.query.next
    if (next && next != 'undefined') {
      data = await ytmCached(req, res, db, 'searchNext', [JSON.parse(next), "video"])
    } else {
      data = await ytmCached(req, res, db, 'search', [req.params.searchString, "video"])
    }
    res.json(data)
  })
  // there is no get video by id because you are supposed to do it directly in the client

  // WORKS
  // search for playlists
  app.get('/api/yt/playlists/:searchString', async (req, res) => {
    let data
    let next = req.query.next
    if (next && next != 'undefined') {
      data = await ytmCached(req, res, db, 'searchNext', [JSON.parse(next), "playlist"])
    } else {
      data = await ytmCached(req, res, db, 'search', [req.params.searchString, "playlist"])
    }
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

