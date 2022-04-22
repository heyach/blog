### 自定义代码片段
***
一些通用的初始代码（如vue的初始结构），或者常用的代码片段（比如for，switch），可以通过设置预定义命令快速输入

### 操作步骤
菜单 -> 文件 -> 首选项 -> 用户片段 -> 输入片段名称（全局） -> 在body字段里拼接要生成的代码片段 -> 在编辑器任意输入的地方输入prefix里的命令即可
```json
{
    "vue template": {
        "prefix": "newvue", //唤醒代码块的命令
        "body": [
            "<template>",
            "    <div class='hello'></div>",
            "</template>",
            "<script lang='ts'>",
            "export default {",
            "    props: {},",
            "    setup(props: any, context: any) {},",
            "};",
            "</script>",
            "<style lang='less' scoped></style>",
        ], //代码块的主体
        "description": "httpCall template" //代码块的介绍
    }
}
```