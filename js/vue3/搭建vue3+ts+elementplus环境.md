### 搭建vue3+ts+elementplus环境
***

### 环境安装
```js
npm i -g npm
npm -v  // 6.11.3
node -v // v10.17.0
vue --version // @vue/cli 4.5.3
```

### 创建项目
通过vue create创建项目
```js
vue create vue-element-plus
```
需要注意的是，如果是用的git bash命令行，没有办法选择配置项，需要通过winpty方式创建
```js
winpty vue.cmd create projectName
```
安装的时候我们选择最基础的版本，然后逐渐添加配置，这里less的版本需要指定为3.9.0，不然会出现less配置错误
```js
winpty vue.cmd add typescript
winpty vue.cmd add vuex
winpty vue.cmd add router
npm i vue3-lazy -D
npm i stylus stylus-loader -D
npm i less@3.9.0 -D
npm i less-loader@5.0.0 -D
```
在项目根目录新建vue.config.js，进行自定义打包配置，这里我们只改一下项目启动的端口号，省的冲突
```js
module.exports = {     
    devServer: {         
        port: 8887, 
    }
}
```
然后直接启动项目就可以了
```js
npm run serve
```