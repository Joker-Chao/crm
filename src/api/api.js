// 服务器地址
const http = 'http://39.101.217.150:8086'
// 登录地址
const login = '/account/login'
// 获取菜单信息
const menuList = '/menu/listForRouter'
// 获取用户信息
const user = '/account/info'
// 获取功能项操作信息
const operationList = '/menu/list'
// 修改用户密码
const updatePwd = '/account/updatePwd'
// 获取文章分类
const articleList = '/channel/list'
// 获取文章数量
const articleNum = '/article/articlebychannel'
// 获取用户列表
const userList = '/user/list'
// 获取部门信息列表
const deptList = '/dept/list'
// 添加用户
const editUser = '/user'
// 修改用户
const editUserStatus = '/user/changeStatus'
// 获取角色
const getRole = '/role/roleTreeListByIdUser'
// 分配角色
const setRole = '/user/setRole'

export {
  http,
  login,
  menuList,
  user,
  operationList,
  updatePwd,
  articleList,
  articleNum,
  userList,
  deptList,
  editUser,
  editUserStatus,
  getRole,
  setRole
}
