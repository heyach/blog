### iframe通信
***
页面与嵌入的iframe互相通信传递数据

### 跨域限制
由于浏览器的跨域限制，不同域之间是不能访问localStroage，sessionStorage，cookie的，因此不能通过这种方式传递数据

### message事件和postMessage
可以用`postMessage`发送数据，会触发`message`事件，在事件监听的回调里可以接收到数据