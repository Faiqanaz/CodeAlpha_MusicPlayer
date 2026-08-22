const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const coverArt = document.getElementById('cover-art');
const glow = document.getElementById('glow');
const progressBar = document.getElementById('progress-bar');
const progressWrapper = document.getElementById('progress-wrapper');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
const volumeSlider = document.getElementById('volume-slider');

// Playlist UI & Autoplay
const playlistToggleBtn = document.getElementById('playlist-toggle-btn');
const playlistPanel = document.getElementById('playlist-panel');
const playlistCloseBtn = document.getElementById('playlist-close-btn');
const songListEl = document.getElementById('song-list');
const autoplayBtn = document.getElementById('autoplay-btn');

// Working, high-reliability royalty-free audio streams
const playlist = [
  {
    title: 'Lofi Study Chill',
    artist: 'FreetouseSounds',
    duration: '2:15',
    src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
  },
  {
    title: 'Corporate Ambient',
    artist: 'MusicTown',
    duration: '2:45',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3'
  },
  {
    title: 'Upbeat Synthwave',
    artist: 'Grand_Project',
    duration: '1:58',
    src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3'
  }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isAutoplayEnabled = true;

function loadTrack(index) {
  const track = playlist[index];
  songTitle.innerText = track.title;
  artistName.innerText = track.artist;
  audio.src = track.src;
  updatePlaylistUI();
}

function playTrack() {
  isPlaying = true;
  audio.play().then(() => {
    playIcon.className = 'fa-solid fa-pause';
    coverArt.classList.add('spinning');
    glow.style.opacity = '0.6';
  }).catch(err => {
    console.error("Playback blocked or failed:", err);
  });
}

function pauseTrack() {
  isPlaying = false;
  audio.pause();
  playIcon.className = 'fa-solid fa-play';
  coverArt.classList.remove('spinning');
  glow.style.opacity = '0.2';
}

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
});

prevBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) playTrack();
});

nextBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) playTrack();
});

// Autoplay & Track End Event
audio.addEventListener('ended', () => {
  if (isAutoplayEnabled) {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    playTrack();
  } else {
    pauseTrack();
  }
});

// Progress Bar Updates
audio.addEventListener('timeupdate', () => {
  const { duration, currentTime } = audio;
  if (isNaN(duration)) return;

  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Formatting time
  const curMin = Math.floor(currentTime / 60);
  const curSec = Math.floor(currentTime % 60);
  currentTimeEl.innerText = `${curMin}:${curSec < 10 ? '0' : ''}${curSec}`;

  const durMin = Math.floor(duration / 60);
  const durSec = Math.floor(duration % 60);
  durationTimeEl.innerText = `${durMin}:${durSec < 10 ? '0' : ''}${durSec}`;
});

// Click on Seek Bar
progressWrapper.addEventListener('click', (e) => {
  const width = progressWrapper.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    audio.currentTime = (clickX / width) * duration;
  }
});

// Volume Control
volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

// Autoplay Toggle
autoplayBtn.addEventListener('click', () => {
  isAutoplayEnabled = !isAutoplayEnabled;
  autoplayBtn.classList.toggle('toggle-active', isAutoplayEnabled);
});

// Playlist Drawer Toggle
playlistToggleBtn.addEventListener('click', () => playlistPanel.classList.add('open'));
playlistCloseBtn.addEventListener('click', () => playlistPanel.classList.remove('open'));

function buildPlaylistUI() {
  songListEl.innerHTML = '';
  playlist.forEach((song, index) => {
    const li = document.createElement('li');
    li.className = `song-item ${index === currentTrackIndex ? 'active' : ''}`;
    li.innerHTML = `
      <div class="song-item-info">
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
      </div>
      <span class="song-duration">${song.duration}</span>
    `;
    li.addEventListener('click', () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      playTrack();
      playlistPanel.classList.remove('open');
    });
    songListEl.appendChild(li);
  });
}

function updatePlaylistUI() {
  const items = songListEl.querySelectorAll('.song-item');
  items.forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Initial Load
buildPlaylistUI();
loadTrack(currentTrackIndex);