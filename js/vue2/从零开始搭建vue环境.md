### 前言
***
像vue和react这类的框架本身就提供了很好用的cli，用起来那也是真的香，但是作为学习还是有必要自己配置一遍常用的开发配置，即使不用vue和react，像一些scss/less/图片压缩/代码打包/es6处理/热更新/第三方ui框架等等功能，项目中一般也是要用到的。

webpack的loader和plugin也都是即插即拔的，所以我们可以根据实际项目需要，将常用的开发配置一点点的加进去。

### 环境和可能配置的功能
理论上来讲还是一个一个功能安装和配置，等确定没问题了再进行下一个。
* node npm
* webpack webpack-cli
* vue-loader vue-template-compiler vue-router vuex cache-loader thread-loader
* html-webpack-plugin clean-webpack-plugin
* sass-loader less-loader style-loader dart-sass css-loader  postcss-loader autoprifixer
* babel-loader core-js babel/polyfill
* devServer
* 等等

### 项目结构
```js
config{
    webpack.config.js
    webpack.dev.js
    webpack.prod.js
}
src{ //功能代码
    assets //静态资源文件
    components //组件
    pages //页面
    router //路由
    store //状态管理
    utils //工具类
    App.vue
    main.js //vue入口
}
```

### 根据webpack的规则配置loader
```js
const path = require('path')
const  VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "../src/main.js")
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "js/[name].[hash:8].js",
        chunkFilename: "js/[name].[hash:8].js",
        publicPath: "./"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: "cacha-loader"
                },{
                    loader: "thread-loader"
                },{
                    loader: "vue-loader",
                    options: {
                        compilerOptions: {
                            preserveWhitespace: false
                        }
                    }
                }]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}
```

### 配置模板文件html自动引入打包文件和清除旧文件
这样每次打包后，html会自动引入打包后的最新文件
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
plugins: [
    new CleanWebpackPlugin({
        exclude: ["index.html"] 
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../index.html"),
        filename: 'index.html'
    })
]
```

### 配置css处理
这里直接scss/less/image/video等等都配全，需要注意的是css的相关loader是有先后配置顺序的
```js
rules: [
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({ fallback: 'vue-style-loader', use: 'css-loader!postcss-loader' })
    },
    {
      test: /\.less/,
      loader: ExtractTextPlugin.extract({
        fallback: 'vue-style-loader',
        use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      })
    }, 
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[ext]'
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[ext]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[ext]'
      }
    }
    ]
}
```

### 配置ES6的处理
在项目根目录创建babel.config.js，自行根据对es6的支持程度设置stage
```js
{
  "presets": [
    ["env", {
      "modules": false
    }],
    "stage-2"
  ],
  "plugins": ["transform-runtime"]
}
```

### 配置热更新和代理
这里直接使用的是webpack内置的webpack-dev-server，根据规则在devServer中配置
```js
devServer: {
    host: 'localhost', //可选，
    inline: true, 
    contentBase: path.resolve(__dirname,'../dist'), //可选，基本目录结构 
    compress: true //可选，压缩, 
    port: 8080,
    proxy: {
      '/': {
        target: 'http://127.0.0.1:5000',
        changOrigin: true,
        // pathRewrite: { '^/api': '' }
      }
    }
}
```

### 配置vue别名
这样在处理路径的时候就可以直接从根目录开始了，而不是疯狂的上级目录
```js
resolve: {
    alias: { 
        vue$: 'vue/dist/vue.runtime.esm.js', 
        '@': path.join(__dirname, './src/'), 
    }, 
    extensions: [ 
        '.js', 
        '.vue' 
    ] 
}
```

### 引入第三方ui框架，这里引入element-ui
在main里引入，如果要实现按需引入，只需要按照官方文档配置即可
```js
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; 
Vue.use(Element, { size: 'small', zIndex: 3000 }); //所有的组件size属性默认为small，弹出层z-index默认为3000
```
在页面上使用
```html
<el-button type="primary" @click="add">add3</el-button>
```
```js
import { Button } from "element-ui";
components: {
    "el-button": Button, 
}
```

### router和guard的处理
```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Error404 from './pages/Error404'

Vue.use(Router)

let router = new Router({
  // mode: 'histpry',此模式需要后台配合让模板始终返回index
  mode: 'hash',
  // base: '/hhh/',
  routes: [
    // 默认首页
    { path: '/', redirect: '/home' }, 
    // 首页-嵌套路由
    {
      path: '/home', component: Home,
    },
    { path: '/404', component: Error404, meta: { title: '404' } },
    { path: '*', redirect: '/404' }, // 未匹配到的路由地址
  ]
})

export default router
```

```js
import router from "./index"

router.beforeEach((to, from, next) => {
  let store = router.app.$options.store;
  // 根据store to from的状态进行处理，最后用next释放跳转
  if(store && to && from){
    ...
  }else{
    next()
  }
})

export default router
```

### vuex和store处理
```js
import Vue from 'vue'
import Vuex from 'vuex'
import Home from './modules/home'
Vue.use(Vuex)
export default new Vuex.Store({
  //用module引入后，各模块的state就挂载在相应模块对象下
  //this.$store.state.Home.count
  modules: {
    Home
  }
})
```

```js
const Home = {
  namespaced: true,
  state: {
    totalCount: 0,
  },
  mutations: {
    addCount: (state) => {
      state.totalCount += 1;
    }
  },
  getters: {
    getTenCount(state) {
      return state.totalCount * 10;
    }
  },
  actions: {
    addCount: ({ commit }) => {
      return commit('addCount')
    },
  }
};

export default Home
```

### 配置axios
在main里引入，在vue原型上挂载
```js
import axios from 'axios'
Vue.prototype.$axios = axios
```

配置请求拦截器，可以预处理一些业务逻辑，过滤数据等
```js
import axios from 'axios'
axios.interceptors.request.use(config => { 
    // 对请求数据config进行过滤处理
    return config 
}, err => { 
    console.log(err) 
}) 
axios.interceptors.response.use((response) => { 
    // 对返回数据response进行过滤处理
    return response; 
}, err => { 
    return Promise.reject(err); 
}); 
export default axios
```