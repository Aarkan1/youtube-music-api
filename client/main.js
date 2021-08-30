/**
 * Uses the YouTube Player API
 * https://developers.google.com/youtube/iframe_api_reference?hl=sv
 */

// initiate all global variables att the top for easy management
const playlist = document.querySelector('#songs')
const searchField = document.querySelector('#playlist form')
const playerAlbum = document.querySelector('#player .cover-art')
const playerTitle = document.querySelector('#player .player-title')
const playButton = document.querySelector('#player #play-button')
const timePlayed = document.querySelector('#player #time-played')
const timeDuration = document.querySelector('#player #time-duration')
const hoverTime = document.querySelector('#player #hover-time')
const progressBar = document.querySelector('#player .progress-bar-done')
const songProgress = document.querySelector('#player .progress-bar-back')
const backwardButton = document.querySelector('#player .fa-backward')
const forwardButton = document.querySelector('#player .fa-forward')
let songIndex = -1
let songId = ""
let durationInterval
let isPlaying = false
let player;
let album = []

// gets called automatically when YouTube player loads
function onYouTubeIframeAPIReady() {
  // sets the size of the player to 0
  // because we don't want to watch the videos,
  // only to trigger music playback
  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    events: {
      'onReady': useUrlParams,
      'onStateChange': onPlayerStateChange
    }
  });
}

function useUrlParams() {
  if(!location.search) return;
  
  let [search, song] = location.search.split('&song=');
  search = decodeURIComponent(search.split('?search=')[1]);
  
  searchSong(search);
  songId = song

  setTimeout(() => {
    player.loadVideoById(song);
    setSong()
  }, 10);
}

// this function triggers when we change song in player
function onPlayerStateChange(event) {
  if(event.data == YT.PlayerState.ENDED && player.getCurrentTime() >= player.getDuration()) {
    return nextSong()
  }

  if (event.data != YT.PlayerState.PLAYING) return
  
  setSong()
  if(player.getCurrentTime() >= player.getDuration()) player.stopVideo()

  // only gets time in seconds with decimals from the player,
  // so to convert these seconds to match the format 0:00
  // I round off the decimals with Math.ceil() and use 
  // simple math to get the minutes
  let currentTime = Math.ceil(player.getDuration())
  let seconds = currentTime % 60 < 10 ? '0' + Math.ceil(currentTime % 60) : Math.ceil(currentTime % 60)
  let time = `${Math.ceil(currentTime / 60 - 1)}:${seconds}`
  timeDuration.innerHTML = time

  playButton.className = isPlaying ? 'fas fa-pause-circle' : 'fas fa-play-circle'
}

// fill playlist with songs
function fillPlaylist() {
  playlist.innerHTML = ''

  for(let i = 0; i < album.length; i++) {
    playlist.insertAdjacentHTML('beforeend', `
      <a href="#player" class="song-item" data-index="${i}">
        <div class="cover-art" style="background-image: url(https://i.ytimg.com/vi/${album[i].videoId}/hqdefault.jpg)"></div>
        <div class="song-title">
          <p>${album[i].name}</p>
          <p>${album[i].artist.name}</p>
        </div>
        <i class="fas fa-play-circle"></i>
      </a>
    `)
  }
}

// function to update current song info
async function setSong() {
  let song;
  // if(!songId) {
    playlist.querySelectorAll('a').forEach(a => {
      a.classList.remove('selected-song')
      a.querySelector('i').className = 'fas fa-play-circle'
    })
    const songElement = playlist.querySelector(`a[data-index="${songIndex}"]`)
    songElement.classList.add('selected-song')
    songElement.querySelector('i').className = 'fas fa-pause-circle'
    song = album[songIndex]
    songId = song.videoId

    let urlQuery = "";
    if(location.search.includes('song=')) {
      urlQuery = location.search.replace(/song=\w+$/, "song=" + songId)
    } else {
      urlQuery += location.search + "&song=" + songId
    }
    history.pushState(null, null, location.pathname + urlQuery)

    // fetch('/api/yt/song', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(song)
    // })
  // } else {
    // let res = await fetch('/api/yt/song/' + songId)
    // song = await res.json()
  // }

  playerAlbum.style.setProperty('background-image', `url(https://i.ytimg.com/vi/${songId}/hqdefault.jpg)`)

  // to change the value on a CSS variable we'll do
  // this on the documentElement styles
  document.documentElement.style.setProperty('--bg-cover', `url(https://i.ytimg.com/vi/${songId}/hqdefault.jpg)`)

  playerTitle.innerHTML = `
    <i class="fas fa-plus"></i>
    <div class="song-title">
      <p>${song.name}</p>
      <p>${song.artist.name}</p>
    </div>
    <i class="fas fa-heart"></i>
  `

  // Below is a counting timer for played duration

  // setInterval() is a loop that triggers on provided ms,
  // and it returns a key that can be used to cancle the loop.
  // clearInterval() takes that key and cancles the loop 
  // before we create a new loop
  clearInterval(durationInterval)
  durationInterval = setInterval(() => {
    let currentTime = Math.ceil(player.getCurrentTime())
    let seconds = currentTime % 60 < 10 ? '0' + Math.ceil(currentTime % 60) : Math.ceil(currentTime % 60)
    let time = `${Math.ceil(currentTime / 60 - 1)}:${seconds}`
    timePlayed.innerHTML = time
    progressBar.style.setProperty('width',  player.getCurrentTime() / player.getDuration() * 100 + '%')
  }, 500)
}

// initiate listeners

playlist.onclick = e => {
  const aTag = e.target.closest('a')
  if(!aTag) return
  const index = aTag.getAttribute('data-index')
  const playIcon = e.target.closest('i')
  if(playIcon && songIndex == index) {
    pauseSong()
    return;
  } 
  if(songIndex == index) return
  songIndex = index 
  songId = ""
  player.loadVideoById(album[songIndex].videoId)
  isPlaying = true
}

function pauseSong() {
  isPlaying = !isPlaying

  isPlaying && player.playVideo()
  !isPlaying && player.pauseVideo()

  playButton.className = isPlaying ? 'fas fa-pause-circle' : 'fas fa-play-circle'
  playlist.querySelector(`a[data-index="${songIndex}"] > i`).className = isPlaying ? 'fas fa-pause-circle' : 'fas fa-play-circle'
}

playButton.onclick = pauseSong
forwardButton.onclick = nextSong
backwardButton.onclick = previousSong

function previousSong() {
  songIndex--
  if(songIndex < 0) songIndex = album.length - 1
  player.loadVideoById(album[songIndex].videoId)
}

function nextSong() {
  songIndex++
  if(songIndex >= album.length) songIndex = 0
  player.loadVideoById(album[songIndex].videoId)
}

// calculate selected time in song from click on the progress bar
function getProgressTime(e) {
  const increase = songProgress.clientWidth - e.offsetX
  const percent = (songProgress.clientWidth - increase) / songProgress.clientWidth
  return player.getDuration() * percent
}

songProgress.onclick = e => {
  player.seekTo(getProgressTime(e), true)
}

songProgress.onmousemove = e => {
  let currentTime = Math.ceil(getProgressTime(e))
  let seconds = "" + Math.ceil(currentTime % 60)
  let time = `${Math.ceil(currentTime / 60 - 1)}:${seconds.padStart(2, 0)}`

  hoverTime.innerHTML = time
  hoverTime.classList.add('hover')
  hoverTime.style.left = e.offsetX + 50 + 'px'
}

songProgress.onmouseleave = () => {
  hoverTime.classList.remove('hover')
  hoverTime.innerHTML = ''
}

searchField.onsubmit = async e => {
  e.preventDefault()
  searchSong()
}

async function searchSong(name) {
  let search = searchField.querySelector('input');
  if(name) {
    search.value = name;
  } else {
    name = search.value;
  }
  if(location.search.includes('?search=')) {
    history.pushState(null, null, location.pathname + location.search.replace(/search=[\w%]+&/, "search=" + name + '&'))
  } else {
    history.pushState(null, null, location.pathname + '?search=' + name)
  }
  let songs = await fetch('/api/yt/songs/' + name)
  songs = await songs.json()
  album = songs.content ? songs.content : songs
  fillPlaylist()
}