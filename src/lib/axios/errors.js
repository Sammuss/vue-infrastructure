import { _t, getMessages } from '@/lib/i18n/index'
import { _type } from '@/utils'
import { emitter, EVENT_I18N_LOADED } from '@/lib/mitt'

// 服务端定义的错误
// 在i18n对应语言的 errors.serve 配置
export const SERVER_ERROR_MAP = new Map()
// 默认网络错误
// // 在i18n对应语言的 errors.http 配置
export const STATUS_CODE_MAP = new Map()

/**
 * 处理请求错误
 * @param {object} error
 */
export function requestErrorHandler(e) {
  return Promise.reject(e)
}

/**
 * 处理响应错误
 * @param {object} error
 */
export function responseErrorHandler(e) {
  // server error
  if (_type(e) === 'number') return { code: e, data: SERVER_ERROR_MAP.get(e) }
  // axios error
  if (_type(e) === 'object' && e.name === 'AxiosError')
    return { code: e.response.status, data: STATUS_CODE_MAP.get(e.response.status) }
  return Promise.reject(e)
}

function init() {
  for (const [key, value] of Object.entries(getMessages('errors.http')))
    STATUS_CODE_MAP.set(isNaN(key) ? key : Number(key), value)
  for (const [key, value] of Object.entries(getMessages('errors.serve')))
    SERVER_ERROR_MAP.set(isNaN(key) ? key : Number(key), value)
}

emitter.on(EVENT_I18N_LOADED, init)
