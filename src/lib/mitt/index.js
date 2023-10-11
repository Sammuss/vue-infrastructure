// https://github.com/developit/mitt
import mitt from 'mitt'

// 事件
export const EVENT_I18N_LOADED = Symbol('i18n-loaded')
export const EVENT_LOCALE_CHANGE = Symbol('i18n-locale-change')

export const EVENT_USER_LOGIN = Symbol('user-login')
export const EVENT_USER_LOGOUT = Symbol('user-logout')

export const emitter = mitt()
export default emitter
