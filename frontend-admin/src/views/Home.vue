<template>
  <div class="home-page">
    <div class="content">
      <!-- 头部 -->
      <header class="header">
        <h1 class="page-title">首页</h1>
        <SearchBar @search="handleSearch" />
      </header>

      <!-- 推荐歌曲 -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">推荐歌曲</h2>
          <el-button text type="primary" @click="$router.push('/playlist')">
            查看全部
            <el-icon style="display: inline-flex; align-items: center; justify-content: center;"><ArrowRight /></el-icon>
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
              <el-icon :size="24" color="#F56C6C" style="display: inline-flex; align-items: center; justify-content: center;"><TrendCharts /></el-icon>
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
                  <div class="title ellipsis">
                    <span>{{ song.title }}</span>
                    <span class="artist-inline"> - {{ song.artist }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ranking-card">
            <div class="ranking-header">
              <el-icon :size="24" color="#E6A23C" style="display: inline-flex; align-items: center; justify-content: center;"><Star /></el-icon>
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
                  <div class="title ellipsis">
                    <span>{{ song.title }}</span>
                    <span class="artist-inline"> - {{ song.artist }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ranking-card">
            <div class="ranking-header">
              <el-icon :size="24" color="#67C23A" style="display: inline-flex; align-items: center; justify-content: center;"><Headset /></el-icon>
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
                  <div class="title ellipsis">
                    <span>{{ song.title }}</span>
                    <span class="artist-inline"> - {{ song.artist }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, TrendCharts, Star } from '@element-plus/icons-vue'
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
@use 'sass:color';
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
    align-items: flex-start;
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
      height: auto;
      display: block;
      font-size: $font-size-sm;
      font-weight: 600;
      color: $text-secondary;
      flex-shrink: 0;
      line-height: 1.4;
      text-align: left;
      
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
        line-height: 1.4;
        margin: 0;
        padding: 0;
        
        .artist-inline {
          color: $text-secondary;
          font-weight: normal;
        }
      }
    }
  }
}

</style>
