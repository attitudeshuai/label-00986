<template>
  <aside class="side-nav">
    <div class="logo">
      <el-icon :size="32" color="#409EFF"><Headset /></el-icon>
      <span class="logo-text">Music Player</span>
    </div>
    
    <el-menu
      :default-active="activeMenu"
      class="nav-menu"
      router
      :collapse="false"
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <span>发现音乐</span>
      </el-menu-item>
      <el-menu-item index="/playlist">
        <el-icon><List /></el-icon>
        <span>播放列表</span>
      </el-menu-item>
      <el-menu-item index="/favorites">
        <el-icon><Star /></el-icon>
        <span>我的收藏</span>
      </el-menu-item>
    </el-menu>

    <div class="user-section">
      <template v-if="userStore.isLoggedIn">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="36" :src="userStore.currentUser?.avatar" />
            <span class="username">{{ userStore.currentUser?.username }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-button type="primary" @click="$router.push('/login')">
          <el-icon><User /></el-icon>
          登录
        </el-button>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.side-nav {
  width: 220px;
  height: 100%;
  background: $bg-card;
  border-right: 1px solid $border-light;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-light;
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-lg $spacing-md;
  border-bottom: 1px solid $border-light;
  
  .logo-text {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
  }
}

.nav-menu {
  flex: 1;
  border-right: none;
  padding: $spacing-sm 0;
  
  :deep(.el-menu-item) {
    margin: $spacing-xs $spacing-sm;
    border-radius: $radius-base;
    
    &:hover {
      background: $bg-hover;
    }
    
    &.is-active {
      background: rgba(64, 158, 255, 0.1);
      color: $primary-color;
    }
  }
}

.user-section {
  padding: $spacing-md;
  border-top: 1px solid $border-light;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    padding: $spacing-sm;
    border-radius: $radius-base;
    transition: $transition-fast;
    
    &:hover {
      background: $bg-hover;
    }
    
    .username {
      font-size: $font-size-sm;
      color: $text-primary;
    }
  }
  
  .el-button {
    width: 100%;
  }
}
</style>
