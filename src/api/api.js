// 服务器地址
const http = 'http://39.101.217.150:8086'
// 登录地址
const login = '/account/login'

// 获取菜单信息
const menuList = '/menu/listForRouter'
// 获取功能项操作信息
const operationList = '/menu/list'
// 修改菜单
const editMenu = '/menu'

// 获取用户信息
const user = '/account/info'
// 获取用户列表
const userList = '/user/list'
// 修改用户
const editUser = '/user'
// 修改用户状态
const editUserStatus = '/user/changeStatus'
// 修改用户密码
const updatePwd = '/account/updatePwd'

// 获取文章分类
const articleList = '/channel/list'
// 获取文章数量
const articleNum = '/article/articlebychannel'

// 获取部门信息列表
const deptList = '/dept/list'
// 修改部门
const editDept = '/dept'

// 获取角色
const getRole = '/role/roleTreeListByIdUser'
// 分配角色
const setRole = '/user/setRole'
//（根据角色名称搜索）角色列表
const roleList = '/role/list'
//根据角色id修改角色
const editRole = '/role'
//根据角色id获取菜单树
const menuTree = '/menu/menuTreeListByRoleId'
//根据角色id配置菜单权限
const savePermission = '/role/savePermisson'

//（根据角色名称搜索）角色列表
const dictList = '/dict/list'
// 修改字典
const dict = '/dict'

// 获取栏目信息
const channelList = '/channel/list'
// 修改字典
const channel = '/channel'


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
  setRole,
  roleList,
  editRole,
  menuTree,
  savePermission,
  editDept,
  editMenu,
  dictList,
  dict,
  channelList,
  channel
}
