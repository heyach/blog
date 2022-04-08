### axios取消请求
***

### 场景
在很多列表页，或者tab页，展示的数据结构时一样的，只是切换的时候请求参数不一样，但是由于网络等原因，接口响应的时间是不确定的，那么在快速切换的时候，可能会出现先请求的接口后返回的情况，此时列表应该展示最后一次点击的结果，但是由于接口返回时间问题，最后的结果成了最慢接口返回的结果（因为列表数据是共用一个list变量，会不断的被接口返回数据覆盖，直到最后一次），状态和结果不一致。
我们构造3个接口，响应分别是1s，3s，5s，先请求3s的，再快速切换到1s的，我们期望展示的是1s的结果，但是最后的结果是3s的

![](https://raw.githubusercontent.com/heyach/blog/main/images/tabreq.gif)

### 解决思路
在这种情况下，在发起后续请求的时候，可以把之前发起的请求取消掉
axios发起请求时，可以携带一个`cancelToken`的参数，值为`axios.CancelToken`的实例，构造函数接收一个函数，参数即为取消请求的调用
```js
 axios.get(`/api`, {
    cancelToken: new axios.CancelToken((exec) => {
        // 调用exec即取消此次请求，需要自定义取消时机
    })
})
```
接口取消后，会触发axios的reject回调

![](https://raw.githubusercontent.com/heyach/blog/main/images/cancelreq.gif)

可以看到，接口是确实取消了

![](https://raw.githubusercontent.com/heyach/blog/main/images/cancelres.jpg)

### axios过滤器自动添加cancelToken
可以根据业务场景，用axios的过滤器自动给请求添加cancelToken，并且把取消的回调集中管理，在合适的实际批量取消掉还在pending的接口，比如一个页面巨复杂，里面要排队请求几十个接口，但是跳转了页面，如果不取消上一个页面还在排队的请求，就会影响新页面的请求，所以在跳转的时候，把请求取消掉
```js
axios.interceptors.request.use(config => {
    // 为每个接口加上cancalToken
    config.cancelToken = new axios.CancelToken((exec) => {
        window.exec.push(exec)
    })
    return config
}, err => {
    console.log(err)
})
```


