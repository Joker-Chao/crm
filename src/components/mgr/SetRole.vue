<template>
  <div>
    <el-dialog title="分配角色" :visible.sync="cellType" @close="changeCell(tname)" @open="getRoleInfo">
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
        form: {  //角色所需数据
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
    methods:{
      btnRole(){
        let flag = true
        for(let i in this.form){
          if(this.form[i] === ''){
            flag = false
          }
        }
        if(flag){
          this.form.userId = this.userInfo.id
          this.$http.get(http+setRole,{
            params: this.form
          }).then((data) => {
            if(data.data.success){
              this.cellType = false
            }else{
              this.$message.error(data.data.message)
            }
          },(err) => {
            console.error(err.data.message)
          })
          delete this.form.userId
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
          if(data.data.success){
            this.roleInfo = data.data.data
          }else{
            this.$message.error(data.data.message)
          }
        },(err) => {
          console.error(err.data.message)
        })
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
