export default {
  project: {
    name: '示例'
  },
  message: {
    hello: '你好世界'
  },
  fields: {
    username: '用户名',
    password: '密码'
  },
  placeholders: {
    input: '请输入',
    select: '请选择'
  },
  errors: {
    required: '{field}不能为空',
    format: '{field}格式错误',
    lengthBetween: '长度要求在{0}到{1}个字符之间',
    lengthUnder: '长度要求在[0]个字符之内',
    lengthOver: '长度要求在[0]个字符以上',

    username_Password: '用户名或密码错误',
    serve: {
      10401: '用户名或密码错误'
    },
    http: {
      400: '客户端错误',
      401: '客户端错误，要求的身份验证凭证',
      403: '客户端错误，拒绝授权访问',
      404: '客户端错误，无法找到请求的资源',
      405: '客户端错误，请求方法错误',
      500: '服务端错误',
      501: '服务端错误，请求方法不被支持',
      502: '服务端错误，无效响应'
    }
  }
}
