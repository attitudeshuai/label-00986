<template>
  <div 
    class="song-card" 
    :class="{ playing: isPlaying }"
    @click="handlePlay"
  >
    <div class="cover-wrapper">
      <el-image :src="song.cover || 'invalid-url'" class="cover" fit="cover">
        <template #error>
          <div class="cover-placeholder" :style="{ background: `linear-gradient(135deg, ${coverColor} 0%, ${coverColor}dd 100%)` }">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="music-icon">
              <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
              <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
            <div class="song-title">{{ song.title }}</div>
          </div>
        </template>
      </el-image>
      <div class="play-overlay">
        <el-icon :size="40" class="play-icon">
          <component :is="isPlaying ? VideoPause : VideoPlay" />
        </el-icon>
      </div>
      <el-button
        class="favorite-btn"
        :icon="song.isFavorite ? StarFilled : Star"
        circle
        size="small"
        :type="song.isFavorite ? 'warning' : 'default'"
        @click.stop="handleFavorite"
      />
    </div>
    <div class="info">
      <div class="title ellipsis">{{ song.title }}</div>
      <div class="artist ellipsis">{{ song.artist }}</div>
      <div class="meta">
        <span class="album ellipsis">{{ song.album }}</span>
        <span class="duration">{{ formatTime(song.duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VideoPlay, VideoPause, Star, StarFilled } from '@element-plus/icons-vue'
import type { Song } from '@/types/music'
import { usePlayerStore } from '@/stores/player'
import { formatTime, generateSongColor } from '@/utils/format'

const props = defineProps<{
  song: Song
}>()

const playerStore = usePlayerStore()

const isPlaying = computed(() => 
  playerStore.currentSong?.id === props.song.id && playerStore.isPlaying
)

const coverColor = computed(() => generateSongColor(props.song.title, props.song.artist))

function handlePlay() {
  if (playerStore.currentSong?.id === props.song.id) {
    playerStore.togglePlay()
  } else {
    playerStore.playSong(props.song)
  }
}

function handleFavorite() {
  playerStore.toggleFavorite(props.song.id)
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables.scss' as *;

.song-card {
  background: $bg-card;
  border-radius: $radius-large;
  box-shadow: $shadow-light;
  overflow: hidden;
  cursor: pointer;
  transition: $transition-base;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-dark;
    
    .play-overlay {
      opacity: 1;
    }
  }
  
  &.playing {
    .cover-wrapper {
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(64, 158, 255, 0.2);
      }
    }
    
    .title {
      color: $primary-color;
    }
  }
}

.cover-wrapper {
  position: relative;
  aspect-ratio: 1;
  
  .cover {
    width: 100%;
    height: 100%;
  }
  
  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.95);
    padding: $spacing-sm;
    
    .music-icon {
      margin-bottom: $spacing-xs;
      flex-shrink: 0;
    }
    
    .song-title {
      font-size: $font-size-xs;
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
  
  .play-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: $transition-fast;
    
    .play-icon {
      color: #fff;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .favorite-btn {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    opacity: 0;
    transition: $transition-fast;
    display: flex;
    align-items: center;
    justify-content: center;
    
    :deep(.el-icon) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  &:hover .favorite-btn {
    opacity: 1;
  }
}

.info {
  padding: $spacing-md;
  
  .title {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }
  
  .artist {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
  }
  
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .album {
      font-size: $font-size-xs;
      color: $text-placeholder;
      flex: 1;
      margin-right: $spacing-sm;
    }
    
    .duration {
      font-size: $font-size-xs;
      color: $text-secondary;
    }
  }
}
</style>
