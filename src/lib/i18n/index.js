// https://vue-i18n.intlify.dev/
import _get from 'lodash.get'
import { createI18n } from 'vue-i18n'

import { emitter, EVENT_I18N_LOADED, EVENT_LOCALE_CHANGE } from '@/lib/mitt'
import { _type } from '@/utils'

const messages = {}
// 引入同级目录下 设置全局变量 lang-*.js | lang-*/index.js
Object.entries(import.meta.glob(['./lang-*.js', './lang-*/index.js'], { eager: true, import: 'default' })).forEach(
  ([fileName, component]) => {
    const lang = fileName.replace(/(\.\/lang-|\/index|\.js)/gi, '')
    messages[lang] = component
  }
)

// 引入各页面下的本地配置
Object.entries(import.meta.glob(['/src/views/**/lang.js'], { eager: true, import: 'default' })).forEach(
  ([fileName, component]) => {
    const dirpath = fileName.replace(/(\/src\/views|\/lang\.js)/gi, '')
    Object.keys(component).forEach((lang) => {
      if (messages[lang]) {
        messages[lang][dirpath] = component[lang]
      }
    })
  }
)

// 引入各语言的elment UI配置
Object.entries(
  import.meta.glob(
    ['/node_modules/element-plus/dist/locale/*.mjs', '!/node_modules/element-plus/dist/locale/*.min.mjs'],
    { eager: true, import: 'default' }
  )
).forEach(([fileName, component]) => {
  const lang = fileName
    .match(/[a-z]{1,}(-[a-z]+?)?\.mjs$/g)
    .toString()
    .replace('.mjs', '')
  if (Object.keys(messages).includes(lang)) {
    messages[lang] = Object.assign({}, component, messages[lang])
  }
})

const i18n = createI18n({
  legacy: false,
  locale: document.querySelector('html').lang in messages ? document.querySelector('html').lang : 'zh-cn',
  fallbackLocale: 'zh-cn',
  messages: messages
})

// 监听页面语言变化
const setLangObserver = ($i18n) => {
  const targetNode = document.querySelector('html')
  const config = { attributes: true }
  const callback = (mutationsList) => {
    if (mutationsList.length === 0) return
    if (mutationsList[0].attributeName !== 'lang') return
    if (!mutationsList[0].target.lang) return
    $i18n.locale = mutationsList[0].target.lang
  }

  const observer = new MutationObserver(callback)
  observer.observe(targetNode, config)

  // observer.disconnect()
}

export let i18nProxy = null
export let _i18n = null
export let _t = null
export let getMessages = null
export const setPageLang = (lang) => (document.querySelector('html').lang = lang)
export const setLocale = (lang) => (i18nProxy.locale = lang)

export default {
  install: (app, ...options) => {
    i18n.install(app, ...options)
    const { $i18n, $t } = app.config.globalProperties
    const vTDirective = app.directive('t')
    i18nProxy = new Proxy($i18n, {
      set: function (obj, prop, value) {
        if (prop === 'locale') {
          const { $route } = app.config.globalProperties
          emitter.emit(EVENT_LOCALE_CHANGE)
          document.title = $route?.meta?.title || getTitle(value)
        }
        return Reflect.set(...arguments)
      }
    })

    getMessages = (msg, ...args) => _get(messages, `${getLocale(...args)}.${formatMsg({}, msg, ...args)}`)
    const getTitle = (locale) => getMessages('project.name', locale)
    const getDirpath = (app) => app?.config?.globalProperties?.$route?.meta?.dirpath
    const canIuseLocal = (app, locale) =>
      Boolean(getDirpath(app) && messages[locale || $i18n.locale] && messages[locale || $i18n.locale][getDirpath(app)])
    const isLocale = (str) => $i18n.availableLocales.includes(str)
    const getLocale = (locale = '') => (isLocale(locale) ? locale : $i18n.locale)
    const formatMsg = (app, msg, ...args) => {
      const locale = getLocale(args.length > 0 && _type(args[0]) === 'string' ? args[0] : '')
      const canUseLocalVariable = canIuseLocal(app, locale)
      if (!canUseLocalVariable) return msg
      const dirpath = getDirpath(app)
      let node = messages[locale && isLocale(locale) ? locale : $i18n.locale][dirpath]
      msg.split('.').forEach((key) => {
        if (_type(node) !== 'object') return (node = undefined)
        if (key in node) node = node[key]
        else return (node = undefined)
      })
      return node === undefined ? msg : `${dirpath}.${msg}`
    }
    const updateBindingValue = (app, binding) => {
      if (_type(binding.value) === 'string') {
        binding.value = { path: binding.value }
      }
      binding.value.path = formatMsg(app, binding.value.path, binding.value.locale)
    }
    _t = (msg, ...args) =>
      $t(formatMsg(app, msg, ...args), ...args).replace(/@:{1}([A-Za-z]|\.|_){1,}/g, (s) => $t(s.replace('@:', '')))

    // i18n实例
    app.provide('$i18n', i18nProxy)
    // elment UI 的语言包
    app.provide('_getElLocale', () => _get(messages, i18nProxy.locale))
    //
    app.provide('$t', _t)

    app.config.globalProperties.$i18n = i18nProxy
    app.config.globalProperties.$t = _t

    app.directive('t', {
      ...vTDirective,
      // 在绑定元素的 attribute 前
      // 或事件监听器应用前调用
      created(el, binding, vnode, prevVnode) {
        updateBindingValue(app, binding)
        vTDirective.created(el, binding, vnode, prevVnode)
      },
      // 绑定元素的父组件更新前调用
      beforeUpdate(el, binding, vnode, prevVnode) {
        updateBindingValue(app, binding)
        vTDirective.beforeUpdate(el, binding, vnode, prevVnode)
      }
    })

    setLangObserver(i18nProxy)
    emitter.emit(EVENT_I18N_LOADED)
  }
}
