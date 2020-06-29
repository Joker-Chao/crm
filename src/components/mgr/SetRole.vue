<template>
  <div>
    <el-dialog title="分配角色" :visible.sync="cellType" @close="closeCell">{{userInfo}}
      <el-form ref="form" :model="form" label-width="80px" v-if="roleInfo">
        <el-form-item label="选择角色">
          <el-select v-model="form.roleIds" placeholder="请选择">
            <el-option
              v-for="item in roleInfo.treeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cellType = false">取 消</el-button>
        <el-button type="primary" @click="btnRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {http,getRole,setRole} from '@/api/api.js'
  export default{
    props: ['type','changeCell','tname','userInfo'],
    data(){
      return{
        cellType: this.type,
        form: {  //添加用户所需数据
          roleIds: this.userInfo.roleid
        },
        roleInfo: ''
      }
    },
    watch:{
      type(newVal){
        this.cellType = newVal
      },
      userInfo(newVal){
        this.form.roleIds = newVal.roleid
      }
    },
    mounted(){
      if(!localStorage.token) {
        return location.href="./login.html"
      }
      this.getRoleInfo()
    },
    methods:{
      btnRole(){
        let flag = true
        for(let i in this.formType){
          if(this.form[i] === ''){
            flag = false
          }
        }
        if(flag){
          this.$http.get(http+setRole,{
            params: this.from
          }).then((data) => {
            if(data.data.msg === '成功'){
              this.cellType = false
              this.clearTable()
            }
          },(err) => {
            console.log(err)
            // if(err.data.message === '该用户已经注册'){
            //   this.$message.error('该用户已经注册');
            //   this.clearTable()
            // }else{
            //   location.href = './login.html'
            // }
          })
        }else{
          this.$message({
            message: '请输入完整的信息',
            type: 'warning'
          })
        }
      },
      getRoleInfo(){
        this.$http.get(http+getRole,{
          params: {
            idUser: this.$store.state.user.info.profile.id
          }
        }).then((data) => {
          console.log(data.data.data.treeData)
          if(data.data.success){
            this.roleInfo = data.data.data
          }
        },(err) => {
          // location.href = './login.html'
        })
      },
      closeCell(){
        this.clearTable()
        this.changeCell(this.tname)
      },
      clearTable(){
        for(let key in this.form){
          if(key === 'sex'){
            this.form[key] = 1
          }else if(key === 'status'){
            this.form[key] = 0
          }else{
            this.form[key] = ''
          }
        }
      }
    }
  }
</script>

<style scoped>
/deep/ .el-dialog__header{
  text-align: center;
  font-weight: 700;
  letter-spacing: 5px;
}
</style>
