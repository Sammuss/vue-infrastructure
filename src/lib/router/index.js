import qs from 'qs'
import { createRouter, createWebHashHistory } from 'vue-router'

import { _type } from '@/utils/index'

import { useUserStore } from '../pinia/user'

// 匹配页面规则
// 指定页面：index、detail
// 参数页面: :参数名
// 通用页面: error下面的所有页面
const paths = import.meta.glob(['/src/views/**/(index|detail).vue', '/src/views/**/:*.vue', '/src/views/error/*.vue'])

const configs = import.meta.glob('/src/views/**/.page', {
  eager: true,
  as: 'raw'
})

const layouts = new Map(
  Object.entries(import.meta.glob(['/src/layout/**/*.vue'])).map(([path, component]) => {
    return [path.replace(/(\/src\/layout\/|\.vue)/gi, ''), component]
  })
)

const configFormat = (config) => {
  const result = {}
  if (config) {
    config
      .split('\n')
      .filter(Boolean)
      .map((raw) => {
        if (!raw.includes('=')) return
        if (raw.match(/=/gi).length < 2) {
          const [key, value] = raw.split('=').map((item) => item.trim())
          return (result[key] = String(value))
        }
        const key = raw.split('=', 1)
        result[key] = qs.parse(raw.replace(`${key}=`, ''), {
          delimiter: ';',
          decoder: (s) => s.replace(/\r$/, '')
        })
      })
  }
  return result
}

const supplementPaths = () => {
  Object.keys(configs).forEach((configPath) => {
    const indexPath = configPath.replace('.page', 'index.vue')
    if (!Object.keys(paths).includes(indexPath)) {
      const { components } = configFormat(configs[configPath])
      if (components && components.default) {
        paths[indexPath] = layouts.get(components.default)
      } else {
        paths[indexPath] = layouts.values().next().value
      }
    }
  })
}

function routerFilter(routers, exceptionalPages) {
  routers.forEach((router, index) => {
    for (let i = 0; i < exceptionalPages.length; i++) {
      const path = exceptionalPages[i].includes('/') ? router?.meta?.fullPath : router?.path
      if (path === exceptionalPages[i]) {
        routers.splice(index, 1)
        break
      }
    }
    if (_type(router.children) === 'array') {
      routerFilter(router.children, exceptionalPages)
    }
  })
}

// .page 为页面配置信息
// 目前主要是 components 组件 components=type1=component1;type2=component2
// 其余为 meta 路由元信息
// meta 包含
//    title 页面标题 默认为系统名称
//    requiresAuth 是否需要登录 默认需要
//    path 默认目录路径
//    name 默认目录路径，以-分层
const getMatchRoutes = () => {
  const matchRoutes = []
  function findFatherNode(array, cnode) {
    array.forEach((fnode) => {
      if (cnode.meta.dirpath.indexOf(fnode.meta.dirpath) === 0) {
        if (fnode.meta.dirpath.match(/\//gi).length === cnode.meta.dirpath.match(/\//gi).length - 1) {
          if (!Array.isArray(fnode.children)) {
            fnode.children = []
          }
          if (fnode.meta.path && !cnode.meta.path) {
            cnode.meta.fullPath = cnode.meta.fullPath.replace(fnode.meta.dirpath, fnode.meta.fullPath)
            cnode.path = cnode.meta.fullPath.replace(`${fnode.meta.fullPath}/`, '')
            cnode.meta.path = fnode.meta.fullPath + '/' + cnode.path
          } else {
            cnode.path = cnode.meta.path || cnode.path.replace(`${fnode.meta.fullPath}/`, '')
          }
          fnode.children.push(cnode)
        } else findFatherNode(fnode.children, cnode)
      }
    })
  }
  Object.entries(paths)
    .sort((a, b) => a[0].length - b[0].length)
    .forEach(([pagePath, component]) => {
      const configPath = pagePath.replace(/(\w|-|_|:)+.vue/, '.page')
      const config = configFormat(configs[configPath])
      const { components = '', ...meta } = config
      const dirpath =
        '/' +
        pagePath
          .replace('/src/views/', '')
          .replace('.vue', '')
          .replace(/\/index$/, '')
      let path = meta.path || dirpath
      if (path.indexOf('/')) {
        path = `/${path}`
      }
      const name = meta.name || path.replace(/^\//, '').replace('/', '-').replace(':', '')
      meta.fullPath = path
      meta.dirpath = dirpath
      if (path.indexOf('/error/') === 0 && !(meta.requiresAuth in meta)) {
        meta.requiresAuth = 'false'
      }
      const router = {
        path,
        name: name || 'index',
        meta
      }
      if (typeof components === 'object') {
        router.components = { default: component }
        router.children = []
        for (let key in components) {
          router.components[key] = layouts.get(components[key])
        }
      } else {
        router.component = component
      }

      router.path.match(/\//gi).length > 1 && router.path.indexOf('error') === -1
        ? findFatherNode(matchRoutes, router)
        : matchRoutes.push(router)
    })
  return matchRoutes
}

// 补全页面
supplementPaths()
// 手动配置路由
const routes = []
// 不做自动匹配的目录
const exceptionalPage = []

// 自动匹配路由
const autoMatchRouters = getMatchRoutes()
routerFilter(autoMatchRouters, exceptionalPage)

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...autoMatchRouters, ...routes]
})

// 未登录时主页与登陆后主页
const homePages = ['login', 'p2-p']

export default {
  ...router,
  install: (app, ...options) => {
    router.beforeEach((to) => {
      const { meta } = to
      const pageJump = () => {
        const needAuth = meta.requiresAuth !== 'false' ? true : false
        const userStore = useUserStore()

        if (to.name === homePages[0] && userStore.isLogin) return { name: homePages[1] }
        // 无需身份验证
        if (!needAuth || !noAuthorizationRequired.every((reg) => !reg.test(to.path))) return true
        if (!userStore.isLogin) return { name: homePages[0] }
        if (to.path === '/') return { name: homePages[1] }

        return true
      }
      const noAuthorizationRequired = [/^\/login$/, /^\/error-([0-9]{1,})/]
      document.title = meta.title || app.config.globalProperties.$t('project.name')

      // 404 错误
      if (to.matched.length === 0) {
        if (to.path === '/' && homePages.length !== 0) return pageJump()
        return { name: 'error-404' }
      }

      return pageJump()
    })

    router.install(app, ...options)
  }
}
