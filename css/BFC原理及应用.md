### BFC
***
BFC（block formatting context）块级格式化上下文
简单来说是一种让浏览器知道的渲染策略，是一个独立的渲染区域，有一些成立BFC的条件和独特的渲染规则。

### BFC的布局规则
1. 内部的Box会在垂直方向一个接一个的放置
2. Box垂直方向的距离由margin决定，同属于一个BFC的2个相邻的Box的margin会重叠
3. 每个盒子的左边，与包含块的左边相接触，即使存在浮动也是如此，除非产生了新的BFC
4. BFC的区域不会与浮动元素重叠
5. BFC是独立容器，内部元素不会影响外部元素的布局
6. BFC的高度会包含浮动元素的高度

### 创建BFC的规则
1. float的值不是none
2. position的值不是static活relative
3. display的值是inline-block，table-cell，flex，table-caption，inline-flex
4. overflow的值不是visible

### BFC应用
可以利用BFC的布局规则完成页面的布局设计
1. 列表等间距（利用布局规则2）
假设有一个列表，想让每个item上下间隔10px，第一个item距离顶部10px，最后一个item距离底部10px
```css
.item{
    margin: 10px 0;
}
```
如果没有BFC布局规则2，那么中间item的间距就会是20px了
如果将item的样式改成
```css
.item{
    margin-top: 10px;
}
```
那么需要对最后一个item处理对底部的间距
同理
```css
.item{
    margin-bottom: 10px;
}
```
需要处理第一个item对顶部的间距问题

2. 自适应两栏布局（利用布局规则4）
```html
<div class="a">
    <div class="b"></div>
    <div class="c"></div>
</div>
```
```css
.a{
    background: red;
}
.b{
    float: left;
}
.c{
    height: 100%;
    background: yellow;
}
```

![](https://raw.githubusercontent.com/heyach/blog/main/images/bfc2.png)

可以看到，浮动元素b是挤占了元素c的位置的，如果c里的内容足够多，会排列到b的下方
这个时候利用BFC的布局规则4，将c创建为BFC
```css
.c{
    overflow: hidden;
}
```
![](https://raw.githubusercontent.com/heyach/blog/main/images/bfc1.png)

这样一个自适应两栏布局就完成了

3. 清除浮动（利用布局规则6）
准确的说是处理由于浮动元素引起的容器高度塌陷问题
浮动元素由于脱离了普通文档流，一般容器高度计算不会包含浮动元素，如果一个容器里都是浮动元素，又没有清除浮动，
表现为就是容器高度为0，这里不讨论其他的清除浮动方式，可以直接将父容器创建为BFC，这样因为BFC布局规则6，
就会计算所包含的浮动元素高度了