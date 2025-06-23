---
title: 'JavaScript 事件循环模型'
publishDate: '22 06 2025'
description: '作为一个前端程序员，虽然我们并不需要去写一个像JS一样的语言。但是我们需要知道它是如何运行的，这有助于我们解决写代码时遇见的问题，优化页面性能，能更好的去合理化的书写代码。'
tags: ['JavaScript']
---



## 介绍

众所周知 JavaScript 是一个单线程，但是它却支持异步编程且不阻塞 UI 渲染，这和它的事件循环模型设计密不可分。

首先把它们分解成若干组件：

- 调用栈：跟踪函数调用。当一个函数被调用时，它会被压入栈中。当函数执行完毕后，它会被弹出。
- Web APIs：提供浏览器功能，例如 `setTimeout` DOM 事件和 HTTP 请求。这些 API 处理异步操作。
- 任务队列（宏任务）：存储等待在调用堆栈为空后执行的任务。这些任务通过 `setTimeout`、`setInterval` 或其他 API 进行排队。
- 微任务队列：用于 Promise 和回调的高优先级队列 `MutationObserver`。微任务在任务队列中的任务之前执行。
- 事件循环：不断检查调用栈是否为空，并将微任务队列或任务队列中的任务推送到调用栈执行。



## 工作原理

1. 清空调用栈，执行**同步任务**
2. 依次执行**微任务**队列
3. 更新渲染
   - 若存在 `requestAnimationFrame` 预约且此帧需要刷新，执行 `rAF` 的回调**渲染帧任务**
   - 若样式或布局改变，进行渲染
   - 若此帧有富余时间，执行 `requestIdleCallback` 的回调**闲时任务**
4. 从个任务源中取下一个**宏任务**，继续步骤 1



## 任务类型

在 JavaScript 中的任务类型：

- 同步任务：在调用堆栈上立即执行，代码一行行在调用栈顺序执行，例如：普通函数调用、变量声明、`try / catch`
- 微任务：高优先级异步任务，例如： `Promise` 回调、 `queueMicrotask`
- 宏任务：低优先级异步任务，浏览器为不同 **任务源** 建立多条队列，例如 `setTimeout`、 `setInterval`、`DOM` 事件、`HTTP`
- 渲染帧任务：仅在需要刷新帧时触发，`requestAnimationFrame`
- 闲时任务：只在本帧剩余时间充裕时执行，否则延迟或直到 `timeout` 兜底，`requestIdleCallback`



## 任务干预

浏览器为我们提供了一些干预 `API`，你可以在优化重活时调用它们。



### 微任务 queueMicrotask

[`queueMicrotask()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask) 该接口的方法将微任务排队，以便在控制返回到浏览器的事件循环之前的安全时间执行。

```javascript
queueMicrotask(() => {
  // function contents here
});
```



### 宏任务

 `setTimeout`、 `setInterval`、`DOM` 事件、`HTTP`等等就不举例了。



### 渲染帧 requestAnimationFrame

该 [`window.requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame#callback) 方法告诉浏览器您希望执行动画。它请求浏览器在下一次重新绘制之前调用用户提供的回调函数。

回调函数的调用频率通常与屏幕刷新率一致。最常见的刷新率为 60hz（每秒 60 次/帧），但 75hz、120hz 和 144hz 也较为常用。 为了提升性能和电池续航， `requestAnimationFrame()` 大多数浏览器在后台标签页或隐藏页面运行时都会暂停调用。

```javascript
const element = document.getElementById("some-element-you-want-to-animate");
let start;

function step(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start;

  // Math.min() is used here to make sure the element stops at exactly 200px
  const shift = Math.min(0.1 * elapsed, 200);
  element.style.transform = `translateX(${shift}px)`;
  if (shift < 200) {
    requestAnimationFrame(step);
  }
}

requestAnimationFrame(step);
```



### 闲时任务 requestIdleCallback

该 [`window.requestIdleCallback()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) 方法将一个函数放入队列，以便在浏览器空闲期间调用。这使得开发者能够在主线程上执行后台和低优先级的工作，而不会影响动画和输入响应等延迟关键事件。函数通常按先进先出的顺序调用；但是，`timeout` 如果需要，可以乱序调用具有指定优先级的回调，以便在超时之前运行它们。

您可以 `requestIdleCallback()` 在空闲回调函数中调用，以安排另一个回调在下次通过事件循环时发生。

```javascript
requestIdleCallback(callback)
requestIdleCallback(callback, options)
```

#### [参数](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#parameters)

- [`callback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#callback)

  指向一个函数的引用，该函数应在不久的将来（即事件循环空闲时）调用。回调函数会传递一个[`IdleDeadline`](https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline)对象，该对象描述可用的时间量，以及回调是否由于超时而运行。

- [`options` 选修的](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#options)

  包含可选的配置参数。目前仅定义了一个属性：[`timeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#timeout) 如果已经过此参数所表示的毫秒数并且尚未调用回调，则执行回调的任务将在事件循环中排队（即使这样做可能会对性能造成负面影响）。`timeout` 必须为正值，否则将被忽略。

#### [返回值](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#return_value)

可以通过将 ID 传递到 [`window.cancelIdleCallback()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback) 方法中来取消回调。
