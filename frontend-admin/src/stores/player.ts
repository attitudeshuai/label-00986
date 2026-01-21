import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Song, PlayMode } from '@/types/music'
import { getStorage, setStorage } from '@/utils/storage'

// 模拟音乐数据
const mockSongs: Song[] = [
  {
    id: 1,
    title: '夜曲',
    artist: '周杰伦',
    album: '十一月的萧邦',
    duration: 269,
    cover: 'https://picsum.photos/seed/song1/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    isFavorite: true
  },
  {
    id: 2,
    title: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
    duration: 269,
    cover: 'https://picsum.photos/seed/song2/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    isFavorite: false
  },
  {
    id: 3,
    title: '稻香',
    artist: '周杰伦',
    album: '魔杰座',
    duration: 223,
    cover: 'https://picsum.photos/seed/song3/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    isFavorite: true
  },
  {
    id: 4,
    title: '七里香',
    artist: '周杰伦',
    album: '七里香',
    duration: 299,
    cover: 'https://picsum.photos/seed/song4/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    isFavorite: false
  },
  {
    id: 5,
    title: '青花瓷',
    artist: '周杰伦',
    album: '我很忙',
    duration: 239,
    cover: 'https://picsum.photos/seed/song5/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    isFavorite: false
  },
  {
    id: 6,
    title: '告白气球',
    artist: '周杰伦',
    album: '周杰伦的床边故事',
    duration: 215,
    cover: 'https://picsum.photos/seed/song6/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    isFavorite: true
  }
]

export const usePlayerStore = defineStore('player', () => {
  // 状态
  const playlist = ref<Song[]>(mockSongs)
  const currentSong = ref<Song | null>(null)
  const currentIndex = ref(-1)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(getStorage('volume', 80))
  const isMuted = ref(false)
  const playMode = ref<PlayMode>(getStorage('playMode', 'sequence'))

  // 计算属性
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  const favoriteSongs = computed(() => playlist.value.filter(s => s.isFavorite))

  // 方法
  function playSong(song: Song) {
    const index = playlist.value.findIndex(s => s.id === song.id)
    if (index !== -1) {
      currentSong.value = song
      currentIndex.value = index
      isPlaying.value = true
    }
  }

  function togglePlay() {
    if (!currentSong.value && playlist.value.length > 0) {
      playSong(playlist.value[0])
    } else {
      isPlaying.value = !isPlaying.value
    }
  }

  function playNext() {
    if (playlist.value.length === 0) return
    
    let nextIndex: number
    if (playMode.value === 'random') {
      nextIndex = Math.floor(Math.random() * playlist.value.length)
    } else {
      nextIndex = (currentIndex.value + 1) % playlist.value.length
    }
    playSong(playlist.value[nextIndex])
  }

  function playPrev() {
    if (playlist.value.length === 0) return
    
    let prevIndex: number
    if (playMode.value === 'random') {
      prevIndex = Math.floor(Math.random() * playlist.value.length)
    } else {
      prevIndex = currentIndex.value <= 0 ? playlist.value.length - 1 : currentIndex.value - 1
    }
    playSong(playlist.value[prevIndex])
  }

  function setCurrentTime(time: number) {
    currentTime.value = time
  }

  function setDuration(d: number) {
    // 使用歌曲数据中预设的时长，而不是实际音频时长
    if (currentSong.value) {
      duration.value = currentSong.value.duration
    } else {
      duration.value = d
    }
  }

  function setVolume(v: number) {
    volume.value = v
    isMuted.value = v === 0
    setStorage('volume', v)
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  function togglePlayMode() {
    const modes: PlayMode[] = ['sequence', 'random', 'loop']
    const currentModeIndex = modes.indexOf(playMode.value)
    playMode.value = modes[(currentModeIndex + 1) % modes.length]
    setStorage('playMode', playMode.value)
  }

  function toggleFavorite(songId: number) {
    const song = playlist.value.find(s => s.id === songId)
    if (song) {
      song.isFavorite = !song.isFavorite
    }
  }

  function onSongEnd() {
    if (playMode.value === 'loop') {
      currentTime.value = 0
      isPlaying.value = true
    } else {
      playNext()
    }
  }

  return {
    // 状态
    playlist,
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    // 计算属性
    progress,
    favoriteSongs,
    // 方法
    playSong,
    togglePlay,
    playNext,
    playPrev,
    setCurrentTime,
    setDuration,
    setVolume,
    toggleMute,
    togglePlayMode,
    toggleFavorite,
    onSongEnd
  }
})
