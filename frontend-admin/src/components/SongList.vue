<template>
  <div class="song-list">
    <el-table 
      :data="songs" 
      style="width: 100%"
      :row-class-name="getRowClassName"
      @row-click="handleRowClick"
    >
      <el-table-column width="60" align="center">
        <template #default="{ row, $index }">
          <div class="index-cell">
            <span class="index" v-if="playerStore.currentSong?.id !== row.id">
              {{ $index + 1 }}
            </span>
            <el-icon v-else class="playing-icon" color="#409EFF">
              <VideoPlay />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="歌曲" min-width="200">
        <template #default="{ row }">
          <div class="song-cell">
            <el-image :src="row.cover" class="cover" fit="cover">
              <template #error>
                <div class="cover-placeholder">
                  <el-icon><Headset /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="info">
              <div class="title ellipsis">{{ row.title }}</div>
              <div class="artist ellipsis">{{ row.artist }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="album" label="专辑" min-width="150" show-overflow-tooltip />
      
      <el-table-column label="时长" width="80" align="center">
        <template #default="{ row }">
          {{ formatTime(row.duration) }}
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <div class="actions">
            <el-button
              :icon="row.isFavorite ? StarFilled : Star"
              circle
              size="small"
              :type="row.isFavorite ? 'warning' : 'default'"
              @click.stop="playerStore.toggleFavorite(row.id)"
            />
            <el-button
              :icon="playerStore.currentSong?.id === row.id && playerStore.isPlaying ? VideoPause : VideoPlay"
              circle
              size="small"
              type="primary"
              @click.stop="handlePlay(row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { VideoPlay, VideoPause, Star, StarFilled, Headset } from '@element-plus/icons-vue'
import type { Song } from '@/types/music'
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/format'

defineProps<{
  songs: Song[]
}>()

const playerStore = usePlayerStore()

function getRowClassName({ row }: { row: Song }) {
  return playerStore.currentSong?.id === row.id ? 'playing-row' : ''
}

function handleRowClick(row: Song) {
  handlePlay(row)
}

function handlePlay(song: Song) {
  if (playerStore.currentSong?.id === song.id) {
    playerStore.togglePlay()
  } else {
    playerStore.playSong(song)
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.song-list {
  :deep(.el-table) {
    background: transparent;
    
    .el-table__header-wrapper {
      th {
        background: $bg-hover;
        color: $text-secondary;
        font-weight: 500;
      }
    }
    
    .el-table__row {
      cursor: pointer;
      transition: $transition-fast;
      
      &:hover > td {
        background: $bg-hover;
      }
      
      &.playing-row {
        > td {
          background: rgba(64, 158, 255, 0.08);
        }
        
        .title {
          color: $primary-color;
        }
      }
    }
    
    td {
      border-bottom-color: $border-light;
    }
  }
}

.index-cell {
  .index {
    color: $text-secondary;
    font-size: $font-size-sm;
  }
  
  .playing-icon {
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.song-cell {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  
  .cover {
    width: 40px;
    height: 40px;
    border-radius: $radius-small;
    flex-shrink: 0;
  }
  
  .cover-placeholder {
    width: 100%;
    height: 100%;
    background: $bg-hover;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-secondary;
  }
  
  .info {
    min-width: 0;
    
    .title {
      font-size: $font-size-sm;
      color: $text-primary;
      font-weight: 500;
    }
    
    .artist {
      font-size: $font-size-xs;
      color: $text-secondary;
    }
  }
}

.actions {
  display: flex;
  gap: $spacing-xs;
  justify-content: center;
}
</style>
