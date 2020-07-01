<template>
  <div>
    <el-dialog title="添加部门" :visible.sync="cellType" @close="changeCell(tname)">
      <el-alert
        style="margin-bottom: 20px;"
        title="介绍"
        type="info"
        close-text=" "
        v-if="userInfo == ''"
        description="当前创建的是公司级别部门,如果要创建部门级别,请选择创建的父级部门">
      </el-alert>
      <el-alert
        title="介绍"
        type="info"
        close-text=" "
        v-else
        :description="'当前创建的是 (' + userInfo.fullname + ') 下的部门,如果要创建公司级别部门，请取消选择'">
      </el-alert>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="部门全称">
          <el-input v-model="form.fullname"></el-input>
        </el-form-item>
        <el-form-item label="部门简称">
          <el-input v-model="form.simplename"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cellType = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {http,editDept} from '@/api/api.js'
  export default{
    props: ['type','changeCell','tname','userInfo'],
    data(){
      return{
        cellType: this.type,
        form: {  //添加角色所需数据
          fullname: '', //部门全称
          simplename: '' //部门简称
        }
      }
    },
    watch:{
      type(newVal){
        this.cellType = newVal
      }
    },
    methods:{
      addRole(){
        let flag = true
        for(let i in this.form){
          if(this.form[i] === ''){
            flag = false
          }
        }
        if(flag){
          //上级部门id
          if(this.userInfo == ''){
            this.form.pid = 0
          }else{
            this.form.pid = this.userInfo.id
          }
          //排序
          this.form.num = 0
          this.$http.post(http+editDept,JSON.stringify(this.form),{emulateJSON:true}).then((data) => {
            if(data.data.success){
             for(let i in this.form){
               this.form[i] = ''
              }
              this.cellType = false
            }else{
              this.$message.error(data.data.message)
            }
          },(err) => {
            console.error(err.data.message)
          })
          delete this.form.pid
          delete this.form.num
        }else{
          this.$message({
            message: '请输入完整的信息',
            type: 'warning'
          })
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
