<template>
  <div class="home-page">
    <div class="content">
      <!-- 头部 -->
      <header class="header">
        <h1 class="page-title">发现音乐</h1>
        <SearchBar @search="handleSearch" />
      </header>

      <!-- 推荐歌曲 -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">推荐歌曲</h2>
          <el-button text type="primary" @click="$router.push('/playlist')">
            查看全部
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="song-grid">
          <SongCard 
            v-for="song in filteredSongs.slice(0, 4)" 
            :key="song.id" 
            :song="song" 
          />
        </div>
      </section>

      <!-- 热门榜单 -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">热门榜单</h2>
        </div>
        <div class="ranking-cards">
          <div class="ranking-card">
            <div class="ranking-header">
              <el-icon :size="24" color="#F56C6C"><TrendCharts /></el-icon>
              <span>飙升榜</span>
            </div>
            <div class="ranking-list">
              <div 
                v-for="(song, index) in playerStore.playlist.slice(0, 3)" 
                :key="song.id"
                class="ranking-item"
                @click="playerStore.playSong(song)"
              >
                <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                <div class="song-info">
                  <div class="title ellipsis">{{ song.title }}</div>
                  <div class="artist ellipsis">{{ song.artist }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ranking-card">
            <div class="ranking-header">
              <el-icon :size="24" color="#E6A23C"><Star /></el-icon>
              <span>新歌榜</span>
            </div>
            <div class="ranking-list">
              <div 
                v-for="(song, index) in [...playerStore.playlist].reverse().slice(0, 3)" 
                :key="song.id"
                class="ranking-item"
                @click="playerStore.playSong(song)"
              >
                <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                <div class="song-info">
                  <div class="title ellipsis">{{ song.title }}</div>
                  <div class="artist ellipsis">{{ song.artist }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ranking-card">
            <div class="ranking-header">
              <el-icon :size="24" color="#67C23A"><Headset /></el-icon>
              <span>原创榜</span>
            </div>
            <div class="ranking-list">
              <div 
                v-for="(song, index) in playerStore.playlist.slice(1, 4)" 
                :key="song.id"
                class="ranking-item"
                @click="playerStore.playSong(song)"
              >
                <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                <div class="song-info">
                  <div class="title ellipsis">{{ song.title }}</div>
                  <div class="artist ellipsis">{{ song.artist }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 最近播放 -->
      <section class="section" v-if="playerStore.currentSong">
        <div class="section-header">
          <h2 class="section-title">正在播放</h2>
        </div>
        <div class="now-playing-card">
          <el-image :src="playerStore.currentSong.cover" class="cover" fit="cover">
            <template #error>
              <div class="cover-placeholder">
                <el-icon :size="48"><Headset /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="info">
            <h3 class="title">{{ playerStore.currentSong.title }}</h3>
            <p class="artist">{{ playerStore.currentSong.artist }}</p>
            <p class="album">{{ playerStore.currentSong.album }}</p>
            <div class="controls">
              <el-button 
                :icon="playerStore.isPlaying ? VideoPause : VideoPlay"
                type="primary"
                size="large"
                circle
                @click="playerStore.togglePlay"
              />
              <el-button
                :icon="playerStore.currentSong.isFavorite ? StarFilled : Star"
                :type="playerStore.currentSong.isFavorite ? 'warning' : 'default'"
                size="large"
                circle
                @click="playerStore.toggleFavorite(playerStore.currentSong!.id)"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, TrendCharts, Star, StarFilled, Headset, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import SearchBar from '@/components/SearchBar.vue'
import SongCard from '@/components/SongCard.vue'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()
const searchKeyword = ref('')

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
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.home-page {
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
  
  .page-title {
    font-size: $font-size-xxl;
    font-weight: 600;
    color: $text-primary;
  }
}

.section {
  margin-bottom: $spacing-xl;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    
    .section-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;
    }
  }
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-md;
}

.ranking-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-md;
}

.ranking-card {
  background: $bg-card;
  border-radius: $radius-large;
  box-shadow: $shadow-base;
  padding: $spacing-md;
  
  .ranking-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-light;
    
    span {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-primary;
    }
  }
  
  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  .ranking-item {
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
    
    .rank {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-sm;
      font-weight: 600;
      color: $text-secondary;
      
      &.top {
        color: $primary-color;
      }
    }
    
    .song-info {
      flex: 1;
      min-width: 0;
      
      .title {
        font-size: $font-size-sm;
        color: $text-primary;
      }
      
      .artist {
        font-size: $font-size-xs;
        color: $text-secondary;
      }
    }
  }
}

.now-playing-card {
  display: flex;
  gap: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-large;
  box-shadow: $shadow-base;
  padding: $spacing-lg;
  
  .cover {
    width: 160px;
    height: 160px;
    border-radius: $radius-base;
    flex-shrink: 0;
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
  
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .title {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: $spacing-xs;
    }
    
    .artist {
      font-size: $font-size-base;
      color: $text-secondary;
      margin-bottom: $spacing-xs;
    }
    
    .album {
      font-size: $font-size-sm;
      color: $text-placeholder;
      margin-bottom: $spacing-md;
    }
    
    .controls {
      display: flex;
      gap: $spacing-sm;
    }
  }
}
</style>
