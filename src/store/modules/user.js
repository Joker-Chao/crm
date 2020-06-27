export default{
  state: {
    info: '',
    menuList: ''
  },
  mutations: {
    //修改当前账号信息
    setInfo(state,data){
      state.info = data
    },
    setMenuList(state,data){
      state.menuList = data
    }
  }
}
