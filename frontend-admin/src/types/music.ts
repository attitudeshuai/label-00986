// 音乐相关类型定义

export interface Song {
  id: number
  title: string
  artist: string
  album: string
  duration: number // 秒
  cover: string
  url: string
  isFavorite: boolean
}

export interface Playlist {
  id: number
  name: string
  cover: string
  songs: Song[]
  createTime: string
}

export type PlayMode = 'sequence' | 'random' | 'loop'

export interface PlayerState {
  currentSong: Song | null
  playlist: Song[]
  isPlaying: boolean
  currentTime: number
  volume: number
  playMode: PlayMode
  isMuted: boolean
}

export interface User {
  id: number
  username: string
  avatar: string
  role: 'admin' | 'user'
}
