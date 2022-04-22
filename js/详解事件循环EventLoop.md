### 前言
***
js语言是单线程的
因为js主要用途是用户交互和操作DOM，多线程会带来复杂的同步问题。
正是因为js是单线程的，所有任务都需要排队执行，为了优化使用计算机的性能，将同步任务放入主线程依次执行，
将异步任务（需要等待执行结果）放入任务队列，当某个异步任务可以执行了，通知主线程才会执行。

### 浏览器端的机制
1. 所有同步任务在主线程上执行，形成一个执行栈
2. 主线程之外，有一个任务队列，异步任务执行完，在任务队列中放置一个事件
3. 主线程执行栈所有同步任务都执行完，读取任务队列，依次（定时任务要看时间）进入执行栈，开始执行
4. 主线程不断重复第3步

### 定时器任务
也会放入任务队列，根据设置的时间定时执行
这个定时并非一定会执行，如果主线程没有被释放，依然要等待，这就是定时器不精准问题
```js
fn();
setTimeout(fn2, 0);
fn3();
```
即使延迟时间设为0，也会导致fn2被放入任务队列，而fn和fn3是在主线程执行的，因此fn2最后执行

### node中的机制
浏览器中，html规范定义了Event Loop，由浏览器厂商完成
Node.js 基本上所有的事件机制都是用观察者模式实现。
Node.js 单线程类似进入一个while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数.
node使用了libuv库来实现Event Loop，分6个阶段反复运行
1. timers，执行setTimeout和setInterval中到期的callback
2. io，执行上一轮中延迟的io callback
3. idle，prepare，队列的移动，仅内部使用
4. poll，最为重要的阶段，执行io的callback
5. check，执行setImmediate的callback
6. close，执行close事件的callback，例如socket.close

node提供的process.nextTick和setImmediate
process.nextTick将事件添加到执行栈的尾部
setImmediate将事件添加到当前任务队列的尾部
由Event Loop的运行机制可以知道
process.nextTick的事件会在执行栈全部执行完，即将开始处理任务队列的时候执行，在所有异步任务之前
setImmediate的事件会在执行栈全部执行完后，在处理任务队列的时候一起执行

宏任务（macrotask）和微任务（microtask）
表示异步任务的两种分类
MacroTask（script代码，setTimeout，setInterval，setImmediate（node独有），io，ui render）
MicroTask（process.nextTick（node独有，并且不推荐使用了），Promise，MutationObserver）
![](https://raw.githubusercontent.com/heyach/blog/main/images/event1.png)

宏任务和微任务的关系
![](https://raw.githubusercontent.com/heyach/blog/main/images/event2.png)