// YouTubeMusicApi
// https://github.com/emresenyuva/youtube-music-api
const YoutubeMusicApi = require('youtube-music-api')
const api = new YoutubeMusicApi()
api.initalize()

async function ytmCached(req, res, methodName, argsToUse){
  return await api[methodName](...argsToUse)
}

module.exports = (app) => {
  // general search (useful for getting a mixed search result with songs, albums, playlists, videos, artists..)
  app.get('/api/yt/search/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, 'search', [req.params.searchString])
    res.json(data)
  })

  // search suggestions (for autocomplete)
  app.get('/api/yt/suggestions/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, 'getSearchSuggestions', [req.params.searchString])
    res.json(data)
  })

  // search for songs
  app.get('/api/yt/songs/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, 'search', [req.params.searchString, "song"])
    res.json(data)
  })

  // get song by id
  // app.get('/api/yt/song/:songId', async (req, res) => {
  //   let data = await db.query("SELECT value FROM ytm_cache_songs WHERE key = ?", req.params.songId).catch(() => {})
  //   res.json(data[0] ? JSON.parse(data[0].value) : {})
  // })

  // cache song
  app.post('/api/yt/song', async (req, res) => {
    let song = req.body
    await db.query("INSERT INTO ytm_cache_songs VALUES(?, ?)", [song.videoId, JSON.stringify(song)]).catch(() => {})
    res.json({message: 'ok'})
  })

  // there is no get song by id because you are supposed to do it direclty in the client

  // search for artists
  app.get('/api/yt/artists/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, 'search', [req.params.searchString, "artist"])
    res.json(data)
  })

  // get artist by id
  app.get('/api/yt/artist/:browseId', async (req, res) => {
    let data = await ytmCached(req, res, 'getArtist', [req.params.browseId])
    res.json(data)
  })

  // search for albums
  app.get('/api/yt/albums/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, 'search', [req.params.searchString, "album"])
    res.json(data)
  })

  // get album by id
  app.get('/api/yt/album/:browseId', async (req, res) => {
    let data = await ytmCached(req, res, 'getAlbum', [req.params.browseId])
    res.json(data)
  })

  // search for videos
  app.get('/api/yt/videos/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, 'search', [req.params.searchString, "video"])
    res.json(data)
  })

  // there is no get video by id because you are supposed to do it direclty in the client

  // search for playlists
  app.get('/api/yt/playlists/:searchString', async (req, res) => {
    let data = await ytmCached(req, res, 'search', [req.params.searchString, "playlist"])
    res.json(data)
  })

  // get playlist by id
  app.get('/api/yt/playlist/:browseId', async (req, res) => {
    let data = await ytmCached(req, res, 'getPlaylist', [req.params.browseId])
    res.json(data)
  })

  // yt api 404 for any remaining requests on all methods
  app.all('/api/yt/*', async (req, res) => {
    res.status(404)
    res.end()
  })
}
