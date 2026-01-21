<template>
  <div class="player-bar">
    <template v-if="playerStore.currentSong">
      <!-- 歌曲信息 -->
      <div class="song-info">
        <el-image 
          :src="playerStore.currentSong.cover || 'invalid-url'" 
          class="cover"
          fit="cover"
        >
          <template #error>
            <div class="cover-placeholder" :style="{ background: `linear-gradient(135deg, ${currentSongColor} 0%, ${currentSongColor}dd 100%)` }">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="music-icon">
                <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div class="song-title">{{ playerStore.currentSong.title }}</div>
            </div>
          </template>
        </el-image>
        <div class="info">
          <div class="title ellipsis">{{ playerStore.currentSong.title }}</div>
          <div class="artist ellipsis">{{ playerStore.currentSong.artist }}</div>
        </div>
        <el-button 
          :icon="playerStore.currentSong.isFavorite ? StarFilled : Star"
          circle 
          size="small"
          :type="playerStore.currentSong.isFavorite ? 'warning' : 'default'"
          @click="playerStore.toggleFavorite(playerStore.currentSong!.id)"
        />
      </div>

      <!-- 播放控制 -->
      <div class="controls">
        <div class="control-buttons">
          <el-tooltip :content="playModeText" placement="top">
            <el-button :icon="playModeIcon" circle size="small" @click="playerStore.togglePlayMode" />
          </el-tooltip>
          <el-button :icon="ArrowLeftBold" circle @click="playerStore.playPrev" />
          <el-button 
            :icon="playerStore.isPlaying ? VideoPause : VideoPlay" 
            circle 
            size="large"
            type="primary"
            @click="playerStore.togglePlay"
            :loading="isLoading"
          />
          <el-button :icon="ArrowRightBold" circle @click="playerStore.playNext" />
          <el-button :icon="List" circle size="small" @click="showPlaylist = true" />
        </div>
        
        <div class="progress-bar">
          <span class="time">{{ formatTime(displayTime) }}</span>
          <el-slider 
            v-model="progressValue"
            :show-tooltip="false"
            @input="handleProgressInput"
            @change="handleProgressChange"
            class="progress-slider"
          />
          <span class="time">{{ formatTime(playerStore.duration) }}</span>
        </div>
      </div>

      <!-- 音量控制 -->
      <div class="volume-control">
        <el-button 
          :icon="volumeIcon" 
          circle 
          size="small"
          @click="playerStore.toggleMute"
        />
        <el-slider 
          v-model="volumeValue"
          :show-tooltip="false"
          @input="handleVolumeChange"
          class="volume-slider"
        />
      </div>

      <!-- 隐藏的 audio 元素 -->
      <audio 
        ref="audioRef"
        :src="playerStore.currentSong.url"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @ended="playerStore.onSongEnd"
        @canplay="handleCanPlay"
        @waiting="isLoading = true"
      />

      <!-- 播放列表抽屉 -->
      <el-drawer v-model="showPlaylist" title="播放列表" direction="rtl" size="360px">
        <div class="playlist-drawer">
          <div 
            v-for="song in playerStore.playlist" 
            :key="song.id"
            class="playlist-item"
            :class="{ active: song.id === playerStore.currentSong?.id }"
            @click="playerStore.playSong(song)"
          >
            <el-image :src="song.cover || 'invalid-url'" class="item-cover" fit="cover">
              <template #error>
                <div class="cover-placeholder-sm" :style="{ background: `linear-gradient(135deg, ${generateSongColor(song.title, song.artist)} 0%, ${generateSongColor(song.title, song.artist)}dd 100%)` }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="music-icon">
                    <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
                    <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <div class="song-title">{{ song.title }}</div>
                </div>
              </template>
            </el-image>
            <div class="item-info">
              <div class="item-title ellipsis">{{ song.title }}</div>
              <div class="item-artist ellipsis">{{ song.artist }}</div>
            </div>
            <span class="item-duration">{{ formatTime(song.duration) }}</span>
          </div>
        </div>
      </el-drawer>
    </template>
    
    <!-- 无歌曲时的占位 -->
    <template v-else>
      <div class="empty-player">
        <el-icon :size="20"><Headset /></el-icon>
        <span>暂无播放歌曲</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, shallowRef } from 'vue'
import { 
  VideoPlay, VideoPause, ArrowLeftBold, ArrowRightBold,
  Star, StarFilled, List,
  Mute, Microphone, RefreshRight, DCaret, Sort
} from '@element-plus/icons-vue'
import { usePlayerStore } from '@/stores/player'
import { formatTime, generateSongColor } from '@/utils/format'

const playerStore = usePlayerStore()
const audioRef = shallowRef<HTMLAudioElement | null>(null)
const showPlaylist = ref(false)
const isLoading = ref(false)
const isDragging = ref(false)
const dragValue = ref(0)
const draggingTime = ref(0)

const progressValue = computed({
  get: () => isDragging.value ? dragValue.value : playerStore.progress,
  set: (val: number) => {
    dragValue.value = val
  }
})

const volumeValue = computed({
  get: () => playerStore.isMuted ? 0 : playerStore.volume,
  set: () => {}
})

const playModeIcon = computed(() => {
  switch (playerStore.playMode) {
    case 'loop': return RefreshRight    // 单曲循环 - 循环箭头
    case 'random': return Sort          // 随机播放 - 交叉箭头
    default: return DCaret              // 顺序播放 - 双箭头（列表循环）
  }
})

const playModeText = computed(() => {
  switch (playerStore.playMode) {
    case 'loop': return '单曲循环'
    case 'random': return '随机播放'
    default: return '顺序播放'
  }
})

const volumeIcon = computed(() => {
  if (playerStore.isMuted || playerStore.volume === 0) return Mute
  return Microphone
})

// 显示的时间：拖动时显示拖动位置的时间，否则显示实际播放时间
const displayTime = computed(() => {
  return isDragging.value ? draggingTime.value : playerStore.currentTime
})

// 当前歌曲的封面颜色
const currentSongColor = computed(() => {
  if (!playerStore.currentSong) return ''
  return generateSongColor(playerStore.currentSong.title, playerStore.currentSong.artist)
})

function handleProgressChange(value: number | number[]) {
  const numValue = Array.isArray(value) ? value[0] : value
  if (audioRef.value && playerStore.duration > 0) {
    const time = (numValue / 100) * playerStore.duration
    audioRef.value.currentTime = time
    playerStore.setCurrentTime(time)
  }
  isDragging.value = false
}

function handleProgressInput(value: number | number[]) {
  const numValue = Array.isArray(value) ? value[0] : value
  isDragging.value = true
  dragValue.value = numValue
  // 计算拖动位置对应的时间
  if (playerStore.duration > 0) {
    draggingTime.value = (numValue / 100) * playerStore.duration
  }
}

function handleVolumeChange(value: number | number[]) {
  const numValue = Array.isArray(value) ? value[0] : value
  playerStore.setVolume(numValue)
  if (audioRef.value) {
    audioRef.value.volume = numValue / 100
  }
}

function handleTimeUpdate() {
  if (audioRef.value) {
    playerStore.setCurrentTime(audioRef.value.currentTime)
  }
}

function handleLoadedMetadata() {
  if (audioRef.value) {
    playerStore.setDuration(audioRef.value.duration)
    audioRef.value.volume = playerStore.volume / 100
  }
}

function handleCanPlay() {
  isLoading.value = false
  // 歌曲加载完成后自动播放
  if (playerStore.isPlaying && audioRef.value) {
    audioRef.value.play()
  }
}

// 监听播放状态
watch(() => playerStore.isPlaying, (playing) => {
  if (audioRef.value) {
    playing ? audioRef.value.play() : audioRef.value.pause()
  }
})

// 监听歌曲切换
watch(() => playerStore.currentSong, () => {
  isLoading.value = true
  if (audioRef.value) {
    audioRef.value.load()
  }
}, { deep: true })
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables.scss' as *;

.player-bar {
  height: 80px;
  min-height: 80px;
  max-height: 80px;
  // 固定在可视区域底部，彻底避免与窗口底部之间出现缝隙
  position: fixed;
  left: 220px; // 与侧边栏宽度保持一致
  right: 0;
  bottom: 0;
  z-index: 100;
  background: $bg-player;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-lg;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  box-sizing: border-box;
}

.empty-player {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  color: rgba(255, 255, 255, 0.4);
  font-size: $font-size-sm;
  overflow: hidden;
  
  .el-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.song-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  width: 280px;
  
  .cover {
    width: 56px;
    height: 56px;
    border-radius: $radius-base;
    flex-shrink: 0;
  }
  
  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.95);
    padding: $spacing-xs;
    
    .music-icon {
      margin-bottom: 2px;
      flex-shrink: 0;
    }
    
    .song-title {
      font-size: 10px;
      font-weight: 500;
      text-align: center;
      line-height: 1.2;
      word-break: break-word;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  
  .info {
    flex: 1;
    min-width: 0;
    
    .title {
      font-size: $font-size-base;
      color: #fff;
      margin-bottom: $spacing-xs;
    }
    
    .artist {
      font-size: $font-size-xs;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

.controls {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding-top: $spacing-xs;
  
  .control-buttons {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    :deep(.el-button) {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .el-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      &.el-button--primary {
        background: $primary-color;
        width: 40px;
        height: 40px;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
        
        &:hover {
          background: #66b1ff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.5);
        }
        
        .el-icon {
          font-size: 20px;
        }
      }
    }
  }
  
  .progress-bar {
    width: 100%;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    .time {
      font-size: $font-size-xs;
      color: rgba(255, 255, 255, 0.6);
      width: 40px;
      text-align: center;
    }
    
    .progress-slider {
      flex: 1;
      // 移除 Element Plus 默认的上下外边距，避免点击进度条时播放器底部出现额外空隙
      margin: 0 !important;
      
      :deep(.el-slider__runway) {
        background: rgba(255, 255, 255, 0.2);
        height: 4px;
        margin: 0;
      }
      
      :deep(.el-slider__bar) {
        background: $primary-color;
        height: 4px;
      }
      
      :deep(.el-slider__button-wrapper) {
        top: -15px;
      }
      
      :deep(.el-slider__button) {
        width: 12px;
        height: 12px;
        border-color: $primary-color;
        background-color: #fff;
      }
    }
  }
}

.volume-control {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  width: 160px;
  
  :deep(.el-button) {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .el-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .volume-slider {
    flex: 1;
    // 同步去掉默认外边距，保持整体高度稳定
    margin: 0 !important;
    
    :deep(.el-slider__runway) {
      background: rgba(255, 255, 255, 0.2);
    }
    
    :deep(.el-slider__bar) {
      background: $primary-color;
    }
    
    :deep(.el-slider__button) {
      width: 10px;
      height: 10px;
      border-color: $primary-color;
    }
  }
}

.playlist-drawer {
  .playlist-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm;
    border-radius: $radius-base;
    cursor: pointer;
    transition: $transition-fast;
    
    &:hover {
      background: $bg-hover;
    }
    
    &.active {
      background: rgba(64, 158, 255, 0.1);
      
      .item-title {
        color: $primary-color;
      }
    }
    
    .item-cover {
      width: 40px;
      height: 40px;
      border-radius: $radius-small;
      flex-shrink: 0;
    }
    
    .cover-placeholder-sm {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.95);
      padding: 2px;
      
      .music-icon {
        margin-bottom: 2px;
        flex-shrink: 0;
      }
      
      .song-title {
        font-size: 8px;
        font-weight: 500;
        text-align: center;
        line-height: 1.1;
        word-break: break-word;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    
    .item-info {
      flex: 1;
      min-width: 0;
      
      .item-title {
        font-size: $font-size-sm;
        color: $text-primary;
      }
      
      .item-artist {
        font-size: $font-size-xs;
        color: $text-secondary;
      }
    }
    
    .item-duration {
      font-size: $font-size-xs;
      color: $text-secondary;
    }
  }
}
</style>
