# Vue3 音乐播放器

## How to Run

```bash
# 使用 Docker Compose 运行（推荐）
docker-compose up --build

# 或者本地开发运行
cd frontend-admin
npm install
npm run dev
```

访问地址：http://localhost:5173 (开发模式) 或 http://localhost:8080 (Docker)

## Services

| 服务名称 | 端口 | 描述 |
|---------|------|------|
| frontend-admin | 8080 | Vue3 音乐播放器前端服务 |

## 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |
| user | user123 | 普通用户 |

## 题目内容

使用 Vue3 + TypeScript + Element Plus 构建一个音乐播放器页面项目。

---

## 项目介绍

这是一个基于 Vue3 + TypeScript + Element Plus 构建的现代化音乐播放器应用。

> 💡 **说明**：本项目演示数据（歌曲、用户）均为本地 Mock 数据，无需后端服务即可完整体验。

### 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Element Plus** - 基于 Vue 3 的组件库
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 3 状态管理
- **Vue Router** - Vue 3 路由管理

### 功能特性

- 🎵 音乐播放控制（播放/暂停/上一首/下一首）
- 📋 播放列表管理
- 🔊 音量控制
- 📊 播放进度条
- 🔀 播放模式切换（顺序/随机/单曲循环）
- ❤️ 收藏功能
- 🔍 搜索功能
- 📱 响应式设计

### 项目结构

```
frontend-admin/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── views/           # 页面视图
│   ├── stores/          # Pinia 状态管理
│   ├── router/          # 路由配置
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   ├── styles/          # 全局样式
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── public/              # 公共资源
└── ...
```

### 设计规范

- 统一间距：8px / 16px / 24px
- 圆角：4px / 8px / 12px
- 主色调：#409EFF
- 背景色：#f5f7fa / #ffffff
- 卡片阴影：0 2px 12px rgba(0, 0, 0, 0.1)
