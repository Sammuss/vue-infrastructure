// http://mockjs.com/examples.html
import Mock from 'mockjs'

const template = {
  'users|100-300': [
    {
      id: '@id',
      name: '@cname',
      age: '@integer(1, 80)',
      isAdmin: '@boolean',
      email: '@email',
      address: '@county(true)'
    }
  ]
}

export default Mock.mock(template)
