#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

class MemoryMonitor {
  constructor() {
    this.memoryData = []
    this.startTime = Date.now()
    this.interval = null
    this.logFile = path.join(process.cwd(), 'memory-usage.log')
    this.csvFile = path.join(process.cwd(), 'memory-usage.csv')
  }

  // 获取当前内存使用情况
  getCurrentMemoryUsage() {
    const memUsage = process.memoryUsage()
    const timestamp = Date.now()
    const elapsed = timestamp - this.startTime

    return {
      timestamp,
      elapsed,
      rss: memUsage.rss, // 常驻内存大小
      heapTotal: memUsage.heapTotal, // 堆内存总大小
      heapUsed: memUsage.heapUsed, // 已使用的堆内存
      external: memUsage.external, // 外部内存使用
      arrayBuffers: memUsage.arrayBuffers || 0 // ArrayBuffer 使用的内存
    }
  }

  // 格式化内存大小
  formatMemory(bytes) {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }

  // 开始监控
  startMonitoring(intervalMs = 1000) {
    console.log('🔍 开始监控内存使用情况...')
    console.log(`📊 监控间隔: ${intervalMs}ms`)
    console.log(`📁 日志文件: ${this.logFile}`)
    console.log(`📈 CSV文件: ${this.csvFile}`)

    // 清空之前的日志
    fs.writeFileSync(this.logFile, '')
    fs.writeFileSync(this.csvFile, 'timestamp,elapsed,rss,heapTotal,heapUsed,external,arrayBuffers\n')

    this.interval = setInterval(() => {
      const memData = this.getCurrentMemoryUsage()
      this.memoryData.push(memData)

      // 写入日志文件
      const logEntry =
        `[${new Date(memData.timestamp).toISOString()}] ` +
        `Elapsed: ${(memData.elapsed / 1000).toFixed(1)}s | ` +
        `RSS: ${this.formatMemory(memData.rss)} | ` +
        `Heap: ${this.formatMemory(memData.heapUsed)}/${this.formatMemory(memData.heapTotal)} | ` +
        `External: ${this.formatMemory(memData.external)} | ` +
        `ArrayBuffers: ${this.formatMemory(memData.arrayBuffers)}\n`

      fs.appendFileSync(this.logFile, logEntry)

      // 写入CSV文件
      const csvEntry = `${memData.timestamp},${memData.elapsed},${memData.rss},${memData.heapTotal},${memData.heapUsed},${memData.external},${memData.arrayBuffers}\n`
      fs.appendFileSync(this.csvFile, csvEntry)

      // 实时显示
      console.log(
        `⏱️  ${(memData.elapsed / 1000).toFixed(1)}s | RSS: ${this.formatMemory(memData.rss)} | Heap: ${this.formatMemory(memData.heapUsed)}`
      )
    }, intervalMs)
  }

  // 停止监控
  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }

    console.log('\n🏁 监控结束')
    this.generateReport()
  }

  // 生成报告
  generateReport() {
    if (this.memoryData.length === 0) {
      console.log('❌ 没有收集到内存数据')
      return
    }

    const totalTime = (Date.now() - this.startTime) / 1000
    const maxRss = Math.max(...this.memoryData.map(d => d.rss))
    const maxHeapUsed = Math.max(...this.memoryData.map(d => d.heapUsed))
    const maxHeapTotal = Math.max(...this.memoryData.map(d => d.heapTotal))
    const avgRss = this.memoryData.reduce((sum, d) => sum + d.rss, 0) / this.memoryData.length
    const avgHeapUsed = this.memoryData.reduce((sum, d) => sum + d.heapUsed, 0) / this.memoryData.length

    const report = `
📊 内存使用统计报告
==================
⏱️  总构建时间: ${totalTime.toFixed(1)}s
📈 数据采样点: ${this.memoryData.length}个

🔥 峰值内存使用:
   - RSS (常驻内存): ${this.formatMemory(maxRss)}
   - 堆内存使用: ${this.formatMemory(maxHeapUsed)}
   - 堆内存总量: ${this.formatMemory(maxHeapTotal)}

📊 平均内存使用:
   - RSS (常驻内存): ${this.formatMemory(avgRss)}
   - 堆内存使用: ${this.formatMemory(avgHeapUsed)}

📁 详细日志: ${this.logFile}
📈 CSV数据: ${this.csvFile}
`

    console.log(report)

    // 保存报告到文件
    const reportFile = path.join(process.cwd(), 'memory-report.txt')
    fs.writeFileSync(reportFile, report)
    console.log(`📄 报告已保存到: ${reportFile}`)
  }
}

// 运行构建命令并监控内存
async function runBuildWithMonitoring(command, args = []) {
  const monitor = new MemoryMonitor()

  // 开始监控
  monitor.startMonitoring(500) // 每500ms采样一次

  return new Promise((resolve, reject) => {
    console.log(`🚀 开始执行构建命令: ${command} ${args.join(' ')}\n`)

    const buildProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    })

    buildProcess.on('close', code => {
      monitor.stopMonitoring()

      if (code === 0) {
        console.log('\n✅ 构建成功完成!')
        resolve()
      } else {
        console.log(`\n❌ 构建失败，退出码: ${code}`)
        reject(new Error(`Build failed with code ${code}`))
      }
    })

    buildProcess.on('error', error => {
      monitor.stopMonitoring()
      console.error('❌ 构建过程出错:', error)
      reject(error)
    })

    // 处理进程中断
    process.on('SIGINT', () => {
      console.log('\n⚠️  收到中断信号，正在清理...')
      buildProcess.kill('SIGINT')
      monitor.stopMonitoring()
      process.exit(0)
    })
  })
}

// 主函数
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('使用方法:')
    console.log('  node scripts/memory-monitor.js <command> [args...]')
    console.log('')
    console.log('示例:')
    console.log('  node scripts/memory-monitor.js pnpm build')
    console.log('  node scripts/memory-monitor.js npm run build')
    console.log('  node scripts/memory-monitor.js astro build')
    process.exit(1)
  }

  const command = args[0]
  const commandArgs = args.slice(1)

  try {
    await runBuildWithMonitoring(command, commandArgs)
  } catch (error) {
    console.error('监控过程中发生错误:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { MemoryMonitor, runBuildWithMonitoring }
