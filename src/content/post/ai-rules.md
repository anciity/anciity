---
title: '让 AI 在我们的代码库中懂点规矩'
publishDate: '12 Jun 2025'
description: 'AI 对编码带来了前所未有的冲击，许多人在忧患自己会不会失业。我不这么认为，我认为驯服 AI 才是我们要做的，而不是惧怕它。就现阶段而言，AI 所带来的提效作用非常大，所以我们需要了解怎么给 AI 定规矩，让它不要乱改我们的代码！！！'
tags: ['AI', 'Cursor', 'Claude']
---

说到 AI 编码，我只认可 Cursor 和 Claude，为什么这么说呢？

因为它们一个提供了强大的 AI 编码模型，一个颠覆了传统编码模式的代码编辑器（请注意我说的颠覆不是屎上雕花，这里加上一个聊天窗那里加个按钮，诸如此类）。Cursor 作为 VS Code 的继承者，在 AI 代码编辑器这个赛道上，居然打败了本尊成为了 T0 没有之一，可谓是青出于蓝而胜于蓝！！！

回到正题，我们要给 AI 一点颜色瞧瞧，以解决 AI 幻觉（像极了你在工作中不想做，就说不清楚、不了解、不知道、晚点晚点的样子）。对 AI 不要吝啬你的霸道，告诉他什么是不能做的（红线）什么是可以做的（绿线 emm），这样它才会更懂你想要什么。

我们首先尝试回忆一下，在日常编码中对于自身经验的一些提炼，比如公司有公司的规矩，NPM 包需要发布到内部 NPM 源，你却发布到了官方 NPM 源（emm）。当然项目也有项目的规矩，官网项目你用 CSR？再比如你自己也有自己的编码习惯，又或者你的队友和你写代码的理念完全不同，一个完全面向对象一个完全面向过程，你也会很难受对不对。我举的例子可能不够精准但是意思是这个意思。

梳理下来我们发现，好像想教 AI 做事的人好像很多，公司、项目、编码者。我想 Cursor 也是考虑到了这一点，设计了 Rules ，涵盖了 User Rules 和 Project Rules。我们来看看这样是否解决了我们想要教 AI 做事的问题，首先用户规则可以照顾到每一个编码者的编码习惯，其次项目规则照顾到了公司以及项目需要。这样看来确实解决了我们的需求，但是仔细想想还是不知道该如何下手。

不知道怎么下手就对了，编程可不是 CRUD，一个完善的编程体系也尤为重要。根据我个人浅显的经验，我把他们分为**规范**、**模版**、**流程**、**上下文**四大类。

让我们先把它们都列举出来（ PS：给个框架让 AI 给列举了下，我审查后做了点小调整）：

- 规范
  - 通用代码规范
    - **代码风格**：缩进、命名、注释格式
    - **语言特定**：ESLint规则、TypeScript约束
    - **安全基线**：输入校验、SQL注入防护、XSS防护
    - **性能底线**：避免内存泄漏、循环优化、异步处理
    - **可维护性**：函数复杂度控制、模块划分原则
  - 特定框架规范
    - **React规范**：Hooks使用原则、组件设计模式、状态管理
    - **Vue规范**：组合式API约定、响应式数据处理
    - **Node.js规范**：中间件设计、错误处理、异步流控制
    - **数据库规范**：ORM使用约定、查询优化、事务处理
    - **API规范**：RESTful设计、GraphQL schema定义
  - 业务代码规范
    - **金融业务**：精度计算、资金流水、风控规则
    - **电商业务**：库存处理、订单状态、支付流程
    - **内容平台**：数据脱敏、内容审核、权限控制
    - **IoT系统**：设备通信、数据采集、实时处理
    - **合规要求**：GDPR、SOX法案、行业特定标准
  - 经验教训
    - **线上事故**：导致故障的代码模式禁用
    - **性能问题**：已知的性能陷阱和解决方案
    - **安全漏洞**：曾经出现的安全问题预防
    - **维护痛点**：难以维护的代码模式改进
    - **协作冲突**：团队合作中的编码约定
- 模版
  - 说明文档模版
    - **API文档**：接口说明、参数定义、示例代码
    - **README模版**：项目介绍、快速开始、部署指南
    - **技术设计文档**：架构设计、技术选型、实现方案
    - **用户手册**：功能说明、操作指南、FAQ
    - **变更日志**：版本记录、功能更新、破坏性变更
  - 代码组织模版
    - **项目脚手架**：目录结构、配置文件、依赖管理
    - **组件模版**：React组件、Vue组件、通用UI组件
    - **页面模版**：列表页、详情页、表单页标准结构
    - **服务模版**：API服务、数据服务、业务服务
    - **工具模版**：工具函数、自定义Hooks、通用类库
  - 配置模版
    - **构建配置**：Webpack、Vite、Rollup配置模版
    - **代码检查**：ESLint、Prettier、StyleLint配置
    - **测试配置**：Jest、Cypress、Playwright配置
    - **部署配置**：Docker、K8s、CI/CD配置
    - **监控配置**：日志、性能、错误监控配置
- 流程
  - 开发
    - **需求分析**：技术方案设计、工期评估
    - **开发规范**：分支管理、提交信息、代码review
    - **测试流程**：单元测试、集成测试、端到端测试
    - **发布流程**：预发布验证、灰度发布、回滚机制
    - **监控流程**：性能监控、错误告警、日志分析
  - 协作
    - **代码审查**：Review checklist、审查标准、反馈机制
    - **问题处理**：Bug报告、问题分析、解决方案
    - **知识分享**：技术分享、文档维护、经验传承
    - **版本管理**：Git workflow、发布计划、版本标记
    - **沟通机制**：日常同步、技术讨论、决策流程
  - 质保
    - **静态分析**：代码扫描、安全检查、依赖分析
    - **动态测试**：功能测试、性能测试、压力测试
    - **人工审查**：架构review、安全review、业务逻辑review
    - **持续改进**：代码质量度量、技术债务管理、重构计划
- 上下文
  - 项目上下文
    - **架构模式**：微服务、单体应用、Serverless
    - **技术栈**：前端框架、后端语言、数据库选择
    - **团队规模**：小团队敏捷、大团队规范化
    - **项目阶段**：MVP快速开发、成熟产品稳定性优先
    - **业务特点**：B2B企业级、C端高并发、内部工具
  - 环境上下文
    - **开发环境**：本地调试、热重载、Mock数据
    - **测试环境**：自动化测试、数据准备、环境隔离
    - **生产环境**：性能优化、监控告警、容错处理
    - **多环境**：配置管理、数据同步、部署策略

AI 列举的还算可以，详不详细不重要，因为每个人在制定时都得考虑公司、项目、编码者进行裁剪。所以我们继续主题，难道说把这些全部抛给 AI ，就能教 AI 做事情了吗？这样可不行，就好比当你只是写个 “Hello Word”，你的领导却给你开了一天会议告诉你一些八竿子打不着的事情，徒增心智负担罢了。

所以我们不能对着 AI 一顿胡乱教育，到头来你还说人家不行（AI 内心：对对对你牛逼，你了不起）。对，Cursor 一定是也意识到了这一点，在 Project Rules 中设计了Always、Auto Attached、Agent Requested、Manual 四种规则类型，换句程言程语来说就是生命周期。

| 项目规则类型    | 类型描述                                       |
| --------------- | ---------------------------------------------- |
| Always          | 始终包含在模型上下文中                         |
| Auto Attached   | 当引用与 glob 模式匹配的文件时包含             |
| Agent Requested | 规则可供AI使用，由AI决定是否纳入。必须提供描述 |
| Manual          | 只有在使用 @ruleName 明确引用时才包含          |

经过这一通胡乱分析，你是不是终于有了思路，既然有了那便开始对号入座，开始匹配！！！

以下为 AI 的建议，我只能说 AI 还是不全面，知道的没你多，怎么样是不是好起来了，其实是我懒得和它多说，比如代码风格根本不需要配置 Cursor 直接支持 Fix，按照 Lint 报错信息自动修复，所以下面内容可以参考，但还是要有自己的思考在里面！！！

| 类别                | 具体规范                        | 规则类型        | 理由                               |
| ------------------- | ------------------------------- | --------------- | ---------------------------------- |
| **规范-通用代码**   |                                 |                 |                                    |
|                     | 代码风格（缩进、命名、注释）    | Always          | 每行代码都需要遵守，应该自动应用   |
|                     | 语言特定（ESLint、TypeScript）  | Always          | 语法检查是基础要求，必须始终生效   |
|                     | 安全基线（输入校验、防护）      | Always          | 安全是底线，不容妥协，必须自动检查 |
|                     | 性能底线（内存、循环、异步）    | Always          | 基础性能要求，每次编码都应检查     |
|                     | 可维护性（复杂度、模块化）      | Always          | 代码质量基础要求，应该自动监控     |
| **规范-特定框架**   |                                 |                 |                                    |
|                     | React规范（Hooks、组件、状态）  | Auto Attached   | 检测到React文件自动应用            |
|                     | Vue规范（组合式API、响应式）    | Auto Attached   | 检测到Vue文件自动应用              |
|                     | Node.js规范（中间件、错误处理） | Auto Attached   | 检测到Node.js环境自动应用          |
|                     | 数据库规范（ORM、查询优化）     | Auto Attached   | 检测到数据库操作代码自动应用       |
|                     | API规范（RESTful、GraphQL）     | Auto Attached   | 检测到API相关文件自动应用          |
| **规范-业务代码**   |                                 |                 |                                    |
|                     | 金融业务（精度计算、风控）      | Agent Requested | AI识别金融业务场景后推荐           |
|                     | 电商业务（库存、订单、支付）    | Agent Requested | AI识别电商业务场景后推荐           |
|                     | 内容平台（脱敏、审核、权限）    | Agent Requested | AI识别内容平台场景后推荐           |
|                     | IoT系统（设备通信、数据采集）   | Agent Requested | AI识别IoT场景后推荐                |
|                     | 合规要求（GDPR、SOX）           | Agent Requested | AI识别合规需求后推荐               |
| **规范-经验教训**   |                                 |                 |                                    |
|                     | 线上事故（故障模式禁用）        | Always          | 已知问题必须强制避免               |
|                     | 性能问题（性能陷阱预防）        | Always          | 已知性能问题必须自动检查           |
|                     | 安全漏洞（漏洞模式预防）        | Always          | 已知安全问题必须强制避免           |
|                     | 维护痛点（难维护模式改进）      | Agent Requested | AI识别潜在维护问题后推荐           |
|                     | 协作冲突（团队编码约定）        | Always          | 团队协作规范应该自动检查           |
| **模版 - 说明文档** |                                 |                 |                                    |
|                     | API 文档模版                    | Manual          | 开发者根据需要手动选择             |
|                     | README 模版                     | Manual          | 项目初始化时手动选择               |
|                     | 技术设计文档模版                | Manual          | 设计阶段手动选择                   |
|                     | 用户手册模版                    | Manual          | 文档编写时手动选择                 |
|                     | 变更日志模版                    | Manual          | 发版时手动选择                     |
| **模版 - 代码组织** |                                 |                 |                                    |
|                     | 项目脚手架                      | Manual          | 项目初始化时手动选择               |
|                     | 组件模版                        | Auto Attached   | 检测到组件文件时自动推荐           |
|                     | 页面模版                        | Auto Attached   | 检测到页面文件时自动推荐           |
|                     | 服务模版                        | Auto Attached   | 检测到服务层代码时自动推荐         |
|                     | 工具模版                        | Auto Attached   | 检测到工具函数时自动推荐           |
| **模版 - 配置**     |                                 |                 |                                    |
|                     | 构建配置模版                    | Manual          | 项目配置时手动选择                 |
|                     | 代码检查配置                    | Always          | 代码质量基础，应该自动应用         |
|                     | 测试配置模版                    | Manual          | 测试框架选择时手动配置             |
|                     | 部署配置模版                    | Manual          | 部署环境配置时手动选择             |
|                     | 监控配置模版                    | Manual          | 监控系统配置时手动选择             |
| **流程 - 开发**     |                                 |                 |                                    |
|                     | 需求分析流程                    | Manual          | 项目启动时手动执行                 |
|                     | 开发规范（分支、提交、review）  | Always          | 每次开发都应该自动检查             |
|                     | 测试流程                        | Always          | 代码提交时自动触发                 |
|                     | 发布流程                        | Manual          | 发布时手动执行                     |
|                     | 监控流程                        | Always          | 代码运行时自动监控                 |
| **流程 - 协作**     |                                 |                 |                                    |
|                     | 代码审查流程                    | Always          | 每次代码提交都应触发               |
|                     | 问题处理流程                    | Agent Requested | AI识别问题后推荐处理流程           |
|                     | 知识分享流程                    | Manual          | 团队活动时手动执行                 |
|                     | 版本管理流程                    | Always          | 版本控制应该自动管理               |
|                     | 沟通机制                        | Manual          | 团队协作时手动选择                 |
| **流程 - 质保**     |                                 |                 |                                    |
|                     | 静态分析                        | Always          | 代码质量基础，应该自动执行         |
|                     | 动态测试                        | Always          | 代码变更时自动执行                 |
|                     | 人工审查                        | Manual          | 重要变更时手动执行                 |
|                     | 持续改进                        | Agent Requested | AI分析质量趋势后推荐改进           |
| **上下文 - 项目**   |                                 |                 |                                    |
|                     | 架构模式识别                    | Auto Attached   | 分析项目结构自动识别               |
|                     | 技术栈识别                      | Auto Attached   | 分析依赖和配置自动识别             |
|                     | 团队规模适配                    | Agent Requested | AI评估团队规模后推荐规范           |
|                     | 项目阶段识别                    | Agent Requested | AI评估项目成熟度后推荐             |
|                     | 业务特点识别                    | Agent Requested | AI分析业务特征后推荐               |
| **上下文 - 环境**   |                                 |                 |                                    |
|                     | 开发环境配置                    | Auto Attached   | 检测到开发环境自动应用             |
|                     | 测试环境配置                    | Auto Attached   | 检测到测试环境自动应用             |
|                     | 生产环境配置                    | Auto Attached   | 检测到生产环境自动应用             |
|                     | 多环境配置管理                  | Agent Requested | AI识别多环境需求后推荐             |

本文就是在我想去践行前的一些思考，如有不对的地方不要较真。在 AI 出现以前我就开始整理各类规范，终究是没整理完，现在好了到时候让 AI 辅助我整理。我算是一个 AI 重度使用者，Cursor 我用了一年，也用它做出了我的第一个 0-1 独立APP。但我觉得它似乎还不是很服气我，不懂我，所以我觉得是时候给他立点规矩了。

虽然 AI 发展日新月异，越来越不一样，但是短时间内变化不会太大。

我只能说：

这样的投入是值得的，知识积累也是值得的！！！
