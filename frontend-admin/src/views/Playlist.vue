<template>
  <div class="playlist-page">
    <div class="content">
      <header class="header">
        <div class="header-left">
          <h1 class="page-title">播放列表</h1>
          <el-tag type="info" size="large">{{ playerStore.playlist.length }} 首歌曲</el-tag>
        </div>
        <div class="header-right">
          <el-radio-group v-model="viewMode" size="default">
            <el-radio-button value="grid">
              <el-icon style="display: inline-flex; align-items: center; justify-content: center;"><Grid /></el-icon>
            </el-radio-button>
            <el-radio-button value="list">
              <el-icon style="display: inline-flex; align-items: center; justify-content: center;"><List /></el-icon>
            </el-radio-button>
          </el-radio-group>
          <SearchBar @search="handleSearch" />
        </div>
      </header>

      <div class="playlist-actions">
        <el-button type="primary" :icon="VideoPlay" @click="playAll" :loading="isLoading">
          播放全部
        </el-button>
        <el-button :icon="Sort" @click="shufflePlay">
          随机播放
        </el-button>
      </div>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="song-grid">
        <SongCard 
          v-for="song in filteredSongs" 
          :key="song.id" 
          :song="song" 
        />
      </div>

      <!-- 列表视图 -->
      <div v-else class="song-list-wrapper">
        <SongList :songs="filteredSongs" />
      </div>

      <!-- 空状态 -->
      <el-empty 
        v-if="filteredSongs.length === 0" 
        description="没有找到相关歌曲"
      >
        <el-button type="primary" @click="searchKeyword = ''">清除搜索</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { VideoPlay, Sort, Grid, List } from '@element-plus/icons-vue'
import SearchBar from '@/components/SearchBar.vue'
import SongCard from '@/components/SongCard.vue'
import SongList from '@/components/SongList.vue'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()
const viewMode = ref<'grid' | 'list'>('grid')
const searchKeyword = ref('')
const isLoading = ref(false)

const filteredSongs = computed(() => {
  if (!searchKeyword.value) return playerStore.playlist
  const keyword = searchKeyword.value.toLowerCase()
  return playerStore.playlist.filter(song => 
    song.title.toLowerCase().includes(keyword) ||
    song.artist.toLowerCase().includes(keyword) ||
    song.album.toLowerCase().includes(keyword)
  )
})

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
}

function playAll() {
  if (filteredSongs.value.length > 0) {
    isLoading.value = true
    setTimeout(() => {
      playerStore.playSong(filteredSongs.value[0])
      isLoading.value = false
      ElMessage.success('开始播放')
    }, 300)
  }
}

function shufflePlay() {
  if (filteredSongs.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredSongs.value.length)
    playerStore.playSong(filteredSongs.value[randomIndex])
    ElMessage.success('随机播放')
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.playlist-page {
  display: flex;
  height: 100%;
  background: $bg-page;
}

.content {
  flex: 1;
  padding: $spacing-lg;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    
    .page-title {
      font-size: $font-size-xxl;
      font-weight: 600;
      color: $text-primary;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
}

.playlist-actions {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
  padding: $spacing-md;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-light;
  
  :deep(.el-button) {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-md;
}

.song-list-wrapper {
  background: $bg-card;
  border-radius: $radius-large;
  box-shadow: $shadow-base;
  overflow: hidden;
}
</style>
