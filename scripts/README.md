# 内存监控工具使用说明

本项目提供了多个内存监控和分析工具，帮助你了解构建过程中的内存使用情况。

## 🚀 快速开始

### 1. 简单内存监控构建

```bash
pnpm run build:memory
```

这会运行构建并实时显示内存使用情况，构建完成后生成简单的统计报告。

### 2. 详细内存监控

```bash
pnpm run build:monitor
```

这会生成详细的内存使用日志，包括：

- `memory-usage.log` - 详细的时间序列日志
- `memory-usage.csv` - CSV格式的数据，可用于Excel分析
- `memory-report.txt` - 完整的统计报告

### 3. OG图片内存分析

```bash
pnpm run analyze:og-memory
```

专门分析OG图片生成过程的内存使用模式，包括字体文件大小、预估内存使用等。

## 📊 输出文件说明

### build:memory 输出

- `build-memory-stats.json` - 包含内存快照和统计数据的JSON文件

### build:monitor 输出

- `memory-usage.log` - 人类可读的详细日志
- `memory-usage.csv` - 机器可读的CSV数据
- `memory-report.txt` - 完整的分析报告

### analyze:og-memory 输出

- 控制台输出包含：
  - 字体文件大小分析
  - Logo文件大小
  - 内存使用估算
  - 并发生成影响分析
  - 优化建议

## 🔧 高级用法

### 自定义监控命令

```bash
# 监控任意命令
node scripts/memory-monitor.js <command> [args...]

# 例如：
node scripts/memory-monitor.js npm run dev
node scripts/memory-monitor.js astro build
```

### 调整监控频率

编辑 `scripts/memory-monitor.js` 文件，修改 `monitor.startMonitoring(500)` 中的数值（毫秒）。

## 📈 数据分析

### CSV数据字段说明

- `timestamp` - 时间戳
- `elapsed` - 从开始的经过时间（毫秒）
- `rss` - 常驻内存大小（字节）
- `heapTotal` - 堆内存总大小（字节）
- `heapUsed` - 已使用的堆内存（字节）
- `external` - 外部内存使用（字节）
- `arrayBuffers` - ArrayBuffer使用的内存（字节）

### 内存类型说明

- **RSS (Resident Set Size)** - 进程实际占用的物理内存
- **Heap Total** - V8引擎分配的堆内存总量
- **Heap Used** - V8引擎实际使用的堆内存
- **External** - V8引擎外部的内存使用（如Buffer、文件句柄等）
- **ArrayBuffers** - ArrayBuffer对象占用的内存

## 🎯 性能优化建议

### 基于监控结果的优化策略

1. **内存峰值过高**

   - 检查是否有内存泄漏
   - 优化大文件处理
   - 考虑流式处理

2. **持续内存增长**

   - 检查循环引用
   - 及时清理不需要的对象
   - 使用WeakMap/WeakSet

3. **OG图片生成优化**
   - 减少字体文件大小
   - 实现字体缓存
   - 限制并发生成数量

## 🔍 故障排除

### 常见问题

1. **权限错误**

   ```bash
   chmod +x scripts/*.js
   ```

2. **找不到命令**
   确保在项目根目录运行命令

3. **内存数据异常**
   检查系统是否有其他高内存使用的进程

### 调试模式

添加 `DEBUG=1` 环境变量获取更详细的输出：

```bash
DEBUG=1 pnpm run build:monitor
```

## 📝 贡献

如果你发现问题或有改进建议，请：

1. 检查现有的监控数据
2. 提供详细的错误信息
3. 包含系统环境信息

## 🔗 相关资源

- [Node.js Memory Usage](https://nodejs.org/api/process.html#process_process_memoryusage)
- [V8 Memory Management](https://v8.dev/blog/memory)
- [Astro Build Performance](https://docs.astro.build/en/guides/troubleshooting/#memory-issues)
