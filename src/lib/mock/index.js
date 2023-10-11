// https://github.com/vbenjs/vite-plugin-mock/blob/main/README.zh_CN.md
import data from './data'
// import jwt from 'jwt-simple'
// https://github.com/auth0/node-jsonwebtoken
const jwt = require('jsonwebtoken')

const secretKey = Buffer.from('ststjstwmdyxxnz', 'hex')
const tokenList = new Set()

const isTokenExisting = (token) => tokens.findIndex(([, , t]) => t === token) !== -1
const isUserLogined = (username, password) => tokens.findIndex(([u, p]) => u === username && p === password)
const login = function (username, password) {
  const payload = { username, password }
  const options = {
    expiresIn: '4h'
  }
  const token = jwt.sign(payload, secretKey, options)
  tokenList.add(token)
  return token
}
const logout = (authorization) => tokenList.delete(authorization.replace('Bearer ', ''))
const isValidityToken = (authorization) => {
  if (!authorization) return false
  const token = authorization.replace('Bearer ', '')
  if (!tokenList.has(token)) return false
  try {
    jwt.verify(token, secretKey)
    return true
  } catch (e) {
    return false
  }
}
const pagination = (list, page, size) => list.slice((page - 1) * size, page * size)
/**
 * url: string;
 * method?: MethodType;
 * timeout?: number;
 * statusCode?:number;
 * response?: ((opt: { [key: string]: string; body: Record<string,any>; query:  Record<string,any>, headers: Record<string, any>; }) => any) | any;
 * rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
 */
export default [
  {
    method: 'post',
    url: '/user/login',
    rawResponse: async (req, res) => {
      let body = ''
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => resolve(undefined))
      })
      try {
        const { username, password } = JSON.parse(body)
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        if (username !== 'admin' || password !== '123456') {
          return res.end(
            JSON.stringify({
              code: 10401,
              data: 'username or password error'
            })
          )
        }
        // const payload = { username, password }
        // const token = jwt.encode(payload, SECRET)
        const token = login(username, password)
        res.end(
          JSON.stringify({
            code: 200,
            data: { token, ...data.users[0] }
          })
        )
      } catch (e) {
        res.end(
          JSON.stringify({
            code: 400,
            data: null
          })
        )
      }
    }
  },
  {
    method: 'post',
    url: '/user/logout',
    rawResponse: async (req, res) => {
      if (!isValidityToken(req.headers.authorization)) {
        return res.end(JSON.stringify({ code: 401, data: null }))
      }
      logout(req.headers.authorization)
      res.end(JSON.stringify({ code: 200, data: null }))
    }
  },
  {
    method: 'get',
    url: '/user/list',
    response: ({ query, headers }) => {
      if (!isValidityToken(headers.authorization)) {
        return { code: 401, data: null }
      }
      const page = Number(query.page || 1)
      const size = Number(query.size || 20)
      const total = data.users.length
      return {
        code: 200,
        data: {
          page,
          size,
          total,
          list: pagination(data.users, page, size)
        }
      }
    }
  }
]
