import { createAlova } from 'alova'
import GlobalFetch from 'alova/GlobalFetch'
import VueHook from 'alova/vue'
import { useRequest } from 'alova'
import qs from 'qs'
import api from '@/constant/api'

/**
 * 请求拦截器
 * 请求前的统一逻辑处理
 */
const beforeRequest = () => {}

/**
 * 响应拦截器
 * 请求后的统一逻辑处理
 */
const onSuccess = (response, method) => {
    // arrayBuffer blob formData json text
    const executableType = ['arrayBuffer', 'blob', 'formData', 'json', 'text']
    const acceptType = method?.config?.headers?.Accept
    const resType = response.headers.has('Content-Type') ? response.headers.get('Content-Type') : ''

    // 指定接受类型
    if (executableType.includes(acceptType)) return response[acceptType]()
    if (!acceptType && resType.indexOf('json') !== -1) return response.json()
    return response
}
// 错误处理
const onError = () => {}
const responded = { onSuccess, onError }

export const instance = createAlova({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 30000,
    statesHook: VueHook,
    requestAdapter: GlobalFetch(),
    beforeRequest,
    responded,
    localCache: {
        GET: 1000 * 10
    }
})

export const $method = (action, params = {}, config = {}) => {
    let method = action.split('_', 1).toString()
    action = action.replace(`${method}_`, '')
    method = method.toLowerCase().replace(/^[a-z]/g, (L) => L.toUpperCase())
    let url = api[action] ? api[action] : action
    const useQs = config?.useQs

    if (['Get', 'Head', 'Options'].includes(method)) {
        if (useQs) {
            url += JSON.stringify(params) !== '{}' ? `?${qs.stringify(params, config.qsConfig || {})}` : ''
            config.qsConfig && delete config.qsConfig
        } else {
            config.params = params
        }
        return instance[method](url, config)
    }

    if (['Post', 'Put', 'Delete', 'Patch'].includes(method)) {
        if (useQs) {
            params = qs.stringify(params, config.qsConfig || {})
            config.qsConfig && delete config.qsConfig
        }
        return instance[method](url, params, config)
    }
}

export const $send = (action, params = {}, config = {}) => {
    const { send } = useRequest($method(action, params, config))
    return send()
}

export default {
    install: (app) => {
        // 获取alova实例
        app.provide('$alova', instance)

        // 获取方法实例
        app.provide('$method', $method)

        // 直接发起请求
        app.provide('$send', $send)
    }
}
