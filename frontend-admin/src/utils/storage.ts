// 本地存储工具

const PREFIX = 'music_player_'

export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage set error:', e)
  }
}

export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(PREFIX + key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.error('Storage get error:', e)
    return defaultValue
  }
}

export function removeStorage(key: string): void {
  localStorage.removeItem(PREFIX + key)
}
