import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
    const env = loadEnv(mode, process.cwd())
    const mockEnable = env.VITE_MOCK === 'true'
    const config = {
        build: {
            rollupOptions: {
                input: {
                    index: 'index.html'
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        plugins: [ vue() ],
        define: {
            __VUE_I18N_FULL_INSTALL__: true,
            __VUE_I18N_LEGACY_API__: true,
            __INTLIFY_PROD_DEVTOOLS__: false
        },
        server: {
            // port: 3000,
            proxy: {}
        }
    }

    // 设置代理
    const getProxies = () => {
        const arr = []
        const reduceArr = (result, item, index) => {
            index % 2 ? result[result.length - 1].push(item) : result.push([item])
            return result
        }
        // 无需代理
        if (!env.VITE_PROXIES) return arr.reduce(reduceArr, [])
        // VITE_PROXIES
        arr.push(...env.VITE_PROXIES.split(','))
    
        // 只写了代理路径
        if (arr.length === 1) {
            arr.unshift(env.VITE_BASE_URL)
            return arr.reduce(reduceArr, [])
        }

        // 长度异常
        if (arr.length % 2) return []

        return arr.reduce(reduceArr, [])
    }
    getProxies().forEach(([key, target]) => {
        config.server.proxy[key] = {
            target, 
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(key, '')
        }
    })

    // mock 代理
    if (mockEnable) {
        config.plugins.push(
            viteMockServe({
                ignore: /(data)\.js/,
                mockPath: './src/lib/mock/',
                watchFiles: true,
                enable: mockEnable,
                logger: true
            }))
        config.server.proxy['^/mock'] = {
            target: `http://localhost:${config.server.port || 5173}/`,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/mock/, '')
        }
    }
    return config
})
 