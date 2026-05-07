// 格式化工具函数

/**
 * 格式化时间（秒转 mm:ss）
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 格式化时长（秒转 m:ss 或 mm:ss）
 * @deprecated 使用 formatTime 代替
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * 生成占位图 URL
 */
export function getPlaceholderImage(width: number, height: number, text?: string): string {
  const bgColor = '409EFF'
  const textColor = 'ffffff'
  const displayText = text || `${width}x${height}`
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(displayText)}`
}

/**
 * 根据歌曲名和歌手生成唯一的颜色
 * 相同歌曲名和歌手总是生成相同的颜色
 */
export function generateSongColor(title: string, artist: string = ''): string {
  const seed = `${title}-${artist}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  
  // 使用哈希值生成颜色（确保相同歌曲总是相同颜色）
  // 生成一个在色相环上的颜色（0-360度）
  const hue = Math.abs(hash) % 360
  // 使用固定的饱和度和亮度，确保颜色鲜艳且可读
  return `hsl(${hue}, 65%, 55%)`
}