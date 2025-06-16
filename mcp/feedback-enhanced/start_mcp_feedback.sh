#!/bin/bash

# MCP Feedback Enhanced 桌面应用程序启动脚本
# 使用方法: ./start_mcp_feedback.sh

echo "🚀 启动 MCP Feedback Enhanced 桌面应用程序..."

# 确保环境变量正确设置
export PATH=$HOME/.local/bin:$PATH
export MCP_DESKTOP_MODE=true
export MCP_WEB_PORT=8765
export MCP_DEBUG=false

# 启动桌面应用程序
uvx -i https://pypi.tuna.tsinghua.edu.cn/simple mcp-feedback-enhanced@latest test --desktop

echo "✅ MCP Feedback Enhanced 桌面应用程序已启动" 