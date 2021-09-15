Prefix the endpoints below with https://yt-music-api.herokuapp.com/

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
{
    "name": String,
    "description": String,
    "views": Number,
    "products": {
        "songs": {
            "content": [],
            "browseId": String,
            "params": String
        },
        "albums": {
            "content": [],
            "browseId": String,
            "params": String
        },
        "singles": {
            "content": [],
            "browseId": String,
            "params": String
        },
        "videos": {
            "content": [],
            "browseId": String,
            "params": String
        }
    },
    "thumbnails": [
        {
            "url": String,
            "width": Number,
            "height": Number
        }
    ]
}
```

#### /api/yt/videos/_search+string_
_contains youtube videos_
##### method: GET
##### response:
```js
{
    "content": [
        {
            "type": String,
            "videoId": String,
            "playlistId": String,
            "name": String,
            "author": String,
            "views": String,
            "duration": Number,
            "thumbnails": {
                "url": String,
                "width": Number,
                "height": Number
            },
            "params": String
        }
    ],
    "contination": {
        "continuation": String,
        "clickTrackingParams": String
    }
}
```

#### /api/yt/playlists/_search+string_
_contains youtube playlists_
##### method: GET
##### response:
```js
{
    "content": [
        {
            "type": String,
            "browseId": String,
            "title": String,
            "author": String,
            "trackCount": Number,
            "thumbnails": [
                {
                    "url": String,
                    "width": Number,
                    "height": Number
                }
            ]
        }
    ],
    "contination": {
        "continuation": String,
        "clickTrackingParams": String
    }
}
```

#### /api/yt/playlist/_browseId_
_get one playlist by id_
##### method: GET
##### response:
```js
{
    "title": String,
    "owner": String,
    "trackCount": Number,
    "dateYear": String,
    "content": [
        {
            "videoId": String,
            "name": String,
            "author": {
                "name": String,
                "browseId": String
            },
            "duration": Number,
            "thumbnails": {
                "url": String,
                "width": Number,
                "height": Number
            }
        }
    ],
    "thumbnails": [
        {
            "url": String,
            "width": Number,
            "height": Number
        }
    ],
    "continuation": [
        {
            "continuation": String,
            "clickTrackingParams": String
        }
    ]
}
```

