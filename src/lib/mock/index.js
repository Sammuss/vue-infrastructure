// https://github.com/vbenjs/vite-plugin-mock/blob/main/README.zh_CN.md
export default [
    {
        method: 'get',
        url: '/auth/login',
        response: () => {
            return {
                code: 0,
                data: {
                    name: 'vben',
                },
            }
        },
    }
]