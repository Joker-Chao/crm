<template>
  <div class="info">
    <p>账号信息：{{$store.state.user.info.profile.account}}</p>
    <p>修改密码：
      <span style="color: tomato" @click="flag = true">修改密码</span>
    </p>
    <p>姓名：{{$store.state.user.info.profile.name}}</p>
    <p>生日：{{$store.state.user.info.profile.birthday}}</p>
    <p>性别：{{$store.state.user.info.profile.sex == 1 ? '男' : '女'}}</p>
    <p>邮箱：{{$store.state.user.info.profile.email}}</p>
    <p>电话：{{$store.state.user.info.profile.phone}}</p>
    <p>部门：{{$store.state.user.info.profile.deptid}}</p>
    <p><el-button type="danger" @click="logout">退出登录</el-button></p>
    <updata-pwd :flag="flag" :btn="btn"></updata-pwd>
  </div>
</template>

<script>
  import UpdataPwd from './UpdatePwd.vue'
  export default {
    data(){
      return{
        flag : false
      }
    },
    components:{
      UpdataPwd
    },
    methods:{ 
      btn(){
        // 关闭对话框的状态
        this.flag = false
      },
      logout(){
        // 退出登录
        localStorage.clear()
        location.href = './login.html'
      }
    }
  }
</script>

<style scoped>
  .info>p{
    line-height: 40px;
    font-size: 20px;
  }
</style>
