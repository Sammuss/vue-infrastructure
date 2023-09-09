// https://github.com/vbenjs/vite-plugin-mock/blob/main/README.zh_CN.md
import data from './data'
import jwt from 'jwt-simple'

const SECRET = Buffer.from('ststjstwmdyxxnz', 'hex')

const pagination = (list, page, size) => list.slice((page - 1) * size, page * size)
const tokens = new Map()
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
                    return res.end(JSON.stringify({
                        code: 10401,
                        data: 'username or password error'
                    }))
                }
                const payload = { username, password }
                const token = jwt.encode(payload, SECRET)
                tokens.set(`${username}_${password}`, token)
                res.end(JSON.stringify({
                    code: 200,
                    data: { token }
                }))
            } catch (e) {
                res.statusCode = 400
                res.end(e)
            }
        }
    },
    {
        method: 'get',
        url: '/user/list',
        response: ({ query }) => {
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
