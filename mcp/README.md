# MCP 工具管理

简单的 MCP 工具管理系统，一键配置 Cursor。

## 🚀 快速使用

```bash
# 生成所有配置文件
npm run mcp

# 查看工具列表
npm run mcp:list
```

运行后重启 Cursor 即可使用 MCP 工具。

## 📦 当前工具

### 📚 context7

获取最新的库文档和代码示例，解决 AI 编程助手依赖过时训练数据的问题。

**使用方法**: 在提示中添加 `use context7`

### 🦐 shrimp-task-manager

智能任务管理系统，专为 AI Agent 设计，提供结构化任务规划、自动分解、执行追踪和完整性验证。

**使用方法**: `plan task [描述]`, `execute task [名称]`, `research [技术]`

### 🧠 sequential-thinking

顺序思维工具，通过分步思考和工具推荐指导复杂问题解决，提供智能的决策支持。

**使用方法**: 系统会自动引导思维过程并推荐合适工具

### 🔧 mcp-feedback-enhanced

增强版反馈工具，支持桌面应用和交互式反馈。

## 🔧 添加新工具

1. 创建目录: `mkdir mcp/your-tool`
2. 添加配置: `mcp/your-tool/config.json`

```json
{
  "name": "your-tool",
  "description": "工具描述",
  "version": "latest",
  "type": "python",
  "config": {
    "command": "uvx",
    "args": ["your-tool@latest"],
    "timeout": 600,
    "autoApprove": ["tool_method"]
  }
}
```

3. 重新生成: `npm run mcp`

## 📁 生成的文件

- `.cursor/mcp.json` - MCP 配置
- `.cursor/rules/mcp-rules.mdc` - 使用规则

---

🎯 **一键配置，即用即走！**
