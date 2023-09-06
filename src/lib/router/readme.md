# 安装依赖
`npm install vue-router`


# 引入
```
import router from './lib/router'

app.use(router)
```


# 使用
页面写在 /src/views/ 里

页面信息写在同级目录 .page

主要属性包含 title requiresAuth name path components

components示例
`components=default=fullPage;component1=layout1`