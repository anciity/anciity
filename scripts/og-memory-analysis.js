#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// 分析OG图片生成的内存使用模式
class OGMemoryAnalyzer {
  constructor() {
    this.fontBufferSizes = {}
    this.logoSize = 0
    this.estimatedMemoryUsage = {}
  }

  // 分析字体文件大小
  analyzeFontSizes() {
    const fontDir = path.join(process.cwd(), 'src/assets/fonts')
    const fonts = {
      'Inter-Regular': 'inter/Inter-Regular.ttf',
      'Inter-Medium': 'inter/Inter-Medium.ttf',
      'Inter-SemiBold': 'inter/Inter-SemiBold.ttf',
      'Inter-Bold': 'inter/Inter-Bold.ttf',
      'NotoSansSC-Regular': 'optimized/NotoSansSC/NotoSansSC-Regular.ttf',
      'NotoSansSC-Medium': 'optimized/NotoSansSC/NotoSansSC-Medium.ttf',
      'NotoSansSC-SemiBold': 'optimized/NotoSansSC/NotoSansSC-SemiBold.ttf',
      'NotoSansSC-Bold': 'optimized/NotoSansSC/NotoSansSC-Bold.ttf'
    }

    console.log('📊 字体文件大小分析:')
    console.log('==================')

    let totalFontSize = 0

    for (const [name, relativePath] of Object.entries(fonts)) {
      const fontPath = path.join(fontDir, relativePath)
      try {
        const stats = fs.statSync(fontPath)
        const sizeKB = (stats.size / 1024).toFixed(2)
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2)

        this.fontBufferSizes[name] = stats.size
        totalFontSize += stats.size

        console.log(`📝 ${name}: ${sizeKB} KB (${sizeMB} MB)`)
      } catch (error) {
        console.log(`❌ ${name}: 文件不存在`)
      }
    }

    console.log(`\n🔥 字体总大小: ${(totalFontSize / 1024 / 1024).toFixed(2)} MB`)
    return totalFontSize
  }

  // 分析logo文件大小
  analyzeLogoSize() {
    const logoPath = path.join(process.cwd(), 'public/icon.png')
    try {
      const stats = fs.statSync(logoPath)
      this.logoSize = stats.size
      console.log(`\n🖼️  Logo文件大小: ${(stats.size / 1024).toFixed(2)} KB`)
      return stats.size
    } catch (error) {
      console.log('\n❌ Logo文件不存在')
      return 0
    }
  }

  // 估算内存使用
  estimateMemoryUsage() {
    const totalFontSize = Object.values(this.fontBufferSizes).reduce((sum, size) => sum + size, 0)

    // 估算值 (基于经验值)
    const estimates = {
      fontBuffers: totalFontSize, // 字体缓存
      logoBase64: this.logoSize * 1.33, // Base64编码会增加约33%的大小
      satoriCanvas: 1200 * 630 * 4, // 1200x630 RGBA canvas
      resvgBuffer: 1200 * 630 * 4 * 1.2, // PNG压缩前的缓冲区
      overhead: totalFontSize * 0.2 // 其他开销估算20%
    }

    const totalEstimated = Object.values(estimates).reduce((sum, size) => sum + size, 0)

    console.log('\n💾 内存使用估算:')
    console.log('================')
    console.log(`📝 字体缓存: ${(estimates.fontBuffers / 1024 / 1024).toFixed(2)} MB`)
    console.log(`🖼️  Logo Base64: ${(estimates.logoBase64 / 1024).toFixed(2)} KB`)
    console.log(`🎨 Satori Canvas: ${(estimates.satoriCanvas / 1024 / 1024).toFixed(2)} MB`)
    console.log(`📦 RESVG Buffer: ${(estimates.resvgBuffer / 1024 / 1024).toFixed(2)} MB`)
    console.log(`⚙️  其他开销: ${(estimates.overhead / 1024 / 1024).toFixed(2)} MB`)
    console.log(`\n🔥 总估算内存: ${(totalEstimated / 1024 / 1024).toFixed(2)} MB`)

    return estimates
  }

  // 分析并发生成的影响
  analyzeConcurrentGeneration() {
    const posts = this.getPostCount()
    const memoryPerImage = this.estimateMemoryUsage()
    const totalMemory = Object.values(memoryPerImage).reduce((sum, size) => sum + size, 0)

    console.log('\n🔄 并发生成分析:')
    console.log('================')
    console.log(`📄 总文章数: ${posts}`)
    console.log(`📊 每张图片内存: ${(totalMemory / 1024 / 1024).toFixed(2)} MB`)

    // 假设不同的并发级别
    const concurrencyLevels = [1, 2, 4, 8]

    concurrencyLevels.forEach(level => {
      const concurrentMemory = totalMemory * level
      console.log(`🔀 ${level}个并发: ${(concurrentMemory / 1024 / 1024).toFixed(2)} MB`)
    })
  }

  // 获取文章数量
  getPostCount() {
    try {
      const postDir = path.join(process.cwd(), 'src/content/post')
      const files = fs.readdirSync(postDir, { withFileTypes: true })
      return files.filter(file => file.isFile() && file.name.endsWith('.md')).length
    } catch (error) {
      return 0
    }
  }

  // 提供优化建议
  provideOptimizationSuggestions() {
    const totalFontSize = Object.values(this.fontBufferSizes).reduce((sum, size) => sum + size, 0)

    console.log('\n💡 优化建议:')
    console.log('============')

    if (totalFontSize > 5 * 1024 * 1024) {
      // 5MB
      console.log('🔧 字体优化:')
      console.log('   - 考虑使用字体子集化减少文件大小')
      console.log('   - 只加载必要的字体权重')
    }

    console.log('🔧 内存优化:')
    console.log('   - 实现字体缓存以避免重复加载')
    console.log('   - 考虑流式生成而非批量生成')
    console.log('   - 使用对象池复用Buffer')

    console.log('🔧 构建优化:')
    console.log('   - 限制OG图片生成的并发数')
    console.log('   - 考虑在构建后异步生成OG图片')
    console.log('   - 使用增量构建避免重复生成')
  }

  // 运行完整分析
  runFullAnalysis() {
    console.log('🔍 OG图片生成内存分析')
    console.log('====================\n')

    this.analyzeFontSizes()
    this.analyzeLogoSize()
    this.estimateMemoryUsage()
    this.analyzeConcurrentGeneration()
    this.provideOptimizationSuggestions()

    console.log('\n📄 分析完成!')
  }
}

// 主函数
function main() {
  const analyzer = new OGMemoryAnalyzer()
  analyzer.runFullAnalysis()
}

if (require.main === module) {
  main()
}

module.exports = { OGMemoryAnalyzer }
