import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/music'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'

// 模拟用户数据
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', avatar: 'https://picsum.photos/seed/admin/100/100', role: 'admin' as const },
  { id: 2, username: 'user', password: 'user123', avatar: 'https://picsum.photos/seed/user/100/100', role: 'user' as const }
]

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(getStorage('user', null))
  const isLoggedIn = computed(() => currentUser.value !== null)

  async function login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    // 模拟登录验证
    const user = mockUsers.find(u => u.username === username && u.password === password)
    
    if (user) {
      const { password: _, ...userInfo } = user
      currentUser.value = userInfo
      setStorage('user', userInfo)
      return { success: true, message: '登录成功' }
    }
    
    return { success: false, message: '用户名或密码错误' }
  }

  function logout() {
    currentUser.value = null
    removeStorage('user')
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    logout
  }
})
