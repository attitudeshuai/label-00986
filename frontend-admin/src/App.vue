<template>
  <div class="app-container">
    <template v-if="isLoginPage">
      <router-view />
    </template>
    <template v-else>
      <SideNav />
      <div class="main-wrapper">
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        <PlayerBar />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SideNav from '@/components/SideNav.vue'
import PlayerBar from '@/components/PlayerBar.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.app-container {
  width: 100%;
  /* 使用百分比高度，避免 100vh 在某些场景下产生 1px 误差导致底部出现空隙 */
  height: 100%;
  display: flex;
  overflow: hidden;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 为底部固定播放器预留空间，避免内容被遮挡 */
  padding-bottom: 80px;
}

.main-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
