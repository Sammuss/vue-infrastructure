import { createI18n } from 'vue-i18n'
import _get from 'lodash.get'

const messages = {}
// 引入同级目录下 设置全局变量 lang-*.js | lang-*/index.js
Object.entries(import.meta.glob(['./lang-*.js', './lang-*/index.js'], { eager: true, import: 'default' }))
    .forEach(([fileName, component]) => {
        const lang = fileName.replace(/(\.\/lang-|\/index|\.js)/ig, '')
        messages[lang] = component
    })

// 引入各页面下的本地配置
Object.entries(import.meta.glob(['/src/views/**/lang.js'], { eager: true, import: 'default' }))
    .forEach(([fileName, component]) => {
        const dirpath = fileName.replace(/(\/src\/views|\/lang\.js)/ig, '')
        Object
            .keys(component)
            .forEach(lang => {
                if (messages[lang]) {
                    messages[lang][dirpath] = component[lang]
                }
            })
    })


// 引入各语言的elment UI配置
Object.entries(import.meta.glob(['/node_modules/element-plus/dist/locale/*.mjs', '!/node_modules/element-plus/dist/locale/*.min.mjs'], { eager: true, import: 'default' }))
    .forEach(([fileName, component]) => {
        const lang = fileName.match(/[a-z]{1,}(-[a-z]+?)?\.mjs$/g).toString().replace('.mjs', '')
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

export default {
    install: (app, ...options) => {
        i18n.install(app, ...options)
        const { $i18n } = app.config.globalProperties
        const i18nProxy = new Proxy($i18n, {
            set: function (obj, prop, value) {
                if (prop === 'locale') {
                    const { $t, $mitt, $route } = app.config.globalProperties
                    $mitt && $mitt.emit('lang-change')
                    if ($route && $route.meta && $t) {
                        document.title = $route.meta.title || $t('project.name', value)
                    }
                }
                obj[prop] = value
                return true
            }
        })
        
        const vTDirective = app.directive('t')
        const getDirpath = app => app?.config?.globalProperties?.$route?.meta?.dirpath
        const canIuseLocal = (app, locale) => Boolean(getDirpath(app) && messages[locale || $i18n.locale] && messages[locale || $i18n.locale][getDirpath(app)])
        const isLocale = str => $i18n.availableLocales.includes(str)
        const getLocale = (locale) => isLocale(locale) ? locale : $i18n.locale
        const formatMsg = (app, msg, locale) => {
            const canUseLocalVariable = canIuseLocal(app, locale)
            if (!canUseLocalVariable) return msg
            const dirpath = getDirpath(app)
            let node = messages[locale && isLocale(locale) ? locale : $i18n.locale][dirpath]
            msg.split('.')
                .forEach(key => {
                    if (Object.prototype.toString.call(node) !== '[object Object]') return node = undefined
                    if (key in node) node = node[key]
                    else return node = undefined
                })
            return node === undefined ? msg : `${dirpath}.${msg}`
        }
        const updateBindingValue = (app, binding) => {
            if (typeof binding.value === 'string') {
                binding.value = { path: binding.value }
            }
            binding.value.path = formatMsg(app, binding.value.path, binding.value.locale)
        }

        app.provide('$i18n', i18nProxy)
        app.provide('$t4el', () => _get(messages, i18nProxy.locale))

        app.config.globalProperties.$i18n = i18nProxy
        app.config.globalProperties.$t = (msg, ...args) => _get(messages, `${getLocale(...args)}.${formatMsg(app, msg, ...args)}`)
        
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
        
    }
}
