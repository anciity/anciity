#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const glob = require('glob')

const projectRoot = path.resolve(__dirname, '..')

/**
 * 读取站点配置
 */
function getSiteConfig() {
  try {
    const configPath = path.join(projectRoot, 'src/site.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf8')

    // 简单的正则提取配置信息
    const titleMatch = configContent.match(/title:\s*['"`]([^'"`]+)['"`]/)
    const authorMatch = configContent.match(/author:\s*['"`]([^'"`]+)['"`]/)
    const descriptionMatch = configContent.match(/description:\s*['"`]([^'"`]+)['"`]/)

    return {
      title: titleMatch ? titleMatch[1] : 'City 的博客',
      author: authorMatch ? authorMatch[1] : 'City',
      description: descriptionMatch ? descriptionMatch[1] : '一个说人话的技术博客'
    }
  } catch (error) {
    console.warn('⚠️  无法读取站点配置，使用默认值')
    return {
      title: 'City 的博客',
      author: 'City',
      description: '一个说人话的技术博客'
    }
  }
}

/**
 * 读取所有 Markdown 文件内容
 */
function readMarkdownFiles() {
  const texts = new Set()

  try {
    // 读取文章内容
    const postFiles = glob.sync(path.join(projectRoot, 'src/content/post/**/*.md'))
    const noteFiles = glob.sync(path.join(projectRoot, 'src/content/note/**/*.md'))

    const allFiles = [...postFiles, ...noteFiles]

    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf8')

      // 提取 frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1]

        // 提取标题
        const titleMatch = frontmatter.match(/title:\s*['"`]?([^'"`\n]+)['"`]?/)
        if (titleMatch) {
          texts.add(titleMatch[1].trim())
        }

        // 提取描述
        const descMatch = frontmatter.match(/description:\s*['"`]?([^'"`\n]+)['"`]?/)
        if (descMatch) {
          texts.add(descMatch[1].trim())
        }

        // 提取标签
        const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/s)
        if (tagsMatch) {
          const tags = tagsMatch[1].match(/['"`]([^'"`]+)['"`]/g)
          if (tags) {
            tags.forEach(tag => {
              const cleanTag = tag.replace(/['"`]/g, '')
              texts.add(cleanTag)
            })
          }
        }
      }

      // 提取正文内容的一部分（避免过多内容）
      const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '')
      const cleanContent = bodyContent
        .replace(/```[\s\S]*?```/g, '') // 移除代码块
        .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
        .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
        .replace(/#+ /g, '') // 移除标题标记
        .replace(/[*_`]/g, '') // 移除格式标记

      // 提取中文字符
      const chineseChars = cleanContent.match(/[\u4e00-\u9fff]/g)
      if (chineseChars) {
        chineseChars.forEach(char => texts.add(char))
      }
    }

    console.log(`📚 读取了 ${allFiles.length} 个文件`)
  } catch (error) {
    console.error('❌ 读取 Markdown 文件时出错:', error.message)
  }

  return texts
}

/**
 * 收集项目中所有需要用到的文字
 */
function collectAllTexts() {
  console.log('🔍 正在收集项目中的所有文字内容...')

  const texts = new Set()

  // 添加基础字符（主要是CJK相关的标点符号和空格）
  const basicChars = [
    ' ', // 空格 - 保留用于字蛛处理
    '！', // 感叹号
    '？', // 问号
    '。', // 句号
    '，', // 逗号
    '；', // 分号
    '：', // 冒号
    '"',
    '"', // 引号
    "'",
    "'", // 单引号
    '（',
    '）', // 括号
    '【',
    '】', // 方括号
    '—',
    '–', // 连字符
    '《',
    '》', // 尖括号
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9' // 数字（保留，因为可能与中文混排）
    // ASCII字符大部分由Inter字体处理，只保留必要的
  ]
  basicChars.forEach(char => texts.add(char))

  // 添加站点配置中的文字
  const siteConfig = getSiteConfig()
  // 将整个字符串添加，同时也逐个字符添加
  texts.add(siteConfig.title)
  texts.add(siteConfig.author)
  texts.add(siteConfig.description)

  // 逐个字符添加，确保空格等字符被包含
  for (const char of siteConfig.title) texts.add(char)
  for (const char of siteConfig.author) texts.add(char)
  for (const char of siteConfig.description) texts.add(char)

  // 添加常用的日期格式文字
  const commonDateTexts = [
    '年',
    '月',
    '日',
    '星期',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'by',
    '的',
    '博客',
    '技术',
    '分享',
    '文章',
    '笔记',
    '标签',
    '时间',
    '阅读',
    '首页',
    '关于',
    '联系',
    '更多',
    '详情',
    '查看',
    '点击',
    '返回',
    '上一页',
    '下一页'
  ]
  commonDateTexts.forEach(text => {
    texts.add(text)
    // 同时逐个字符添加
    for (const char of text) texts.add(char)
  })

  // 读取 Markdown 文件内容
  const markdownTexts = readMarkdownFiles()
  markdownTexts.forEach(text => {
    texts.add(text)
    // 逐个字符添加，确保所有字符都被包含
    for (const char of text) texts.add(char)
  })

  console.log(`✅ 收集完成，共找到 ${texts.size} 个不同的文字片段`)

  return Array.from(texts)
}

/**
 * 复制源字体文件到临时目录
 */
function copySourceFontsToTemp() {
  console.log('📋 正在复制源字体文件到临时目录...')

  const sourceDir = path.join(projectRoot, 'src/assets/fonts/source/NotoSansSC')
  const tempDir = path.join(projectRoot, 'temp-font-spider/fonts/NotoSansSC')

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  const fontFiles = [
    'NotoSansSC-Regular.ttf',
    'NotoSansSC-Medium.ttf',
    'NotoSansSC-SemiBold.ttf',
    'NotoSansSC-Bold.ttf'
  ]

  fontFiles.forEach(filename => {
    const sourcePath = path.join(sourceDir, filename)
    const tempPath = path.join(tempDir, filename)

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, tempPath)
      console.log(`✅ 已复制: ${filename}`)
    } else {
      console.warn(`⚠️  源字体文件不存在: ${sourcePath}`)
    }
  })

  return tempDir
}

/**
 * 创建用于字蛛压缩的 HTML 文件
 */
function createFontSpiderHTML(texts, tempFontDir) {
  console.log('📝 正在创建字蛛压缩用的 HTML 文件...')

  const allText = texts.join('')

  const htmlContent = `<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>字体压缩 - Font Spider</title>
    <style>
        @font-face {
            font-family: 'NotoSansSC-Regular';
            src: url('./fonts/NotoSansSC/NotoSansSC-Regular.ttf') format('truetype');
            font-weight: 400;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'NotoSansSC-Medium';
            src: url('./fonts/NotoSansSC/NotoSansSC-Medium.ttf') format('truetype');
            font-weight: 500;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'NotoSansSC-SemiBold';
            src: url('./fonts/NotoSansSC/NotoSansSC-SemiBold.ttf') format('truetype');
            font-weight: 600;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'NotoSansSC-Bold';
            src: url('./fonts/NotoSansSC/NotoSansSC-Bold.ttf') format('truetype');
            font-weight: 700;
            font-style: normal;
        }
        
        .regular { font-family: 'NotoSansSC-Regular'; }
        .medium { font-family: 'NotoSansSC-Medium'; }
        .semibold { font-family: 'NotoSansSC-SemiBold'; }
        .bold { font-family: 'NotoSansSC-Bold'; }
    </style>
</head>
<body>
    <div class="regular">${allText}</div>
    <div class="medium">${allText}</div>
    <div class="semibold">${allText}</div>
    <div class="bold">${allText}</div>
    
    <!-- 单独的文字片段，确保所有字符都被包含 -->
    ${texts.map(text => `<div class="regular">${text}</div>`).join('\n    ')}
</body>
</html>`

  const tempDir = path.join(projectRoot, 'temp-font-spider')
  const htmlPath = path.join(tempDir, 'font-compress.html')
  fs.writeFileSync(htmlPath, htmlContent, 'utf8')

  console.log(`✅ HTML 文件已创建: ${htmlPath}`)
  return htmlPath
}

/**
 * 执行字蛛压缩
 */
function runFontSpider(htmlPath) {
  console.log('🕷️  正在执行字蛛压缩...')

  return new Promise((resolve, reject) => {
    const fontSpider = spawn('npx', ['font-spider', htmlPath, '--no-backup'], {
      stdio: 'inherit',
      cwd: projectRoot
    })

    fontSpider.on('close', code => {
      if (code === 0) {
        console.log('✅ 字蛛压缩完成')
        resolve()
      } else {
        reject(new Error(`字蛛压缩失败，退出码: ${code}`))
      }
    })

    fontSpider.on('error', error => {
      reject(new Error(`执行字蛛时出错: ${error.message}`))
    })
  })
}

/**
 * 复制压缩后的字体到目标目录
 */
function copyCompressedFonts() {
  console.log('📁 正在复制压缩后的字体文件...')

  const tempFontDir = path.join(projectRoot, 'temp-font-spider/fonts/NotoSansSC')
  const targetDir = path.join(projectRoot, 'src/assets/fonts/optimized/NotoSansSC')

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const fontFiles = [
    'NotoSansSC-Regular.ttf',
    'NotoSansSC-Medium.ttf',
    'NotoSansSC-SemiBold.ttf',
    'NotoSansSC-Bold.ttf'
  ]

  fontFiles.forEach(filename => {
    const tempPath = path.join(tempFontDir, filename)
    const targetPath = path.join(targetDir, filename)

    if (fs.existsSync(tempPath)) {
      fs.copyFileSync(tempPath, targetPath)

      const tempStats = fs.statSync(tempPath)
      const targetStats = fs.statSync(targetPath)

      console.log(`✅ ${filename}: ${(tempStats.size / 1024).toFixed(1)}KB → ${(targetStats.size / 1024).toFixed(1)}KB`)
    } else {
      console.warn(`⚠️  临时字体文件不存在: ${tempPath}`)
    }
  })
}

/**
 * 清理临时文件
 */
function cleanup() {
  console.log('🧹 正在清理临时文件...')

  const tempDir = path.join(projectRoot, 'temp-font-spider')
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })
    console.log('✅ 临时文件清理完成')
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始字体优化流程...\n')

    // 1. 收集所有文字
    const texts = collectAllTexts()

    // 2. 复制源字体文件到临时目录
    const tempFontDir = copySourceFontsToTemp()

    // 3. 创建 HTML 文件
    const htmlPath = createFontSpiderHTML(texts, tempFontDir)

    // 4. 执行字蛛压缩
    await runFontSpider(htmlPath)

    // 5. 复制压缩后的字体
    copyCompressedFonts()

    // 6. 清理临时文件
    cleanup()

    console.log('\n🎉 字体优化完成！')
    console.log('💡 现在可以在 OG 图像生成中使用压缩后的字体了')
  } catch (error) {
    console.error('\n❌字体优化失败:', error.message)
    cleanup()
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = { collectAllTexts, createFontSpiderHTML, runFontSpider }
