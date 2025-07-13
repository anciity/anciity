#!/usr/bin/env node

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// Netlify专用的构建脚本，优化内存使用
class NetlifyBuildMonitor {
  constructor() {
    this.startTime = Date.now()
    this.memorySnapshots = []
    this.interval = null
    this.isNetlify = process.env.NETLIFY === 'true'
  }

  formatMemory(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  takeSnapshot() {
    const memUsage = process.memoryUsage()
    const elapsed = Date.now() - this.startTime

    const snapshot = {
      time: elapsed,
      rss: memUsage.rss,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external
    }

    this.memorySnapshots.push(snapshot)

    // 在Netlify环境中减少日志输出频率
    if (this.isNetlify) {
      // 每5秒输出一次
      if (Math.floor(elapsed / 5000) !== Math.floor((elapsed - 500) / 5000)) {
        console.log(
          `⏱️  ${(elapsed / 1000).toFixed(1)}s | RSS: ${this.formatMemory(snapshot.rss)} | Heap: ${this.formatMemory(snapshot.heapUsed)}`
        )
      }
    } else {
      console.log(
        `⏱️  ${(elapsed / 1000).toFixed(1)}s | RSS: ${this.formatMemory(snapshot.rss)} | Heap: ${this.formatMemory(snapshot.heapUsed)}`
      )
    }

    return snapshot
  }

  start() {
    console.log('🔍 开始监控构建过程...')
    if (this.isNetlify) {
      console.log('🌐 检测到Netlify环境，启用优化模式')
    }

    // 在Netlify环境中使用更长的间隔
    const interval = this.isNetlify ? 2000 : 1000
    this.interval = setInterval(() => this.takeSnapshot(), interval)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }

    this.generateSummary()
  }

  generateSummary() {
    if (this.memorySnapshots.length === 0) return

    const totalTime = (Date.now() - this.startTime) / 1000
    const peak = this.memorySnapshots.reduce((max, current) => (current.rss > max.rss ? current : max))

    const avgRss = this.memorySnapshots.reduce((sum, s) => sum + s.rss, 0) / this.memorySnapshots.length
    const avgHeap = this.memorySnapshots.reduce((sum, s) => sum + s.heapUsed, 0) / this.memorySnapshots.length

    console.log('\n📊 构建内存统计:')
    console.log(`⏱️  总构建时间: ${totalTime.toFixed(1)}s`)
    console.log(`🔥 峰值内存: ${this.formatMemory(peak.rss)} (在 ${(peak.time / 1000).toFixed(1)}s 时)`)
    console.log(`📊 平均内存: ${this.formatMemory(avgRss)}`)
    console.log(`📈 平均堆内存: ${this.formatMemory(avgHeap)}`)

    // 在Netlify环境中保存简化的报告
    if (this.isNetlify) {
      const reportData = {
        totalTime,
        peakMemory: peak.rss,
        averageMemory: avgRss,
        environment: 'netlify',
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      }

      try {
        fs.writeFileSync('netlify-build-stats.json', JSON.stringify(reportData, null, 2))
        console.log('📄 构建统计已保存到 netlify-build-stats.json')
      } catch (error) {
        console.log('⚠️  无法保存构建统计:', error.message)
      }
    }
  }
}

// 运行构建
async function runOptimizedBuild() {
  const monitor = new NetlifyBuildMonitor()

  return new Promise((resolve, reject) => {
    console.log('🚀 开始优化构建...\n')

    // 启动监控
    monitor.start()

    // 设置Node.js内存选项
    const nodeOptions = process.env.NODE_OPTIONS || ''
    const memoryLimit = process.env.NETLIFY ? '4096' : '2048'

    if (!nodeOptions.includes('--max-old-space-size')) {
      process.env.NODE_OPTIONS = `${nodeOptions} --max-old-space-size=${memoryLimit}`.trim()
    }

    console.log(`💾 Node.js 内存限制: ${memoryLimit}MB`)
    console.log(`⚙️  Node.js 选项: ${process.env.NODE_OPTIONS}`)

    // 运行构建命令
    const buildProcess = spawn('pnpm', ['build'], {
      stdio: 'inherit',
      shell: true,
      env: process.env
    })

    buildProcess.on('close', code => {
      monitor.stop()

      if (code === 0) {
        console.log('\n✅ 构建成功!')
        resolve()
      } else {
        console.log(`\n❌ 构建失败 (退出码: ${code})`)
        reject(new Error(`Build failed with code ${code}`))
      }
    })

    buildProcess.on('error', error => {
      monitor.stop()
      console.error('❌ 构建出错:', error)
      reject(error)
    })

    // 处理中断
    process.on('SIGINT', () => {
      console.log('\n⚠️  正在停止...')
      buildProcess.kill('SIGINT')
      monitor.stop()
      process.exit(0)
    })
  })
}

// 主函数
async function main() {
  try {
    await runOptimizedBuild()
  } catch (error) {
    console.error('构建过程出错:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
