<template>
  <div 
    class="song-card" 
    :class="{ playing: isPlaying }"
    @click="handlePlay"
  >
    <div class="cover-wrapper">
      <el-image :src="song.cover" class="cover" fit="cover">
        <template #error>
          <div class="cover-placeholder">
            <el-icon :size="32"><Headset /></el-icon>
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
import { VideoPlay, VideoPause, Star, StarFilled, Headset } from '@element-plus/icons-vue'
import type { Song } from '@/types/music'
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/format'

const props = defineProps<{
  song: Song
}>()

const playerStore = usePlayerStore()

const isPlaying = computed(() => 
  playerStore.currentSong?.id === props.song.id && playerStore.isPlaying
)

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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.8);
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
    }
  }
  
  .favorite-btn {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    opacity: 0;
    transition: $transition-fast;
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
