import qs from 'qs'
import Axios from 'axios'
import config from './config'

export const instance = Axios.create(config)

/**
 * 请求拦截器
 * 请求前的统一逻辑处理
 */
instance.interceptors.request.use(function (config) {
    return config
}, requestErrorHandler)

/**
 * 响应拦截器
 * 请求后的统一逻辑处理
 */
instance.interceptors.response.use(function (response) {
    import.meta.env.DEV && console.log(response.config.url + '\n', response)
    return response
}, responseErrorHandler)

/**
 * 处理请求错误
 * @param {object} error
 */
function requestErrorHandler (error) {
    return Promise.reject(error)
}

/**
 * 处理响应错误
 * @param {object} error
 */
function responseErrorHandler (error) {
    return Promise.reject(error)
}

export default {
    install: (app) => {
        app.provide('$axios', instance)
    
        // qsConfig 在qs字符串化的时候使用的配置
        app.provide('$http', (action, data = {}, config = {}) => {
            let method = action.split('_', 1).toString()
            action = action.replace(`${method}_`, '')
            method = method.toLowerCase()
            const { $api } = app.config.globalProperties
            let url = ($api && $api[action]) ? $api[action] : action

            if (['get', 'delete', 'head', 'options'].includes(method)) {
                url += JSON.stringify(data) !== '{}' ? `?${qs.stringify(data, config.qsConfig || {})}` : ''
                config.qsConfig && delete config.qsConfig
                return instance[method](url, config)
            }

            if (['post', 'put', 'patch', 'postForm', 'putForm', 'patchForm'].includes(method)) {
                if (['application/x-www-form-urlencoded'].includes(config?.headers['content-type'])) {
                    data = qs.stringify(data, config.qsConfig || {})
                }
                config.qsConfig && delete config.qsConfig
                return instance[method](url, data, config)
            }
        })
    }
}
