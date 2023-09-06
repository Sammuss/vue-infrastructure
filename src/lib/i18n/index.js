import { createI18n } from 'vue-i18n'

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

const i18n = createI18n({
    legacy: false,
    locale: document.querySelector('html').lang || 'zh',
    fallbackLocale: 'zh',
    messages: messages
})

// 监听页面语言变化
const setLangObserver = () => {
    const targetNode = document.querySelector('html')
    const config = { attributes: true }
    const callback = function(mutationsList) {
        if (mutationsList.length === 0) return
        if (mutationsList[0].attributeName !== 'lang') return
        if (!mutationsList[0].target.lang) return
        i18n.global.locale.value = mutationsList[0].target.lang
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)

    // observer.disconnect()
}

export default {
    install: (app, ...options) => {
        i18n.install(app, ...options)
        const { $t, $i18n } = app.config.globalProperties
        const vTDirective = app.directive('t')
        const getDirpath = app => app?.config?.globalProperties?.$route?.meta?.dirpath
        const canIuseLocal = app => Boolean(getDirpath(app) && messages[$i18n.locale] && messages[$i18n.locale][getDirpath(app)])
        const isLocale = str => $i18n.availableLocales.includes(str)
        const formatMsg = (app, msg, locale) => {
            const canUseLocalVariable = canIuseLocal(app)
            if (!canUseLocalVariable) return msg
            const dirpath = getDirpath(app)
            let node = messages[locale && isLocale(locale) ? locale : $i18n.locale][getDirpath(app)]
            msg.split('.')
                .forEach(key => {
                    if (typeof node !== 'object') return node = undefined
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

        app.provide('$i18n', $i18n)

        app.config.globalProperties.$t = (msg, ...args) => {
            return $t(formatMsg(app, msg, ...args), ...args)
        }

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

        setLangObserver()
    }
}
