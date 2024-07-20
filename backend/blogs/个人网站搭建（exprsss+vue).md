项目技术栈如下：

前端：Vue + Vuetify 

后端：Node.js + express + pm2

首先在本地搭建前后端环境，项目正常运行后，在远程服务器上搭建express项目，将本地后端的资源上传到远程服务器，将本地前端项目打包后的dist文件目录放在服务端根目录下，通过pm2管理项目，并引入腾讯云的前端性能监控工具监控项目。

项目地址：https://github.com/Almitor/personal-website

## 前端

### 构建Vite项目

默认本地已经安装和配置好Node.js后，创建文件夹vue-project，在目录下执行以下操作

```bash
npm create vue@latest
cd vue-project
npm install
```

此时前端已经构建了一个基于Vite的Vue项目

在src目录下创建router和components目录，components用于存放.vue源文件，router用于配置路由信息

![image-20240702165640400](./assets/image-20240702165640400.png)



## 后端

### 构建express项目

在vue-project目录下创建backend文件夹，在该目录下构建express项目，为使模拟上线后的情况，因此本地应当使用和上线后相同的环境

进入backend目录，初始化项目

```bash
npm init -y
```

这会创建一个 `package.json` 文件，记录项目的依赖和配置信息。

安装express相关依赖

```bash
npm install express
```

创建server.js文件用于启动服务器，服务器监听本地3000端口，初始访问目录下dist目录下的index.html

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
```

其中dist目录是前端打包后的目录，在vite.config.ts中可配置打包后dist的路径，为了更好模拟线上环境，这里把打包后的dist目录也放在后端根目录下。

```javascript
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    outDir: "./backend/dist"
  },
})
```

### 项目运行

启动后端服务

```bash
node server.js
```

浏览器访问`http://localhost:3000/`即可显示页面

![image-20240702154148970](./assets/image-20240702154148970.png)

但访问的页面都是dist下的静态资源，每次修改了源文件都要将前端项目打包成dist再运行很麻烦，因此，为了能够实时观察页面展示效果，可以运行前端项目

```bash
npm run dev
```

浏览器访问`http://localhost:5173/`，但如果要请求后端资源，如下图，assets为md文件图片，notes和blogs为相关md文件，如果只启动前端项目无法访问到后端的这些资源，只能展示前端的静态资源

![image-20240702154050291](./assets/image-20240702154050291.png)

因此，前端要访问后端md文件资源会产生跨域，因为端口不同，需要在vite.config.ts中对访问的资源设置代理

```bash
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    outDir: "./backend/dist"
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/assets": "http://localhost:3000",
    }
  },
})
```

这样在编译器中开启两个终端，分别启动express和vite，在浏览器访问`http://localhost:5173/`就可以实时显示修改后页面，并且能够访问到后端资源文件（server.js需要添加对相关资源的响应代码）。

当本地项目测试完成后，可以打包前端项目到dist文件夹中，只启动express并在浏览器访问`http://localhost:3000/`，此时就是模拟线上的环境，若没有问题就可以将dist目录上传到服务器从而更新线上项目了。



## 部署上线

### 构建express项目

购买服务器和域名后，通过xshell连接服务器，创建一个express项目vue-project，执行同上操作

```bash
npm init -y
npm install express
```

通过git将本地文件上传到服务器上，如dist文件夹，assets文件夹，md文件等

文件结构和本地后端环境相同，本地文件上传完成后，更新项目的依赖

```bash
npm install
```

服务端进入vue-project目录通过pm2启动epress，使得项目能够一直运行在服务器中，可以随时访问网页

```bash
pm2 start server.js --name vue-project
```

启动服务后在浏览器输入对应网址即可访问个人网站  `http://almytor.cn/`





## git管理项目

为了能够方便更新项目，需要通过git将本地文件上传到服务端

### 本地环境

在项目根目录下初始化git仓库，并添加远程服务器仓库

```sh
git init
```

### 服务端

初始化git仓库

```sh
git init
```

具体流程可在git基本操作中查看，待补充

