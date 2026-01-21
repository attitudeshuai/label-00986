<template>
  <div class="search-bar">
    <el-input
      v-model="searchText"
      placeholder="搜索歌曲、歌手、专辑..."
      :prefix-icon="Search"
      clearable
      size="large"
      @input="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits<{
  search: [keyword: string]
}>()

const searchText = ref('')

function handleSearch() {
  emit('search', searchText.value)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.search-bar {
  max-width: 400px;
  
  :deep(.el-input__wrapper) {
    border-radius: $radius-round;
    box-shadow: $shadow-light;
    
    &:hover, &.is-focus {
      box-shadow: $shadow-base;
    }
  }
}
</style>
