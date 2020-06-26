export default{
  state: {
    menu: ''
  },
  mutations: {
    //修改导航
    setMenu(state,data){
      state.menu = data
    }
  }
}
