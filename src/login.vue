<template>
  <div id="login">
    <div class="login-warpper">
      <el-form ref="form" :model="login" label-width="50px">
        <el-form-item label="账号">
          <el-input v-model="login.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="login.pwd"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;margin-right: 50px;">
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {http,login} from './api/api.js'
  export default{
    data(){
      return {
        login: {
          user: '',
          pwd: ''
        }
      }
    },
    methods:{
      //登录事件
      onSubmit(){
        //最简单的一个验证
        if(this.login.user == ''){
          this.$message.error('请输入账号');
        }else if(this.login.pwd == ''){
          this.$message.error('请输入密码');
        }else{
          // 登录的ajax
          this.$http.post(http+login,{
            username: this.login.user,
            password: this.login.pwd
          },{emulateJSON:true}).then((data) => {
            if(data.data.msg == '用户名或密码错误'){
              this.$message.error('用户名或密码错误');
            }else if(data.data.success){
              localStorage.token = data.data.data.token
              location.href = './index.html'
            }
          }),(err) => {
            this.$message.error('登录失败');
          }
        }
      }
    }
  }
</script>

<style scoped>
  .login-warpper{
    width: 450px;
    margin: 200px auto;
    padding: 30px 10px 0;
    border: 1px solid aqua;
    background-color: #f7f7f7;
  }
</style>
