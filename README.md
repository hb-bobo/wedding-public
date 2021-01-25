
# 婚礼邀请函


``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```


> 体验二维码
婚礼小程序：

![小程序效果](./qr.jpg)


> 开发参考 [掘金文章](https://juejin.im/post/5c341e1d6fb9a049f66c4876#heading-5)
> 可加原作者微信(huangbin910419）备注（‘掘金’或者‘码云’）进群讨论

> 也有[taro版](https://github.com/wuhou123/taro-card), 由于时间缘故就不反复折腾，有时间可以用taro写，毕竟mpvue不维护了 

## 开发前须知

- 审核：
  由于这类小程序特别多且小程序是不支持个人内容，除了第一批开发者可以轻松上线，后面的人很难通过。可以通过云数据库动态调整渲染逻辑。
  我的方案是将首屏做成工具，任何人都可以做邀请函，审核时开起这个功能，审核通过后关闭。文件参考[Introduce.vue](src/components/Introduce.vue)


审核版效果

![tool](./tool.gif)


- 云开发：
  需要提前创建一个云数据库并建好字段，字段参考database目录

![云数据库](./database.png)



## 注意点

1. 云数据库 需要开启权限

![云数据库](./database-auth.png)

2. 云函数 每一个函数需要在开发者工具单独部署

3. 云数据库 config表我是通过aa字段控制的(0 和 1)，isMock无效，因为担心审核人员mock我的数据，我用来迷惑他
