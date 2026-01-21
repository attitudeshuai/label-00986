<template>
  <div class="favorites-page">
    <div class="content">
      <!-- 未登录提示 -->
      <div class="login-prompt" v-if="!userStore.isLoggedIn">
        <el-empty description="请先登录后查看收藏">
          <template #image>
            <el-icon :size="80" color="#909399"><User /></el-icon>
          </template>
          <el-button type="primary" @click="$router.push('/login')">
            去登录
          </el-button>
        </el-empty>
      </div>

      <!-- 已登录内容 -->
      <template v-else>
        <header class="header">
          <div class="header-info">
            <div class="icon-wrapper">
              <el-icon :size="48" color="#E6A23C"><Star /></el-icon>
            </div>
            <div class="info">
              <h1 class="page-title">我的收藏</h1>
              <p class="description">{{ playerStore.favoriteSongs.length }} 首收藏歌曲</p>
            </div>
          </div>
          <div class="header-actions">
            <el-button 
              type="primary" 
              :icon="VideoPlay" 
              @click="playAll"
              :disabled="playerStore.favoriteSongs.length === 0"
            >
              播放全部
            </el-button>
          </div>
        </header>

        <!-- 收藏列表 -->
        <div class="favorites-content" v-if="playerStore.favoriteSongs.length > 0">
          <SongList :songs="playerStore.favoriteSongs" />
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-else>
          <el-empty description="还没有收藏的歌曲">
            <template #image>
              <el-icon :size="80" color="#C0C4CC"><Star /></el-icon>
            </template>
            <el-button type="primary" @click="$router.push('/playlist')">
              去发现音乐
            </el-button>
          </el-empty>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Star, VideoPlay, User } from '@element-plus/icons-vue'
import SongList from '@/components/SongList.vue'
import { usePlayerStore } from '@/stores/player'
import { useUserStore } from '@/stores/user'

const playerStore = usePlayerStore()
const userStore = useUserStore()

function playAll() {
  if (playerStore.favoriteSongs.length > 0) {
    playerStore.playSong(playerStore.favoriteSongs[0])
    ElMessage.success('开始播放收藏歌曲')
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.favorites-page {
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
  padding: $spacing-lg;
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.1) 0%, rgba(230, 162, 60, 0.05) 100%);
  border-radius: $radius-large;
  border: 1px solid rgba(230, 162, 60, 0.2);
  
  .header-info {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    
    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: $bg-card;
      border-radius: $radius-large;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: $shadow-base;
    }
    
    .info {
      .page-title {
        font-size: $font-size-xxl;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: $spacing-xs;
      }
      
      .description {
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }
  }
}

.favorites-content {
  background: $bg-card;
  border-radius: $radius-large;
  box-shadow: $shadow-base;
  overflow: hidden;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: $bg-card;
  border-radius: $radius-large;
  box-shadow: $shadow-base;
}

.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  background: $bg-card;
  border-radius: $radius-large;
  box-shadow: $shadow-base;
}
</style>
