<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <el-icon :size="48" color="#409EFF"><Headset /></el-icon>
          <h1 class="title">Music Player</h1>
          <p class="subtitle">登录以享受更多功能</p>
        </div>

        <el-form 
          ref="formRef"
          :model="form" 
          :rules="rules" 
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="用户名"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              size="large" 
              class="login-btn"
              :loading="isLoading"
              native-type="submit"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="login-bg">
        <div class="bg-content">
          <el-icon :size="120" color="rgba(255,255,255,0.8)"><Headset /></el-icon>
          <h2>发现音乐的美好</h2>
          <p>海量音乐，随心畅听</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Headset } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const isLoading = ref(false)
const rememberMe = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      
      try {
        const result = await userStore.login(form.username, form.password)
        
        if (result.success) {
          ElMessage.success(result.message)
          router.push('/')
        } else {
          ElMessage.error(result.message)
        }
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-page;
}

.login-container {
  display: flex;
  width: 900px;
  height: 560px;
  border-radius: $radius-large;
  box-shadow: $shadow-dark;
  overflow: hidden;
}

.login-card {
  flex: 1;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .login-header {
    text-align: center;
    margin-bottom: $spacing-xl;
    
    .title {
      font-size: $font-size-xxl;
      font-weight: 600;
      color: $text-primary;
      margin: $spacing-md 0 $spacing-xs;
    }
    
    .subtitle {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
  
  .login-form {
    max-width: 320px;
    margin: 0 auto;
    width: 100%;
    
    :deep(.el-input__wrapper) {
      border-radius: $radius-base;
    }
    
    :deep(.el-input__inner) {
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: inherit !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    }
    
    .login-btn {
      width: 100%;
      border-radius: $radius-base;
    }
  }
}

.login-bg {
  width: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .bg-content {
    text-align: center;
    color: #fff;
    
    h2 {
      font-size: $font-size-xxl;
      margin: $spacing-lg 0 $spacing-sm;
    }
    
    p {
      font-size: $font-size-base;
      opacity: 0.8;
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  
  .login-bg {
    display: none;
  }
}
</style>
