const http = require('http');
const request = require('request');

// 本地请求地址
const hostname = '127.0.0.1';
const port = 8010;
// 代理地址
const proxyUrl = "http://news-at.zhihu.com/api/4"

const apiServer = http.createServer((req, res) => {
  // 接收到本地请求后，用request往代理地址发请求并把返回结果给本地请求
  const url = proxyUrl + req.url;
  // 根据需要处理get post put option等请求方法
  request.get(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // 处理字符集和跨域请求头等问题
      res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(body);
    }
  });
});
// 服务器监听本地请求
apiServer.listen(port, hostname, () => {
  console.log(`proxy run at http://${hostname}:${port}/`);
});

// $.ajax({
//   url: 'http://127.0.0.1:8010/news/3892357',
//   dataType: "json",
//   success: function(res){
//     $("body").html(res.body)
//   }
// })