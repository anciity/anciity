#!/usr/bin/env node

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// 简化版内存监控
class SimpleMemoryMonitor {
  constructor() {
    this.startTime = Date.now()
    this.memorySnapshots = []
    this.interval = null
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

    // 实时显示
    console.log(
      `⏱️  ${(elapsed / 1000).toFixed(1)}s | RSS: ${this.formatMemory(snapshot.rss)} | Heap: ${this.formatMemory(snapshot.heapUsed)}`
    )

    return snapshot
  }

  start() {
    console.log('🔍 开始监控内存使用...')
    this.interval = setInterval(() => this.takeSnapshot(), 1000)
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

    console.log('\n📊 内存使用统计:')
    console.log(`⏱️  总构建时间: ${totalTime.toFixed(1)}s`)
    console.log(`🔥 峰值内存: ${this.formatMemory(peak.rss)} (在 ${(peak.time / 1000).toFixed(1)}s 时)`)
    console.log(`📊 平均内存: ${this.formatMemory(avgRss)}`)
    console.log(`📈 平均堆内存: ${this.formatMemory(avgHeap)}`)

    // 保存详细数据
    const reportData = {
      totalTime,
      peakMemory: peak.rss,
      averageMemory: avgRss,
      snapshots: this.memorySnapshots
    }

    fs.writeFileSync('build-memory-stats.json', JSON.stringify(reportData, null, 2))
    console.log('📄 详细数据已保存到 build-memory-stats.json')
  }
}

// 运行构建并监控
async function runMonitoredBuild() {
  const monitor = new SimpleMemoryMonitor()

  return new Promise((resolve, reject) => {
    console.log('🚀 开始构建...\n')

    // 启动监控
    monitor.start()

    // 运行构建命令
    const buildProcess = spawn('pnpm', ['build'], {
      stdio: 'inherit',
      shell: true
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
    await runMonitoredBuild()
  } catch (error) {
    console.error('监控过程出错:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
