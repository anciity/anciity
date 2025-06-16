// 文本长度限制和处理
export function truncateTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) {
    return title
  }
  return title.substring(0, maxLength - 3) + '...'
}
