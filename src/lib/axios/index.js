import Axios from 'axios'
import qs from 'qs'

import api from '@/constant/api'
import { storage } from '@/utils/storage'

import config from './config'
import { requestErrorHandler, responseErrorHandler } from './errors'

export const $axios = Axios.create(config)

/**
 * 请求拦截器
 * 请求前的统一逻辑处理
 */
$axios.interceptors.request.use(function (config) {
  const token = storage.get('token')
  if (token) {
    config.headers.test = token
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, requestErrorHandler)

/**
 * 响应拦截器
 * 请求后的统一逻辑处理
 */
$axios.interceptors.response.use(function (response) {
  import.meta.env.DEV && console.log(response.config.url + '\n', response)

  if (!response?.headers['content-type']?.includes('json')) return response
  const { code } = response.data
  if (code !== 200) return responseErrorHandler(code)
  return response.data
}, responseErrorHandler)

export const $http = (action, data = {}, config = {}) => {
  let method = action.split('_', 1).toString()
  action = action.replace(`${method}_`, '')
  method = method.toLowerCase()
  let url = api[action] ? api[action] : action

  if (['get', 'delete', 'head', 'options'].includes(method)) {
    url += JSON.stringify(data) !== '{}' ? `?${qs.stringify(data, config.qsConfig || {})}` : ''
    config.qsConfig && delete config.qsConfig
    return $axios[method](url, config)
  }

  if (['post', 'put', 'patch', 'postForm', 'putForm', 'patchForm'].includes(method)) {
    if (['application/x-www-form-urlencoded'].includes(config?.headers?.contentType)) {
      data = qs.stringify(data, config.qsConfig || {})
    }
    config.qsConfig && delete config.qsConfig
    return $axios[method](url, data, config)
  }
}

export default {
  install: (app) => {
    app.provide('$axios', $axios)

    // qsConfig 在qs字符串化的时候使用的配置
    app.provide('$http', $http)
  }
}
