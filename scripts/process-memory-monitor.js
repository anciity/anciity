#!/usr/bin/env node

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// 正确监控子进程内存使用的脚本
class ProcessMemoryMonitor {
  constructor() {
    this.startTime = Date.now()
    this.memorySnapshots = []
    this.interval = null
    this.childProcess = null
  }

  formatMemory(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  // 获取进程及其子进程的内存使用
  async getProcessMemoryUsage(pid) {
    try {
      // 在macOS/Linux上使用ps命令获取进程内存信息
      const { spawn } = require('child_process')

      return new Promise((resolve, reject) => {
        // 使用ps命令获取进程树的内存使用
        const ps = spawn('ps', ['-o', 'pid,ppid,rss,vsz,pcpu,pmem,comm', '-p', pid.toString()])

        let output = ''
        ps.stdout.on('data', data => {
          output += data.toString()
        })

        ps.on('close', code => {
          if (code !== 0) {
            resolve({ rss: 0, vsz: 0 })
            return
          }

          const lines = output.trim().split('\n')
          if (lines.length < 2) {
            resolve({ rss: 0, vsz: 0 })
            return
          }

          const processInfo = lines[1].trim().split(/\s+/)
          const rss = parseInt(processInfo[2]) * 1024 // RSS in KB, convert to bytes
          const vsz = parseInt(processInfo[3]) * 1024 // VSZ in KB, convert to bytes

          resolve({ rss, vsz })
        })

        ps.on('error', () => {
          resolve({ rss: 0, vsz: 0 })
        })
      })
    } catch (error) {
      return { rss: 0, vsz: 0 }
    }
  }

  // 递归获取进程树的内存使用
  async getProcessTreeMemory(pid) {
    try {
      const { spawn } = require('child_process')

      return new Promise((resolve, reject) => {
        // 获取进程树中所有进程的内存使用
        const ps = spawn('ps', ['-eo', 'pid,ppid,rss,vsz,comm'])

        let output = ''
        ps.stdout.on('data', data => {
          output += data.toString()
        })

        ps.on('close', code => {
          if (code !== 0) {
            resolve({ totalRss: 0, totalVsz: 0, processCount: 0 })
            return
          }

          const lines = output.trim().split('\n').slice(1) // Skip header
          const processes = lines.map(line => {
            const parts = line.trim().split(/\s+/)
            return {
              pid: parseInt(parts[0]),
              ppid: parseInt(parts[1]),
              rss: parseInt(parts[2]) * 1024, // Convert KB to bytes
              vsz: parseInt(parts[3]) * 1024,
              comm: parts[4]
            }
          })

          // 找到目标进程及其所有子进程
          const findChildren = parentPid => {
            const children = processes.filter(p => p.ppid === parentPid)
            let result = children.slice()

            children.forEach(child => {
              result = result.concat(findChildren(child.pid))
            })

            return result
          }

          const targetProcess = processes.find(p => p.pid === pid)
          if (!targetProcess) {
            resolve({ totalRss: 0, totalVsz: 0, processCount: 0 })
            return
          }

          const allProcesses = [targetProcess, ...findChildren(pid)]
          const totalRss = allProcesses.reduce((sum, p) => sum + p.rss, 0)
          const totalVsz = allProcesses.reduce((sum, p) => sum + p.vsz, 0)

          resolve({
            totalRss,
            totalVsz,
            processCount: allProcesses.length,
            processes: allProcesses
          })
        })

        ps.on('error', () => {
          resolve({ totalRss: 0, totalVsz: 0, processCount: 0 })
        })
      })
    } catch (error) {
      return { totalRss: 0, totalVsz: 0, processCount: 0 }
    }
  }

  async takeSnapshot() {
    const elapsed = Date.now() - this.startTime

    // 监控脚本本身的内存使用
    const parentMemory = process.memoryUsage()

    // 监控子进程的内存使用
    let childMemory = { totalRss: 0, totalVsz: 0, processCount: 0 }

    if (this.childProcess && this.childProcess.pid) {
      childMemory = await this.getProcessTreeMemory(this.childProcess.pid)
    }

    const snapshot = {
      time: elapsed,
      parent: {
        rss: parentMemory.rss,
        heapUsed: parentMemory.heapUsed,
        heapTotal: parentMemory.heapTotal,
        external: parentMemory.external
      },
      child: {
        totalRss: childMemory.totalRss,
        totalVsz: childMemory.totalVsz,
        processCount: childMemory.processCount
      },
      total: {
        rss: parentMemory.rss + childMemory.totalRss,
        vsz: childMemory.totalVsz
      }
    }

    this.memorySnapshots.push(snapshot)

    // 实时显示
    console.log(
      `⏱️  ${(elapsed / 1000).toFixed(1)}s | 监控进程: ${this.formatMemory(snapshot.parent.rss)} | 构建进程: ${this.formatMemory(snapshot.child.totalRss)} | 总计: ${this.formatMemory(snapshot.total.rss)}`
    )

    return snapshot
  }

  start() {
    console.log('🔍 开始监控进程内存使用...')
    console.log('📊 监控包括：监控脚本本身 + 所有子进程')

    this.interval = setInterval(async () => {
      await this.takeSnapshot()
    }, 1000)
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

    // 找到总内存使用的峰值
    const peakTotal = this.memorySnapshots.reduce((max, current) => (current.total.rss > max.total.rss ? current : max))

    // 找到子进程内存使用的峰值
    const peakChild = this.memorySnapshots.reduce((max, current) =>
      current.child.totalRss > max.child.totalRss ? current : max
    )

    const avgTotalRss = this.memorySnapshots.reduce((sum, s) => sum + s.total.rss, 0) / this.memorySnapshots.length
    const avgChildRss = this.memorySnapshots.reduce((sum, s) => sum + s.child.totalRss, 0) / this.memorySnapshots.length

    console.log('\n📊 进程内存使用统计:')
    console.log('===================')
    console.log(`⏱️  总构建时间: ${totalTime.toFixed(1)}s`)
    console.log(
      `🔥 峰值总内存: ${this.formatMemory(peakTotal.total.rss)} (在 ${(peakTotal.time / 1000).toFixed(1)}s 时)`
    )
    console.log(
      `🚀 峰值构建进程内存: ${this.formatMemory(peakChild.child.totalRss)} (在 ${(peakChild.time / 1000).toFixed(1)}s 时)`
    )
    console.log(`📊 平均总内存: ${this.formatMemory(avgTotalRss)}`)
    console.log(`📈 平均构建进程内存: ${this.formatMemory(avgChildRss)}`)
    console.log(`🔢 最大进程数: ${Math.max(...this.memorySnapshots.map(s => s.child.processCount))}`)

    // 保存详细数据
    const reportData = {
      totalTime,
      peakTotalMemory: peakTotal.total.rss,
      peakChildMemory: peakChild.child.totalRss,
      averageTotalMemory: avgTotalRss,
      averageChildMemory: avgChildRss,
      snapshots: this.memorySnapshots
    }

    fs.writeFileSync('accurate-memory-stats.json', JSON.stringify(reportData, null, 2))
    console.log('📄 详细数据已保存到 accurate-memory-stats.json')
  }

  // 运行构建并监控
  async runMonitoredBuild(command, args = []) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 开始执行构建命令: ${command} ${args.join(' ')}\n`)

      // 启动监控
      this.start()

      // 运行构建命令
      this.childProcess = spawn(command, args, {
        stdio: 'inherit',
        shell: true
      })

      this.childProcess.on('close', code => {
        this.stop()

        if (code === 0) {
          console.log('\n✅ 构建成功!')
          resolve()
        } else {
          console.log(`\n❌ 构建失败 (退出码: ${code})`)
          reject(new Error(`Build failed with code ${code}`))
        }
      })

      this.childProcess.on('error', error => {
        this.stop()
        console.error('❌ 构建出错:', error)
        reject(error)
      })

      // 处理中断
      process.on('SIGINT', () => {
        console.log('\n⚠️  正在停止...')
        if (this.childProcess) {
          this.childProcess.kill('SIGINT')
        }
        this.stop()
        process.exit(0)
      })
    })
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('使用方法:')
    console.log('  node scripts/process-memory-monitor.js <command> [args...]')
    console.log('')
    console.log('示例:')
    console.log('  node scripts/process-memory-monitor.js pnpm build')
    console.log('  node scripts/process-memory-monitor.js npm run build')
    process.exit(1)
  }

  const command = args[0]
  const commandArgs = args.slice(1)

  const monitor = new ProcessMemoryMonitor()

  try {
    await monitor.runMonitoredBuild(command, commandArgs)
  } catch (error) {
    console.error('监控过程中发生错误:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { ProcessMemoryMonitor }
