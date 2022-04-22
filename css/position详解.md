### position属性详解和差异
***

### 属性
静态定位（默认） static
绝对定位 absolute
相对定位 relative
固定定位 fixed
粘性定位 sticky

### 差异
主要体现在定位的基准值和对文档其他元素的影响

### 静态定位
所有属性在默认的情况下都是static定位方式，是一种默认的页面文档流，z-index在此方式下无效
只能通过margin方式来设置元素偏移，top类型的定位方式无效

### 相对定位
每个元素在文档流中都会占用一个位置，相对定位就是就是将元素偏离元素的默认位置，但是并没有脱离默认的文档流，只是视觉上的偏移体现
relative的特点
1. 仍在文档流之中，并按照顺序进行排列
2. 参照物为元素本身的位置

### 绝对定位
绝对定位的元素会通过**最近的非static的祖先元素**的偏移来确定位置，如果祖先都没有设置非static的属性，则以html元素为基准值来偏移
absolute的特点
1. 默认宽度为父元素内容宽度
2. 脱离文档流
3. 参照物为最近一个非static的祖先
```html
<div class="father">
    <div class="son"></div>
</div>
<div classs="brother"></div>
```
如果father元素设置了absolute/relative/fixed此类属性，那么son的位置是以father的左顶点位置为起始偏移点
如果father没有设置position属性，而brother设置了absolute，则brother的偏移位置是以father开始的

### 固定定位
常用于创建在滚动屏幕仍固定位置的元素
1. 会改变行内元素的呈现模式，使其成为块元素
2. 使元素脱离文档流，不占据文档流空间
3. 参照物基准点是浏览器窗口

![](https://raw.githubusercontent.com/heyach/blog/main/images/position1.png)

### 粘性定位
基于用户的滚动位置来定位
粘性定位的元素是依赖于用户的滚动，在 position:relative 与 position:fixed 定位之间切换
它的行为就像 position:relative; 而当页面滚动超出目标区域时，它的表现就像 position:fixed;，它会固定在目标位置
元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位