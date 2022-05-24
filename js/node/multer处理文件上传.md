### multer处理文件上传
***

### multer处理request
multer会添加一个body对象以及files对象到express的request里
body包含form的文本域，files包含form上传的文件信息
```js
file = {
    fieldname: "dog",
    originalname: "dog.png",
    encoding: "7bit",
    mimetype: "text/plain"
}
```

### 通过multer实例化构造一个中间件给需要multer处理的接口
```js
var u = multer({ dest: "upload/" })
app.get("/demo", u, (req, res) => {
    console.log(req.file)
})
```

multer只会处理form的enctype="multipart/form-data"里的文件
在处理文件上传时需要指定form的enctype
如果不想用form提交，可以用js实例化form对象提交
```js
var form = new FormData();
form.append("file", file);
form.enctype = "multipart/form-data"
```

### 设置自定义存储过程
通过multer的diskStorage来自定义存储路径和文件名
multer.diskStorage接受destination和filename两个函数
用来自定义路径和文件名
```js
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // uploadFolder为存储的路径，需要自己创建文件夹
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var u = multer({storage: storage })
```
通过multer的single，array，none，any等方法来自定义处理上传的文件

### 通过filter过滤文件格式
```js
const upload = multer({
    fileFilter: (req, file, cb) => {
        // 如果file的扩展名不符合要求
        // 通过cb(new Error过滤)
        // 或者直接cb(null, false)
        // 符合要求的进行cb(null, true)
        // cb(new Error('扩展名不正确'));
        // cb(null, true);
    },
    storage: storage
})
```

### vue + wangEditor + node + multer
```js
import E from "wangediter"
this.editer = new E("#editer")
this.editer.config.uploadImageServer = "http://127.0.0.1:5000/upload/uploadImage"
this.editer.config.customAlert = (s, t) => {
    console.log(s, t)
}
this.editer.create()
console.log(this.editer.txt.html())
```
```js
const express = require("express")
const multer = require("multer")
const util = require("../utils/util")
const path = require("path")
const allowAccess = require("../middleware/allowAccess")

const uploadRouter = express.Router()

const uploadFolder = (n) => {
  return path.resolve(__dirname, `../../static/upload/${n}`)
}
// 根据不同的业务需求，处理不同的storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let extName = file.originalname.split(".")[1];
    await util.createFolder(uploadFolder(extName));
    cb(null, uploadFolder(extName));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  fileFilter: (req, file, cb) => {
    // 如果file的扩展名不符合要求
    // 通过cb(new Error过滤)
    // 或者直接cb(null, false)
    // 符合要求的进行cb(null, true)
    // cb(new Error('扩展名不正确'));
    cb(null, true);
  },
  storage: storage
})

uploadRouter.post("/uploadImage", allowAccess, upload.any(), (req, res) => {
  let files = req.files;
  let p = []
  files.forEach(item => {
    let { destination, filename } = item;
    let ps = `http://127.0.0.1:5000${destination.slice(destination.indexOf("static") + 6)}\\${filename}`;
    ps = ps.split("\\").join("/")
    p.push(ps)
  })
  res.json({
    "errno": 0,
    "data": p
  })
})

module.exports = uploadRouter;
```