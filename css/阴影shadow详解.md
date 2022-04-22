### 阴影shadow
***

### box-shadow
box-shadow是将一个或多个下拉阴影添加到框上，是一个列表，可以添加多个阴影
* box-shadow h-shdow v-shadow blur spread color inset;
* h-shadow 必须 水平阴影
* v-shadow 必须 垂直阴影
* blur 可选 模糊距离
* color 可选 阴影颜色，可用rgba来设定透明度
* inset 可选 一般缺省值为0，从外层阴影改变阴影内测阴影（啥鸡儿玩意，听都听不懂）

```css
box-shadow: 0 0 0 #fff;
```
阴影默认生成一个和元素大小相同的框
通过设定参数来指定阴影偏移量和大小，当偏移量和模糊距离都是0的时候，实际阴影被元素完全遮住

![](https://raw.githubusercontent.com/heyach/blog/main/images/shadow1.png)

![](https://raw.githubusercontent.com/heyach/blog/main/images/shadow2.png)

![](https://raw.githubusercontent.com/heyach/blog/main/images/shadow3.png)

![](https://raw.githubusercontent.com/heyach/blog/main/images/shadow4.png)

![](https://raw.githubusercontent.com/heyach/blog/main/images/shadow5.png)