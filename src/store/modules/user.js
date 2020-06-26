export default{
  state: {
    info: ''
  },
  mutations: {
    //修改当前账号信息
    setInfo(state,data){
      state.info = data
    }
  }
}
