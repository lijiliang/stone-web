
export default {
  register: '/api/v1/register', // 注册
  captcha: '/api/v1/captcha', // 验证码
  login: '/api/v1/login', // 登录
  current: '/api/v1/current', // 获取用户信息
  logs: '/api/v1/logs', // 登录日志
  user: '/api/v1/user', // 用户管理
  sensitivetype: '/api/v1/sensitivetype', // 敏感词管理
  sensitive: '/api/v1/sensitive', // 敏感词管理
  role: '/api/admin/v1/role', // 角色管理
  roleuser: '/api/admin/v1/roleuser', // 角色与用户关联
  resource: '/api/admin/v1/resource', // 资源管理
  roleresources: '/api/admin/v1/roleresources', // 获取角色与资源关联列表
  saveresources: '/api/admin/v1/saveresources', // 保存角色与资源关联
  interface: '/api/v1/interface', // 接口管理
  cmsCategory: '/api/admin/v1/category', // 栏目管理
  cmsArticle: '/api/admin/v1/article' // 文章管理
}
