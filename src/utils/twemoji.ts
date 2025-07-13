// 表情符号相关工具函数 - 使用可靠的 CDN 链接
const apis = {
  // 使用Twitter官方的Twemoji CDN
  twemoji: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/'
}

const emojiCache: Record<string, Promise<any>> = {}
const MAX_CACHE_SIZE = 100 // 限制缓存大小以防止内存泄漏

export function getIconCode(char: string): string {
  return char.codePointAt(0)!.toString(16).toLowerCase().padStart(4, '0')
}

export function loadEmoji(type: keyof typeof apis, code: string) {
  const key = type + ':' + code
  if (key in emojiCache) return emojiCache[key]

  if (!type || !apis[type]) {
    type = 'twemoji'
  }

  // 如果缓存太大，清理一些旧的条目
  const cacheKeys = Object.keys(emojiCache)
  if (cacheKeys.length >= MAX_CACHE_SIZE) {
    // 删除最旧的一半缓存
    const keysToDelete = cacheKeys.slice(0, Math.floor(cacheKeys.length / 2))
    keysToDelete.forEach(k => delete emojiCache[k])
  }

  const api = apis[type]
  // Twitter Twemoji使用小写文件名
  return (emojiCache[key] = fetch(`${api}${code.toLowerCase()}.svg`)
    .then(r => r.text())
    .catch(err => {
      // 如果加载失败，从缓存中删除以允许重试
      delete emojiCache[key]
      throw err
    }))
}
