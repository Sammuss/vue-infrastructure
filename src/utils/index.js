/**
 * 判断参数类型
 * @param {*} param
 * @returns string
 */
export const _type = (param) =>
  Object.prototype.toString
    .call(param)
    .replace(/(\[object+\s|\])/g, '')
    .toLowerCase()

/**
 * 复制文字到粘贴板
 * @param {String} text
 * @returns
 */
export const copyToClipboard = (text) => navigator.clipboard.writeText(text)

/**
 * 获取url请求参数
 * @param {String} url
 * @returns object
 */
export const parseQuery = (url) =>
  Object.fromEntries((url.match(/([^?&=]+)=([^&]+)/g) || []).map((entry) => entry.split('=')))

/**
 * 产生随机颜色hex
 * @returns string
 */
export const randomHex = () =>
  '#' +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, '0')

/**
 * 根据字符串产生固定长度字符串
 * @param {Number} length
 * @param {String} characters
 * @returns string
 */
export function generateRandomString(
  length,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) {
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
}

/**
 * 移除字符串中标签
 * @param {String} input
 * @returns
 */
export const removeHtmlTags = (input) => input.replace(/<[^>]*>/g, '')
