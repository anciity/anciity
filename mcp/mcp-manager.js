#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

class MCPManager {
  constructor() {
    this.mcpDir = path.join(__dirname)
    this.cursorConfigPath = path.join(__dirname, '..', '.cursor', 'mcp.json')
    this.cursorRulesDir = path.join(__dirname, '..', '.cursor', 'rules')
  }

  // 扫描 MCP 工具
  scanMCPTools() {
    const tools = []
    const entries = fs.readdirSync(this.mcpDir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        const configPath = path.join(this.mcpDir, entry.name, 'config.json')
        if (fs.existsSync(configPath)) {
          try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
            tools.push({ directory: entry.name, config })
          } catch (error) {
            console.warn(`⚠️  跳过无效配置: ${entry.name}/config.json`)
          }
        }
      }
    }
    return tools
  }

  // 生成配置文件
  generateConfig() {
    const tools = this.scanMCPTools()

    // 生成 MCP 配置
    const mcpServers = {}
    for (const tool of tools) {
      mcpServers[tool.config.name] = tool.config.config
    }

    // 确保目录存在
    const cursorDir = path.dirname(this.cursorConfigPath)
    if (!fs.existsSync(cursorDir)) {
      fs.mkdirSync(cursorDir, { recursive: true })
    }
    if (!fs.existsSync(this.cursorRulesDir)) {
      fs.mkdirSync(this.cursorRulesDir, { recursive: true })
    }

    // 写入 MCP 配置
    fs.writeFileSync(this.cursorConfigPath, JSON.stringify({ mcpServers }, null, 2))

    // 写入使用规则
    const rules = [
      '---',
      'description: MCP 工具使用规则',
      'alwaysApply: true',
      '---',
      '',
      '# MCP 工具使用规则',
      '',
      '## 核心原则',
      '在任何过程、任务或对话中，无论是询问、回复还是完成阶段性任务，都必须调用 MCP mcp-feedback-enhanced。',
      '',
      '每当收到用户反馈时，如果反馈内容不为空，必须再次调用 MCP mcp-feedback-enhanced，并根据反馈内容调整行为。',
      '',
      '只有当用户明确表示"结束"或"不需要更多交互"时，才能停止调用 MCP mcp-feedback-enhanced。',
      '',
      '## 使用场景',
      '- 代码编写和修改时，每个重要步骤都要征求用户意见',
      '- 项目架构决策时，通过反馈工具收集用户偏好',
      '- 问题解决过程中，确认用户对解决方案的满意度',
      '- 功能实现前，验证用户需求理解是否正确'
    ]

    const rulePath = path.join(this.cursorRulesDir, 'mcp-rules.mdc')
    fs.writeFileSync(rulePath, rules.join('\n'))

    console.log('✅ 配置生成完成！')
    console.log(`📁 MCP 配置: ${this.cursorConfigPath}`)
    console.log(`📁 使用规则: ${rulePath}`)
    console.log(`🔧 包含工具: ${tools.map(t => t.config.name).join(', ')}`)
  }

  // 列出工具
  listTools() {
    const tools = this.scanMCPTools()

    console.log('📦 可用工具:')
    if (tools.length === 0) {
      console.log('  (无)')
      return
    }

    tools.forEach(tool => {
      console.log(`  - ${tool.config.name}: ${tool.config.description}`)
    })
  }

  // 主方法
  run() {
    const command = process.argv[2]

    if (command === 'list') {
      this.listTools()
    } else {
      // 默认生成配置
      this.generateConfig()
    }
  }
}

// 运行
new MCPManager().run()
