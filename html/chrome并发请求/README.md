### chrome并发请求问题
***

### 场景描述
由于js的线程特性，我们在A页面同时发起多个请求（复杂业务场景，未进行请求优化之前，请求时间有长有短），此时突然跳转了B页面，由于之前A页面的请求大部分在pending中，导致B页面的初始化请求也pending了，最终结果就是B页面等待很久
还有就是tab页，快速的切换tab，也会导致大量请求pending  

![](https://raw.githubusercontent.com/heyach/blog/main/images/reqpending.gif)


```js
// 接口的数字就是接口响应时间
axios.get("/api/list5", {})
axios.get("/api/list9", {})
axios.get("/api/list3", {})
axios.get("/api/list3", {})
axios.get("/api/list4", {})
axios.get("/api/list4", {})
axios.get("/api/list1", {})
axios.get("/api/list1", {})
axios.get("/api/list2", {})
axios.get("/api/list2", {})
axios.get("/api/list5", {})
axios.get("/api/list4", {})
axios.get("/api/list1", {})
axios.get("/api/list1", {})
axios.get("/api/list2", {})
axios.get("/api/list2", {})
axios.get("/api/list5", {})
setTimeout(() => {
    this.$router.push({
        path: "/b",
    });
    // b页面一加载就请求list接口，毫秒级返回
}, 1000);
```

我发现如果同时只发6个以下的请求，B页面的请求时不会阻塞的，会立即返回 

![](https://raw.githubusercontent.com/heyach/blog/main/images/reqpending2.jpg)


```js
axios.get("/api/list5", {})
axios.get("/api/list9", {})
axios.get("/api/list3", {})
axios.get("/api/list3", {})
axios.get("/api/list4", {})

this.$router.push({
    path: "/b",
});
```

再把请求数增加，B页面的请求就开始阻塞，那么B页面的请求会等A页面最慢（9s）的那个请求完才会完成吗？  
好像也不是的，B页面的请求只阻塞了4s（扣除本身响应的时间）  

![](https://raw.githubusercontent.com/heyach/blog/main/images/reqpending3.jpg)


```js
axios.get("/api/list5", {})
axios.get("/api/list9", {})
axios.get("/api/list3", {})
axios.get("/api/list3", {})
axios.get("/api/list4", {})
axios.get("/api/list4", {})
axios.get("/api/list1", {})
axios.get("/api/list1", {})

this.$router.push({
    path: "/b",
});
```
根据响应的过程，分析大致可以得出
排在第7，8两个1s的请求，阻塞了3s，再加本身的1s，4s才能得到响应，因为前6个并发里，2个3s的请求释放了
而B页面的请求为什么也阻塞了4s呢，因为第7个1s请求释放后，list才能开始请求，此时的并发占用是59441和list，44并没有阻塞，只是单纯的需要那么久返回而已

### 可以得出结论
* chrome最大的请求并发数是6
* 完成的请求会释放占用，根据请求的时间点，后续的请求进入并发
* 先发起的请求先占用并发，如果有6个以上的长请求，后续的请求就糟了

![](https://raw.githubusercontent.com/heyach/blog/main/images/reqpending4.jpg)


### 解决方案
如果本页面确实有很多请求，那么要尽量先发起请求时间短的  
如果有从复杂业务场景切换路由的动作，切换之后要取消无用请求
