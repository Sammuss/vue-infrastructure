# 安装依赖

`npm install vue-i18n`

# 引入

```
import i18n from './lib/i18n'

app.use(i18n)
```

# 使用

全局变量直接写在 /src/lib/i18n 里，命名规则为 lang-_.js 或者 lang-_/index.js

本地变量写在页面同目录下 lang.js

- 1、修改网站html元素的语言即可改变语种（这种方式会导致文字样式变化）

```
document.querySelector('html').lang = lang
```

- 2、获取全局变量

```
import { inject } from 'vue'
const $i18n = inject('$i18n')
$i18n.locale = lang
```

# 页面

```
函数翻译：{{ $t('message.hello') }}
指令翻译：<p v-t="'message.hello'"></p>
```
