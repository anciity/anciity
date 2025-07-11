---
title: '软件开发设计原则'
publishDate: '30 Jun 2025'
description: '想要写好代码，必须要修炼好内功，软件开发的设计原则。'
tags: ['Principle']
---

## 核心开发哲学

这些原则更像是高级的、普适的“口头禅”，时刻提醒我们保持代码的简洁与高效。

### 1. DRY (Don't Repeat Yourself) - 不要重复自己

- **核心思想**：系统中的每一处知识都必须有单一、明确、权威的表示。简单来说，就是**避免重复的代码**。
- **理论**：如果你发现自己在多个地方写了同样（或极其相似）的代码逻辑，那么当需求变更时，你就必须去修改所有这些地方，这很容易出错和遗漏。
- **实践**：
  - **违反 DRY**：在多个组件中都手写了一段完全相同的表单验证逻辑。
  - **遵循 DRY**：将这段验证逻辑抽取成一个独立的、可复用的工具函数或自定义 Hook，然后在所有需要的地方调用它。
  - **手段**：函数、类、组件、继承、组合等都是实现 DRY 的有效工具。

### 2. KISS (Keep It Simple, Stupid) - 保持简单

- **核心思想**：系统设计应尽量简单，避免不必要的复杂性。
- **理论**：简单的解决方案比复杂的更容易理解、实现、调试和维护。当有多种方案可以解决同一个问题时，应该选择最简单的那一个。
- **实践**：
  - **违反 KISS**：为了一个简单的状态切换，引入了一个庞大的状态机库，增加了团队的学习成本和项目复杂度。
  - **遵循 KISS**：对于简单的状态，使用 React 的 `useState` 或 Vue 的 `ref` 就足够了。只有当状态逻辑变得非常复杂时，才考虑引入更复杂的解决方案（如 Redux/Pinia）。

### 3. YAGNI (You Ain't Gonna Need It) - 你不会需要它

- **核心思想**：只在真正需要的时候才添加功能，不要为“未来可能的需求”而编写代码。
- **理论**：这是对抗“过度设计”的有力武器。程序员往往会预测未来的需求并提前实现一些通用功能，但这部分代码很可能永远也用不上，反而增加了当前系统的复杂度和维护成本。
- **实践**：
  - **违反 YAGNI**：在开发一个博客系统时，心想“未来可能需要支持多种数据库”，于是花费大量时间设计了一个复杂的数据库抽象层，但实际上项目在未来几年内都只使用 MySQL。
  - **遵循 YAGNI**：先用最直接的方式实现当前的需求。当未来真的需要支持第二种数据库时，再去进行重构和抽象。

## 面向对象的 SOLID 原则

`SOLID` 是五个面向对象设计基本原则的首字母缩写，它们是构建健壮、可维护的软件系统的基石。

### 1. S - 单一职责原则 (Single Responsibility Principle, SRP)

- **核心思想**：**一个类（或模块、函数）应该只有一个引起它变化的原因。**
- **理论**：如果一个类承担了过多的职责，那么这些职责中的任何一个发生变化，都可能影响到其他职责，导致这个类变得脆弱、难以修改和复用。
- **实践**：
  - **违反 SRP**：一个 `User` 类，既负责存储用户数据（`name`, `email`），又负责将用户数据保存到数据库（`saveToDB()`），还负责向用户发送邮件（`sendEmail()`）。
  - **遵循 SRP**：将职责拆分：
    - `User` 类：只负责存储用户属性。
    - `UserRepository` 类：专门负责用户的数据库操作（增删改查）。
    - `EmailService` 类：专门负责发送邮件。
  - 这样，当数据库逻辑变更时，你只需要修改 `UserRepository`，而不会影响到用户数据模型和邮件服务。

### 2. O - 开闭原则 (Open/Closed Principle, OCP)

- **核心思想**：**软件实体（类、模块、函数等）应该对扩展开放，对修改关闭。**

- **理论**：当需要为软件增加新功能时，我们应该通过增加新代码的方式来实现，而不是修改已有的、工作正常的代码。

- **实践**：

  - **违反 OCP**：一个 `calculateArea(shape)` 函数，内部使用 `if-else` 或 `switch` 来判断形状类型并计算面积。

    ```javascript
    function calculateArea(shape) {
      if (shape.type === 'rectangle') {
        /* ... */
      } else if (shape.type === 'circle') {
        /* ... */
      }
      // 新增三角形时，必须修改此函数
    }
    ```

  - **遵循 OCP**：使用多态。定义一个 `Shape` 接口（或基类），包含一个 `getArea()` 方法。让 `Rectangle` 和 `Circle` 类都实现这个接口。`calculateArea` 函数只负责调用 `shape.getArea()`，它不关心具体的形状是什么。

    ```javascript
    // 新增 Triangle 类时，只需增加新文件，完全不用修改现有代码
    class Triangle {
      getArea() {
        /* ... */
      }
    }
    ```

  - 这是实现可插拔、可扩展系统的关键。

### 3. L - 里氏替换原则 (Liskov Substitution Principle, LSP)

- **核心思想**：**所有引用基类的地方，必须能够透明地使用其子类的对象，而程序行为不发生改变。** 简单说，子类应该可以完全替代父类。
- **理论**：子类继承父类时，不应该改变父类已有的行为和契约。子类可以有自己的新行为，但不能让父类的行为产生“意外”。
- **实践**：
  - **违反 LSP（经典的正方形-矩形问题）**：
    - `Rectangle` 类有 `setWidth` 和 `setHeight` 方法。
    - `Square` 类继承自 `Rectangle`。为了保持“正方形”的特性，当你调用 `square.setWidth(10)` 时，你必须在内部同时将 `height`也设置为 `10`。
    - 这就破坏了父类的行为（设置宽度不应该影响高度）。一个期望使用 `Rectangle` 的函数，如果传入一个 `Square` 对象，可能会得到意想不到的结果。
  - **遵循 LSP**：在这种情况下，可能 `Square` 根本就不应该继承 `Rectangle`，或者它们的继承关系需要重新设计，例如都实现一个共同的 `Shape` 接口。

### 4. I - 接口隔离原则 (Interface Segregation Principle, ISP)

- **核心思想**：**客户端不应该被强迫依赖它不使用的方法。** 应该使用多个专门的接口，而不是一个庞大臃肿的总接口。
- **理论**：如果一个接口包含了太多方法，那么实现这个接口的类可能只需要其中一部分方法，但却被迫要实现所有方法（哪怕是空实现），这造成了不必要的耦合和浪费。
- **实践**：
  - **违反 ISP**：一个巨大的 `IWorker` 接口，包含 `work()`, `eat()`, `sleep()`, `manageTeam()` 等方法。一个普通的 `Programmer` 需要实现所有方法，而一个 `RobotWorker` 被迫也要实现 `eat()` 和 `sleep()`，这显然不合理。
  - **遵循 ISP**：将接口拆分成更小的、更具体的接口：
    - `IWorkable` { `work()` }
    - `IEatable` { `eat()`, `sleep()` }
    - `IManageable` { `manageTeam()` }
  - `Programmer` 可以实现 `IWorkable` 和 `IEatable`，而 `RobotWorker` 只需实现 `IWorkable`。

### 5. D - 依赖倒置原则 (Dependency Inversion Principle, DIP)

- **核心思想**：

  1. **高层模块不应该依赖于低层模块。两者都应该依赖于抽象。**
  2. **抽象不应该依赖于细节。细节应该依赖于抽象。**

- **理论**：这是实现“松耦合”架构的最终武器。它要求我们面向接口编程，而不是面向实现编程。

- **实践**：

  - **违反 DIP**：一个高层的 `NotificationService` 直接依赖于一个低层的 `EmailSender` 类。

    ```javascript
    class NotificationService {
      constructor() {
        this.sender = new EmailSender() // 直接依赖具体实现
      }
      sendNotification(message) {
        this.sender.sendEmail(message)
      }
    }
    ```

    如果想把通知方式从邮件改成短信，就必须修改 `NotificationService` 的内部代码。

  - **遵循 DIP**：

    1. 定义一个抽象接口 `IMessageSender`，包含 `send(message)` 方法。
    2. `NotificationService` 依赖于这个**接口**，而不是任何具体的类。
    3. `EmailSender` 和 `SmsSender` 都去实现 `IMessageSender` 接口。
    4. 通过**依赖注入 (Dependency Injection)** 的方式，在创建 `NotificationService` 实例时，将一个具体的发送器（如 `EmailSender` 的实例）传递给它。

    ```javascript
    class NotificationService {
      constructor(sender) {
        // 依赖于抽象的 sender
        this.sender = sender
      }
      sendNotification(message) {
        this.sender.send(message)
      }
    }
    // const emailNotifier = new NotificationService(new EmailSender());
    // const smsNotifier = new NotificationService(new SmsSender());
    ```

  - 这使得 `NotificationService` 变得非常灵活和可测试。
