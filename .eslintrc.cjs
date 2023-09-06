// https://eslint.nodejs.cn/
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-essential'],
    overrides: [
        {
            env: {
                node: true
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['vue'],
    rules: {
        'no-console': process.env.MODE === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.MODE === 'production' ? 'warn' : 'off',

        semi: ['error', 'never'], // 禁止使用分号
        indent: [2, 4], // 强制缩进,
        'comma-spacing': ['error', { before: false, after: true }], // 逗号前后的空格
        quotes: [1, 'single'], // 引号类型 `` "" ''
        'spaced-comment': 1, // 注释后面加一个空格
        'key-spacing': [1, { beforeColon: false, afterColon: true }], // 对象字面量中冒号的前后空格，
        'no-multi-spaces': 'error', // 禁止在逻辑表达式，条件表达式，声明，数组元素，对象属性，序列和函数参数周围使用多个空格。,
        'space-before-blocks': 'error', // 块级花括号前需要空格

        'vue/multi-word-component-names': 0
    }
}
