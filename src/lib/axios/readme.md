# 安装依赖
`npm install axios qs`


# 引入
```
import axios from './lib/axios'

app.use(axios)
```

# 使用
```
import { inject } from 'vue'
const $http = inject('$http')
$http('{method}_{path}', params, config)
```