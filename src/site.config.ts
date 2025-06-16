import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: 'City',
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: 'zh-cn',
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  // Used as the default description meta property and webmanifest description
  description: '一个说人话的技术博客',
  // HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
  lang: 'zh-cn',
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: 'zh_cn',
  // Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
  title: 'City 的博客'
}

// Used to generate links in both the Header & Footer.
export const menuLinks: { path: string; title: string }[] = [
  {
    path: '/',
    title: '首页'
  },
  {
    path: '/about/',
    title: '关于'
  },
  {
    path: '/posts/',
    title: '博客'
  },
  {
    path: '/notes/',
    title: '笔记'
  }
]
