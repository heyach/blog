### 前言
***
用node+express搭建一个后端环境，除了可以学习一下后端开发的内容，还可以提供模拟数据辅助开发，这里将常见的todolist做一个改造，将原来用localStorage存储的数据存放到数据库，添加和编辑等功能也要与数据库交互。

### 初始化项目和安装相关的依赖
* node express 
* nodemon 用来重启node服务
* mysql2 数据库驱动
* sequelize sequeliz-cli sequelize-auto 数据持久化
* body-parser 处理请求参数

### 项目结构
```js
todolist{
    // 数据库相关文件
    db{
        config  // 连接数据库配置文件
        migrations // 生成脚本
        models // 表模型
        seeders
    }
    src{
        api // 接口
        middleware // 中间件
        app.js // 入口文件
    }
    // 静态文件
    static{
        images
        htmls
    }
    package.json
}
```

### 使用sequelize数据库处理
ORM让我们以对象的方式去处理curd，封装的sql处理
使用npm附带的package运行工具npx来进行sequelize-cli的初始化
npx sequelize-cli init
根据业务逻辑创建model，这里attributes后面的字段根据表字段进行配置
npx sequelize-cli model:generate --name User --attributes name:String,age:Integer
迁移数据库，根据model操作数据库
npx sequelize-cli db:migrate
在代码中使用model
```js
const models = require("../../db/models")
let todos = await models.todolist.findAll();
let todo = await models.todolist.create({}); 
let todo = await models.todolist.destroy({}); 
let todo = await models.todolist.update({});
```

### sequelize和mysql表字段对应值
```js
Sequelize.STRING                      // VARCHAR(255)                  类型：字符串 最大值： 65535个字符
Sequelize.STRING(1234)                // VARCHAR(1234)                 类型：变长 最大值： 65535个字符
Sequelize.TEXT                        // TEXT                          类型：字符串 最大值：65535个字符
Sequelize.TEXT('tiny')                // TINYTEXT                      类型：字符串 最大值：255个字符
Sequelize.INTEGER                     // INTEGER                       类型：整型 最大值：范围(-2147483648~2147483647)
Sequelize.BIGINT                      // BIGINT                        类型：整型 最大值：范围(+-9.22*10的18次方)
Sequelize.BIGINT(11)                  // BIGINT(11)                    类型：整型 最大值：范围(+-9.22*10的18次方)
Sequelize.FLOAT                       // FLOAT                         类型：单精度浮点型  8位精度(4字节)
Sequelize.FLOAT(11)                   // FLOAT(11)                     类型：单精度浮点型 8位精度(4字节)
Sequelize.FLOAT(11, 12)               // FLOAT(11,12)                  类型：精度浮点型 8位精度(4字节) m总个数，d小数位
Sequelize.DOUBLE                      // DOUBLE                        类型：双精度浮点型 16位精度(8字节)
Sequelize.DOUBLE(11)                  // DOUBLE(11)                    类型：双精度浮点型 16位精度(8字节)
Sequelize.DOUBLE(11, 12)              // DOUBLE(11,12)                 类型：双精度浮点型 16位精度(8字节) m总个数，d小数位
Sequelize.DECIMAL                     // DECIMAL                       类型：定点数型
Sequelize.DECIMAL(10, 2)              // DECIMAL(10,2)                 类型：定点数型 参数m<65 是总个数，d<30且 d<m 是小数位
Sequelize.DATE                        // DATETIME                      类型：日期时间类型 范例：'2009-05-12 02:31:44'
Sequelize.DATE(6)                     // DATETIME(6)    
Sequelize.DATEONLY                    // DATE without time.
Sequelize.BOOLEAN                     // TINYINT(1)                    类型：整型 范围(-128~127)
Sequelize.ENUM('value 1', 'value 2')  // ENUM                          类型：枚举
Sequelize.BLOB                        // BLOB                          类型：二进制数据
Sequelize.BLOB('tiny')                // TINYBLOB                      类型：二进制数据  
```

### 路由拆分
我们可以把所有的接口路由都写到app.js里，但是显然不能这么做，所以最好根据业务的不同来拆分接口路由，然后在app里批量引入
```js
const todoRouter = express.Router()
todoRouter.use(midware)
todoRouter.get("/add")
todoRouter.post("/add")
module.exports = todoRouter;
```

在app中通过命名空间引入拆分的路由（避免重名问题，重名会自动匹配第一个）
```js
app.use("/todo", todoRouter) //调用的时候/todo/add
```

### 中间件处理
所谓中间件，个人理解就是个过滤器，将收到的数据过滤处理一遍再交给下一个，当然这里中间件的权限稍微大点，如果中间件处理过程中发生了异常，是可以直接中断返回的。
而接口一般会有一些共有的处理过程，比如参数校验，跨域处理，异常处理，日志处理，另外一个某些有类似功能的业务也可能会有一些独特的校验逻辑，比如某些功能会要求校验用户登录态，因此需要在实际处理业务逻辑前，将请求的数据过一遍所指定的中间件，然后再进行业务逻辑处理。
比如这里创建一个日志中间件，啥也不干，只记录请求进来了
logger.js
```js
const util = require("../utils/util")
const fs = require("fs")
const ps = require("path")
```

// 日志中间件，记录所有的请求
```js
module.exports = (req, res, next) => {
  let { path, ip, query, method } = req;
  let time = new Date();
  let d = util.TimeFormat("yyyyMMdd")
  let p = `../../logs/${d}.log`;
  let content = `来自${ip}的请求${path}进来了，方法是${method}，参数是 ${JSON.stringify(query)}，时间是${time}; \n`
  try {
    fs.writeFile(ps.resolve(__dirname, p), content, { flag: "a" }, (err) => {
      next(err)
    });
  } catch (error) {
    next(error)
  }
}
```
然后在app里最先使用即可
app.use(logger)
这样每个请求进来会最先由logger处理再转交给具体的路由
每个中间件都有请求参数req，返回res，和转交函数next，只有最后的异常处理中间件有四个参数，且第一个参数为err，
中间件有引入顺序要求，一般来说404和error都是放在最后面，其余的中间件按照实际要求按顺序引入，也按需引入。

### todo相关api
按照需求，应该有以下功能
添加一个todo
```js
// 添加一个todo
todoRouter.post("/add", [paramsValidate], async (req, res) => {
  let { id, title, content, status } = req.body;
  let todo = await models.todolist.create({
    title,
    content,
    status: status || 0
  })
  res.json({
    code: 0,
    msg: "add success",
    todo
  })
})
```
删除一个todo
```js
// 删除一个todo
todoRouter.get("/delete/:id", [paramsValidate], async (req, res) => {
  let { id } = req.params;
  let todo = await models.todolist.destroy({
    where: {
      id
    }
  });
  res.json({
    code: 0,
    msg: "add success",
    todo
  })
})
```
编辑一个todo
```js
// 根据id修改一个todo
todoRouter.post("/update", [paramsValidate], async (req, res, next) => {
  let { id, title, content, status } = req.body;
  // 先根据id查找，找到才更新
  try {
    let todo = await models.todolist.findOne({
      where: {
        id
      }
    })
    if(todo){
      todo = todo.update({
        title,
        content,
        status
      })
      res.json({
        code: 0,
        msg: "update success",
        todo
      })
    }else{
      res.json({
        code: -1,
        msg: "not found",
      })
    }
  } catch (error) {
    next(error)
  }
})
```
查看所有的todos
```js
// 获取todo列表
todoRouter.get("/list", [paramsValidate], async (req, res) => {
  let todos = await models.todolist.findAll();
  res.json({
    code: 0,
    msg: "list success",
    data: todos
  })
})
```
这样就将原来用localStorage存储的数据改成数据库处理了。然后在app里引入todoRouter即可
```js
app.use("/todo", todoRouter);
```
在应用中通过 /todo/add 路由访问接口。
