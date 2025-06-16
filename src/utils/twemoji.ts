// 表情符号相关工具函数 - 使用可靠的 CDN 链接
const apis = {
  // 使用Twitter官方的Twemoji CDN
  twemoji: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/'
}

const emojiCache: Record<string, Promise<any>> = {}

export function getIconCode(char: string): string {
  return char.codePointAt(0)!.toString(16).toLowerCase().padStart(4, '0')
}

export function loadEmoji(type: keyof typeof apis, code: string) {
  const key = type + ':' + code
  if (key in emojiCache) return emojiCache[key]

  if (!type || !apis[type]) {
    type = 'twemoji'
  }

  const api = apis[type]
  // Twitter Twemoji使用小写文件名
  return (emojiCache[key] = fetch(`${api}${code.toLowerCase()}.svg`).then(r => r.text()))
}
