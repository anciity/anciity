# Sequential Thinking Tools - 顺序思维工具

通过分步思考和智能工具推荐指导复杂问题解决，提供动态的决策支持系统。

## 🧠 核心概念

Sequential Thinking Tools 是一个 MCP 服务器，结合顺序思维和智能工具建议。为解决问题过程中的每个步骤提供：

- 🤔 **动态反思性问题解决**
- 🔄 **灵活的思维过程适应**
- 🌳 **支持思维分支和修订**
- 🛠️ **每个步骤的智能工具推荐**
- 📊 **工具建议的置信度评分**
- 🔍 **详细的工具推荐理由**

## 🎯 工作原理

系统分析您思维过程的每个步骤，并推荐适当的 MCP 工具来完成任务。每个推荐包括：

- **置信度评分** (0-1) - 表示工具与当前需求的匹配程度
- **清晰的理由** - 解释为什么这个工具会有帮助
- **优先级** - 建议工具执行的顺序
- **替代工具** - 也可以使用的其他工具选项

## 🚀 使用方法

### 基本使用

系统会引导您通过结构化的思维过程，为每个步骤推荐最合适的工具：

```json
{
  "thought": "初步研究了解 Svelte 5 中的通用响应性是什么",
  "current_step": {
    "step_description": "收集 Svelte 5 通用响应性的初始信息",
    "expected_outcome": "清楚理解通用响应性概念",
    "recommended_tools": [
      {
        "tool_name": "search_docs",
        "confidence": 0.9,
        "rationale": "搜索 Svelte 官方文档获取权威信息",
        "priority": 1
      },
      {
        "tool_name": "tavily_search",
        "confidence": 0.8,
        "rationale": "从可靠来源获取额外上下文",
        "priority": 2
      }
    ]
  }
}
```

### 高级功能

- **创建分支** - 探索不同的解决方法
- **修订思考** - 用新信息更新之前的思考
- **维护上下文** - 在多个步骤间保持连贯性
- **建议下一步** - 基于当前发现建议后续步骤

## 🛠️ 可用工具

### `sequentialthinking_tools`

动态反思性问题解决工具，具有智能工具推荐功能。

**主要参数：**

- `thought` (必需) - 当前思考步骤
- `next_thought_needed` (必需) - 是否需要另一个思考步骤
- `thought_number` (必需) - 当前思考编号
- `total_thoughts` (必需) - 预估总思考数

**可选参数：**

- `is_revision` - 是否修订之前的思考
- `branch_from_thought` - 分支起点思考编号
- `current_step` - 当前步骤推荐，包含：
  - `step_description` - 需要做什么
  - `recommended_tools` - 带置信度评分的工具推荐数组
  - `expected_outcome` - 期望的步骤结果
  - `next_step_conditions` - 下一步的条件

## 💡 使用场景

### 技术研究

- 探索新框架或库
- 比较不同的技术方案
- 调研最佳实践

### 问题解决

- 分解复杂技术问题
- 系统性排查错误
- 设计解决方案

### 项目规划

- 架构设计决策
- 技术栈选择
- 开发流程优化

## 🔧 配置示例

对于不同的 MCP 客户端：

### Cursor/Claude Desktop

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "mcp-sequentialthinking-tools"]
    }
  }
}
```

### Cline

```json
{
  "mcpServers": {
    "mcp-sequentialthinking-tools": {
      "command": "npx",
      "args": ["-y", "mcp-sequentialthinking-tools"]
    }
  }
}
```

## 🧩 与其他工具协作

Sequential Thinking Tools 专门设计来与您环境中的其他 MCP 工具协作。它提供基于当前步骤需求的工具推荐，但实际的工具执行由 AI 助手处理。

这使您能够：

- 获得系统性的问题解决指导
- 了解每个步骤最适合的工具
- 维护解决复杂问题时的思维连贯性

---

�� **让思维更有序，让决策更智能！**
