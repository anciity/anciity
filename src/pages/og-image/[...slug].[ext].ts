import InterRegular from '@/assets/fonts/inter/Inter-Regular.ttf'
import InterMedium from '@/assets/fonts/inter/Inter-Medium.ttf'
import InterSemiBold from '@/assets/fonts/inter/Inter-SemiBold.ttf'
import InterBold from '@/assets/fonts/inter/Inter-Bold.ttf'
import NotoSansSCRegular from '@/assets/fonts/optimized/NotoSansSC/NotoSansSC-Regular.ttf'
import NotoSansSCMedium from '@/assets/fonts/optimized/NotoSansSC/NotoSansSC-Medium.ttf'
import NotoSansSCSemiBold from '@/assets/fonts/optimized/NotoSansSC/NotoSansSC-SemiBold.ttf'
import NotoSansSCBold from '@/assets/fonts/optimized/NotoSansSC/NotoSansSC-Bold.ttf'
import { getAllPosts } from '@/data/post'
import { siteConfig } from '@/site.config'
import { getFormattedDate } from '@/utils/date'
import { getIconCode, loadEmoji } from '@/utils/twemoji'
import { truncateTitle } from '@/utils/og-image-helpers'
import { Resvg } from '@resvg/resvg-js'
import type { APIContext, InferGetStaticPropsType } from 'astro'
import satori, { type SatoriOptions } from 'satori'
import { html } from 'satori-html'
import fs from 'fs'
import path from 'path'

// 缓存字体 buffers 以避免重复读取
let fontBuffersCache: { [key: string]: Buffer } | null = null
let logoBase64Cache: string | null = null

// 获取缓存的字体 buffers
function getFontBuffers() {
  if (!fontBuffersCache) {
    fontBuffersCache = {
      InterRegular: Buffer.from(InterRegular),
      InterMedium: Buffer.from(InterMedium),
      InterSemiBold: Buffer.from(InterSemiBold),
      InterBold: Buffer.from(InterBold),
      NotoSansSCRegular: Buffer.from(NotoSansSCRegular),
      NotoSansSCMedium: Buffer.from(NotoSansSCMedium),
      NotoSansSCSemiBold: Buffer.from(NotoSansSCSemiBold),
      NotoSansSCBold: Buffer.from(NotoSansSCBold)
    }
  }
  return fontBuffersCache
}

// 获取缓存的 logo base64
function getLogoBase64() {
  if (!logoBase64Cache) {
    const logoPath = path.join(process.cwd(), 'public/icon.png')
    const logoBuffer = fs.readFileSync(logoPath)
    logoBase64Cache = `data:image/png;base64,${logoBuffer.toString('base64')}`
  }
  return logoBase64Cache
}

function createSatoriOptions(): SatoriOptions {
  const fonts = getFontBuffers()!

  return {
    fonts: [
      // Inter字体优先处理ASCII字符（包括空格）
      {
        data: fonts.InterRegular as Buffer,
        name: 'Inter',
        style: 'normal',
        weight: 400
      },
      {
        data: fonts.InterMedium as Buffer,
        name: 'Inter',
        style: 'normal',
        weight: 500
      },
      {
        data: fonts.InterSemiBold as Buffer,
        name: 'Inter',
        style: 'normal',
        weight: 600
      },
      {
        data: fonts.InterBold as Buffer,
        name: 'Inter',
        style: 'normal',
        weight: 700
      },
      // Noto Sans SC作为CJK字符的回退字体
      {
        data: fonts.NotoSansSCRegular as Buffer,
        name: 'Noto Sans SC',
        style: 'normal',
        weight: 400
      },
      {
        data: fonts.NotoSansSCMedium as Buffer,
        name: 'Noto Sans SC',
        style: 'normal',
        weight: 500
      },
      {
        data: fonts.NotoSansSCSemiBold as Buffer,
        name: 'Noto Sans SC',
        style: 'normal',
        weight: 600
      },
      {
        data: fonts.NotoSansSCBold as Buffer,
        name: 'Noto Sans SC',
        style: 'normal',
        weight: 700
      }
    ],
    height: 630,
    width: 1200,
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === 'emoji') {
        try {
          const emojiSvg = await loadEmoji('twemoji', getIconCode(segment))
          return `data:image/svg+xml;base64,${Buffer.from(emojiSvg).toString('base64')}`
        } catch (error) {
          console.warn('Failed to load emoji:', segment, error)
          return code
        }
      }
      return code
    }
  }
}

const markup = (title: string, pubDate: string, logoUrl: string) => {
  // 处理标题中的HTML特殊字符和表情符号，并截断过长的标题
  const processedTitle = truncateTitle(title, 50)
  const processedPubDate = pubDate

  // 使用 Inter 作为首选字体，Noto Sans SC 作为 CJK 字符的回退字体
  const fontFamily = "'Inter', 'Noto Sans SC'"

  return html` <div tw="flex flex-col w-full h-full bg-[#f2f2f2] text-[#6b6b6b]">
    <div tw="flex flex-col flex-1 w-full p-10 justify-center">
      <p tw="text-3xl mb-6 text-[#8e8e8e] font-medium" style="font-family: ${fontFamily}">${processedPubDate}</p>
      <h1 tw="text-6xl font-semibold leading-snug text-[#224d67]" style="font-family: ${fontFamily}">
        ${processedTitle}
      </h1>
    </div>
    <div tw="flex items-end justify-between w-full p-10 border-t border-[#dbdbdb] text-3xl text-[#6b6b6b]">
      <div tw="flex items-center">
        <img src="${logoUrl}" width="64" height="64" />
        <p tw="ml-3 text-5xl text-[#545454] font-bold" style="font-family: ${fontFamily}">${siteConfig.title}</p>
      </div>
      <p tw="text-3xl text-[#8e8e8e]" style="font-family: ${fontFamily}">by ${siteConfig.author}</p>
    </div>
  </div>`
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>

export async function GET(context: APIContext) {
  try {
    const { pubDate, title } = context.props as Props
    const postDate = getFormattedDate(pubDate, {
      month: 'long',
      weekday: 'long'
    })

    // 使用缓存的配置和 logo
    const ogOptions = createSatoriOptions()
    const logoUrl = getLogoBase64()

    const svg = await satori(markup(title, postDate, logoUrl), ogOptions)

    // Проверяем, запрашивает ли пользователь PNG
    if (context.url.pathname.endsWith('.png')) {
      const resvg = new Resvg(svg)
      const pngData = resvg.render()
      const pngBuffer = pngData.asPng()

      return new Response(pngBuffer, {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': 'image/png'
        }
      })
    }

    // Проверяем, запрашивает ли пользователь SVG
    if (context.url.pathname.endsWith('.svg')) {
      return new Response(svg, {
        headers: {
          'Cache-Control': 'public, max-age=31536000',
          'Content-Type': 'image/svg+xml; charset=utf-8'
        }
      })
    }

    // Если запрос не заканчивается на .png или .svg, возвращаем ошибку
    return new Response('Unsupported format', { status: 400 })
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts()
  return posts
    .filter(({ data }) => !data.ogImage)
    .flatMap(post => {
      return [
        {
          params: { slug: post.id, ext: 'png' },
          props: {
            pubDate: post.data.updatedDate ?? post.data.publishDate,
            title: post.data.title
          }
        },
        {
          params: { slug: post.id, ext: 'svg' },
          props: {
            pubDate: post.data.updatedDate ?? post.data.publishDate,
            title: post.data.title
          }
        }
      ]
    })
}
