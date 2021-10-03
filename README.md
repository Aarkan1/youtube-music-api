This api is based on: https://github.com/emresenyuva/youtube-music-api

Prefix the endpoints below with https://yt-music-api.herokuapp.com/

## MIT License
This api is purely for educational and personal projects and is not meant to be used commercially. If you want to create a commercial application you'll have to find another way.

The author of this api does not take responsibility for how you use it. 

## /api/yt
This part of the API exposes the YouTube music API.
Below is a list of endpoints you can use, with a non-exhaustive list of properties.

### next page
All responses returns a limit of 20 results. To get the next page you simply add the *response.next* string from the last search as a *'?next='* query.
```js
'https://yt-music-api.herokuapp.com/api/yt/songs/nothing%20else%20matters?next=' + response.next
```
This response will result in the next 20 items, and a new *response.next* string that you can use to get the next page.

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

#### /api/yt/songs/_search+string_
_contains songs_
##### method: GET
##### response:
```js
{
    "content": [
        {
            "type": "song",
            "videoId": String,
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
    ],
    "next": String
}
```

#### /api/yt/song/_videoId_
_get one song by id_
##### method: GET
##### response:
```js
{
    "type": "song",
    "videoId": String,
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
    ],
    "next": String
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
    ],
    "next": String
}
```

#### /api/yt/album/_browseId_
_get one album by id_
##### method: GET
##### response:
```js
{
    "title": String,
    "description": String,
    "trackCount": Number,
    "year": String
    "duration": Number,
    "artist": [
        {
            "name": String,
            "browseId": String,
            "thumbnails": [
                 {
                    "url": String,
                    "width": Number,
                    "height": Number
                }
            ]
        }
    ],
    "tracks": [
        {
            "name": String,
            "videoId": String,
            "duration": Number
        }
    ],
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
    "next": String
}
```

#### /api/yt/video/_videoId_
_get one video by id_
##### method: GET
##### response:
```js
{
    "type": String,
    "videoId": String,
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
    "next": String
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
    "year": String,
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
    ]
}
```
