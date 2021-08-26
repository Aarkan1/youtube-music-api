# node-music-web-api
wrapping you tube music and sql through express to a unified whole
# start the apis using
npm start



Prefix the endpoints below with your server url or localhost, such as http://localhost:3000/

## /api/yt
This part of the API exposes the YouTube music API.
Below is a list of endpoints you can use, with a non-exhaustive list of properties.

### endpoints

#### /api/yt/search/_search+string_
_contains any (songs, albums, singles, artists, playlists, videos)_
##### method: GET
##### response:
```js
{
    "content": [
        {
            "type": "song",
            "videoId": String,
            "playlistId": String,
            "name": String,
            "artist": {
                "name": String,
                "browseId": String
            },
            "album": {
                "name": String,
                "browseId": String
            },
            "duration": Number,
            "thumbnails": [
                {
                    "url": String,
                    "width": Number,
                    "height": Number
                }
            ],
            "params": "wAEB"
        }
    ]
}
```

#### /api/yt/suggestions/_search+string_
_contains suggestions (for autocomplete)_
##### method: GET
##### response:
```js
[
    String,
    String
]
```

### /api/yt/songs/_search+string_
_contains songs_
##### method: GET
##### response:
```js
{
    "content": [
        {
            "type": "song",
            "videoId": String,
            "playlistId": String,
            "name": String,
            "artist": {
                "name": String,
                "browseId": String
            },
            "album": {
                "name": String,
                "browseId": String
            },
            "duration": Number,
            "thumbnails": [
                {
                    "url": String,
                    "width": Number,
                    "height": Number
                }
            ],
            "params": "wAEB"
        }
    ]
}
```

#### /api/yt/artists/_search+string_
_contains offical artists_
##### method: GET
##### response:
```js
{
    "content": [
        {
            "type": "artist",
            "browseId": String,
            "name": String,
            "thumbnails": [
                {
                    "url": String,
                    "width": Number,
                    "height": Number
                }
            ]
        }
    ]
}
```

#### /api/yt/artist/_browseId_
_get one artist by id_
##### method: GET
##### response:
```js

```

#### /api/yt/albums/_search+string_
_contains offical albums_
##### method: GET
##### response:
```js
{
    "content": [
        {
            "type": "album",
            "browseId": String,
            "playlistId": String,
            "name": String,
            "artist": String,
            "year": String,
            "thumbnails": [
                {
                    "url": String,
                    "width": Number,
                    "height": Number
                }
            ]
        }
    ]
}
```

#### /api/yt/album/_browseId_
_get one album by id_
##### method: GET
##### response:
```js

```

#### /api/yt/videos/_search+string_
_contains youtube videos_
##### method: GET
##### response:
```js

```

#### /api/yt/playlists/_search+string_
_contains youtube playlists_
##### method: GET
##### response:
```js

```

#### /api/yt/playlist/_browseId_
_get one playlist by id_
##### method: GET
##### response:
```js

```

