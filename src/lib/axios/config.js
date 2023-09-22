'use strict'

const config = {
  baseURL: import.meta.env.VITE_BASE_URL,

  // 请求超时设置
  timeout: 30000,

  headers: {
    'Content-Type': 'application/json'
  },

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false,

  // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {},

  // `responseType` 表示服务器响应的数据类型，可以是 'arrayBuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // 默认的

  // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN',

  // `xsrfHeaderName` 是承载 xsrf token 的值的 HTTP 头的名称
  xsrfHeaderName: 'X-XSRF-TOKEN',

  // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve 否则，promise 将被 reject
  validateStatus: function (status) {
    return status >= 200 && status < 300 // 默认的
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5
}

export default config
