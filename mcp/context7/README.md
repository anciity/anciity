# Context7 - 最新文档获取工具

获取最新的库文档和代码示例，解决 AI 编程助手依赖过时训练数据的问题。

## 🎯 核心功能

Context7 可以动态获取最新的、版本特定的文档和代码示例，直接注入到 AI 的上下文中。

### ❌ 没有 Context7

- 基于过时训练数据的代码示例
- 幻觉出不存在的 API
- 针对旧版本的通用答案

### ✅ 有了 Context7

- 最新的官方文档和代码示例
- 版本特定的准确信息
- 不再有虚构的 API

## 🚀 使用方法

在提示中添加 `use context7`：

```
创建一个使用 app router 的基本 Next.js 项目。use context7

使用 PostgreSQL 写一个删除 city 为空字符串的行的脚本。use context7

如何在 React Query 中使查询失效？use context7
```

## 🛠️ 可用工具

- `resolve-library-id` - 解析库名到 Context7 兼容的 ID
- `get-library-docs` - 获取特定库的文档
  - `context7CompatibleLibraryID` - 库 ID
  - `topic` (可选) - 特定主题过滤
  - `tokens` (可选) - 返回的最大令牌数

## 📚 支持的库

Context7 支持大量流行的库和框架：

- Next.js、React、Vue.js
- Express.js、FastAPI、Django
- MongoDB、PostgreSQL、Redis
- Tailwind CSS、Bootstrap
- 等等...

## 💡 使用示例

```
如何使用 Python requests 库发送 POST 请求？use context7
→ 获取最新的 requests 文档和示例

解释 React 的 useState hook。use context7
→ 获取当前 React 文档中的 useState 用法

配置基本的 Express.js 服务器。use context7
→ 获取最新的 Express.js 设置示例
```

---

�� **告别过时代码，拥抱最新文档！**
