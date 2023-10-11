const isSupportStorage = !!window.localStorage

export function textEncode(s) {
  return new TextEncoder().encode(s)
}

export function textDecode(s) {
  return new TextDecoder().decode(new Uint8Array(s.split(',').map((n) => n - 0)))
}

export function base64encode(s) {
  return window.btoa(s)
}

export function base64decode(s) {
  return window.atob(s)
}

function encode(s) {
  return textEncode(s)
}

function decode(s) {
  return textDecode(s)
}

/**
 *
 * @param {string} key
 * @param {any} value
 * @param {number} expires after second, item lose efficacy
 */
function set(isSupportStorage) {
  if (isSupportStorage) {
    return (key, value, expires = 0) => {
      expires = isNaN(expires) ? 0 : Number(expires)
      if (expires > 0) {
        expires = new Date().getTime() + expires * 1000
      }
      window.localStorage.setItem(base64encode(key), encode(`${JSON.stringify(value)};expires=${expires}`))
    }
  }

  return (key, value, expires) => {
    const expiresTime = new Date()
    expiresTime.setTime(expiresTime.getTime() + expires * 1000)
    document.cookie = `${base64encode(key)}=${encode(JSON.stringify(value))}; expires=${expiresTime.toUTCString()}`
  }
}

/**
 *
 * @param {string} key
 * @returns
 */
function get(isSupportStorage) {
  if (isSupportStorage) {
    return (key) => {
      try {
        const value = decode(window.localStorage.getItem(base64encode(key)))

        if (!value) return null

        const expires = value.replace(/(.|\s|=)+;expires=/, '')
        if (expires > 0 && expires < new Date().getTime()) {
          window.localStorage.removeItem(base64encode(key))
          return null
        }

        return JSON.parse(value.replace(`;expires=${expires}`, ''))
      } catch {
        return null
      }
    }
  }

  return (key) => {
    key = base64encode(key) + '='
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      var item = cookies[i].trim()
      if (item.indexOf(key) === 0) {
        return JSON.parse(decode(item.substring(key.length, item.length)))
      }
    }
  }
}

function remove(isSupportStorage) {
  if (isSupportStorage) {
    return (key) => window.localStorage.removeItem(base64encode(key))
  }

  return (key) => (document.cookie = `${base64encode(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
}

export const storage = {
  get: get(isSupportStorage),
  set: set(isSupportStorage),
  remove: remove(isSupportStorage)
}

export default storage
