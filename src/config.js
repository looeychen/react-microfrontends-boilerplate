const DEV = process.env.NODE_ENV !== 'production'

module.exports = {
  // 环境变量
  DEV,

  // 子目录
  baseAlias: '',

  //API请求前缀
  apiDomain: '/api',

  //微前端模块配置信息
  microModulesApiUrl: '/micro-modules/modules.json'
}
