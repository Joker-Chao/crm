<template>
  <div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" @close="clearText">
      <el-form ref="form" :model="pwd" label-width="100px">
        <el-form-item label="旧密码">
          <el-input v-model="pwd.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="pwd.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="pwd.rePassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setpass">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {http,updatePwd} from '@/api/api.js'
  export default {
    props:['flag','btn'],
    data(){
      return {
        dialogFormVisible: this.flag,
        pwd: {
          oldPassword: '',
          password: '',
          rePassword: '',
        }
      }
    },
    watch:{
      flag(newVal){
        this.dialogFormVisible = newVal
      }
    },
    methods:{
      //清空密码数据
      clearText(){
        for(let key in this.pwd){
          this.pwd[key] = ''
        }
        //执行父组件方法
        this.btn()
      },
      setpass(){
        if(this.pwd.oldPassword == ''){
          this.$message.error('请输入旧密码');
        }else if(this.pwd.password == ''){
          this.$message.error('请输入新密码');
        }else if(this.pwd.rePassword == ''){
          this.$message.error('请再次输入新密码');
        }else if(this.pwd.rePassword !== this.pwd.password){
          this.$message.error('两次密码不一致');
        }else{
          this.$http.post(http+updatePwd,this.pwd,{emulateJSON:true}).then((data) => {
            console.log(data.data)
            this.dialogFormVisible = false
          },(err) => {
            location.href = './login.html'
          })
        }
      }
    }
  }
</script>

<style>
</style>
