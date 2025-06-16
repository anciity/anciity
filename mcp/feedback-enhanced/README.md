# MCP Feedback Enhanced 桌面应用程序配置说明

## 🎯 配置完成情况

✅ **uv 包管理器已安装**: `/Users/city/.local/bin/uvx`  
✅ **MCP 配置文件已创建**: `.cursor/mcp.json`  
✅ **环境变量已配置**: PATH 已添加到 `~/.zshrc`  
✅ **启动脚本已创建**: `start_mcp_feedback.sh`  
✅ **桌面应用程序已测试**: 运行正常

## 📝 配置文件内容

### `.cursor/mcp.json` (Cursor MCP 配置)

```json
{
  "mcpServers": {
    "mcp-feedback-enhanced": {
      "command": "uvx",
      "args": ["-i", "https://pypi.tuna.tsinghua.edu.cn/simple", "mcp-feedback-enhanced@latest"],
      "timeout": 600,
      "env": {
        "MCP_DESKTOP_MODE": "true",
        "MCP_WEB_PORT": "8765",
        "MCP_DEBUG": "false"
      },
      "autoApprove": ["interactive_feedback"]
    }
  }
}
```

## 🚀 使用方法

### 1. 在 Cursor 中使用

1. 重启 Cursor 编辑器
2. 打开任意项目
3. 使用 AI 助手时，它会自动调用 `mcp-feedback-enhanced` 工具
4. 桌面应用程序会自动启动，提供交互界面

### 2. 手动启动桌面应用程序

```bash
# 方法1：使用启动脚本
./start_mcp_feedback.sh

# 方法2：直接命令
MCP_DESKTOP_MODE=true uvx -i https://pypi.tuna.tsinghua.edu.cn/simple mcp-feedback-enhanced@latest test --desktop
```

### 3. 验证配置

```bash
# 检查版本
uvx -i https://pypi.tuna.tsinghua.edu.cn/simple mcp-feedback-enhanced@latest version

# 测试 Web UI
uvx -i https://pypi.tuna.tsinghua.edu.cn/simple mcp-feedback-enhanced@latest test --web
```

## ⚙️ 环境变量说明

| 变量               | 值      | 说明                 |
| ------------------ | ------- | -------------------- |
| `MCP_DESKTOP_MODE` | `true`  | 启用桌面应用程序模式 |
| `MCP_WEB_PORT`     | `8765`  | Web UI 端口号        |
| `MCP_DEBUG`        | `false` | 调试模式（建议关闭） |

## 🌟 主要特性

- **桌面应用程序**: 基于 Tauri 的原生 macOS 应用
- **提示管理**: 可以保存和重用常用提示
- **自动定时提交**: 支持定时自动提交反馈
- **会话管理**: 本地会话历史记录
- **图片支持**: 支持拖拽上传和剪贴板粘贴
- **多语言**: 支持中文、英文等多种语言

## 🔧 常见问题

### 问题1：Cursor 找不到 MCP 工具

**解决方案**:

1. 确保 `.cursor/mcp.json` 文件存在
2. 重启 Cursor 编辑器
3. 检查 uvx 命令是否在 PATH 中

### 问题2：桌面应用程序无法启动

**解决方案**:

```bash
# 检查依赖
uvx -i https://pypi.tuna.tsinghua.edu.cn/simple mcp-feedback-enhanced@latest version

# 使用调试模式
MCP_DEBUG=true uvx -i https://pypi.tuna.tsinghua.edu.cn/simple mcp-feedback-enhanced@latest test --desktop
```

### 问题3：网络连接问题

**解决方案**: 配置已使用清华大学镜像源，如仍有问题可尝试：

```bash
# 方法1：临时使用官方源
uvx mcp-feedback-enhanced@latest test --desktop

# 方法2：使用其他镜像源
uvx -i https://mirrors.aliyun.com/pypi/simple mcp-feedback-enhanced@latest test --desktop
```

## 📋 AI 助手提示规则

建议在 Cursor 中添加以下提示规则以获得最佳体验：

```
# MCP 交互反馈规则

1. 在任何过程、任务或对话中，无论是询问、回复还是完成阶段性任务，都必须调用 MCP mcp-feedback-enhanced。
2. 每当收到用户反馈时，如果反馈内容不为空，必须再次调用 MCP mcp-feedback-enhanced，并根据反馈内容调整行为。
3. 只有当用户明确表示"结束"或"不需要更多交互"时，才能停止调用 MCP mcp-feedback-enhanced。
4. 除非收到终止指令，所有步骤都必须重复调用 MCP mcp-feedback-enhanced。
5. 在完成任务之前，必须使用 MCP mcp-feedback-enhanced 工具询问用户反馈。
```

---

🎉 **配置完成！** 现在您可以在 Cursor 中享受增强的交互式 AI 开发体验了！
