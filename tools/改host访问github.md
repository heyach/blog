### 访问github
***

### 确定github的ip
https://ipaddress.com/website/github.com

![](https://raw.githubusercontent.com/heyach/blog/main/images/ipaddressgithub.jpg)

### 确定域名ip
https://fastly.net.ipaddress.com/github.global.ssl.fastly.net

![](https://raw.githubusercontent.com/heyach/blog/main/images/ipaddressfastly.jpg)

### 查看静态资源ip
https://ipaddress.com/website/assets-cdn.github.com

![](https://raw.githubusercontent.com/heyach/blog/main/images/ipaddressstatic.jpg)

### 修改host
经常会变的就是这四个，需要查一下
```py
140.82.114.4 http://github.com
140.82.114.10 http://nodeload.github.com
140.82.114.6 http://api.github.com
140.82.114.10 http://codeload.github.com
```

```py
# Github Hosts
# domain: github.com
140.82.112.3 github.com
140.82.114.9 nodeload.github.com
140.82.112.5 api.github.com
140.82.112.10 codeload.github.com

185.199.108.133 raw.github.com
185.199.108.153 training.github.com
185.199.108.153 assets-cdn.github.com
185.199.108.153 documentcloud.github.com
140.82.114.17 help.github.com

# domain: githubstatus.com
185.199.108.153 githubstatus.com

# domain: fastly.net
199.232.69.194 github.global.ssl.fastly.net

# domain: githubusercontent.com
185.199.108.133 raw.githubusercontent.com
185.199.108.154 pkg-containers.githubusercontent.com
185.199.108.133 cloud.githubusercontent.com
185.199.108.133 gist.githubusercontent.com
185.199.108.133 marketplace-screenshots.githubusercontent.com
185.199.108.133 repository-images.githubusercontent.com
185.199.108.133 user-images.githubusercontent.com
185.199.108.133 desktop.githubusercontent.com
185.199.108.133 avatars.githubusercontent.com
185.199.108.133 avatars0.githubusercontent.com
185.199.108.133 avatars1.githubusercontent.com
185.199.108.133 avatars2.githubusercontent.com
185.199.108.133 avatars3.githubusercontent.com
185.199.108.133 avatars4.githubusercontent.com
185.199.108.133 avatars5.githubusercontent.com
185.199.108.133 avatars6.githubusercontent.com
185.199.108.133 avatars7.githubusercontent.com
185.199.108.133 avatars8.githubusercontent.com
# End of the section
```

### 刷新dns
win + r -> cmd -> ipconfig/flushdns