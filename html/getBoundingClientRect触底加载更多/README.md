### getBoundingClientRect触底加载更多
***

### getBoundingClientRect
返回元素的大小，及相对`视窗`的位置，并不是相对父元素的位置
那么可以通过设置一个底部loading元素，当出现在视窗的时候，说明触底了，可以进行加载，加载完成后，列表加入了新的内容，底部loading元素又不可见了
