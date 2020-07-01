<template>
  <div>
    <el-dialog title="修改部门" :visible.sync="cellType" @close="changeCell(tname)">
      <el-form ref="form" :model="form" label-width="80px" style="margin-top: 20px;" v-if="form">
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
        formType: {  //添加角色所需数据
          fullname: '', //部门全称
          simplename: '' //部门简称
        },
        form: ''
      }
    },
    watch:{
      type(newVal){
        this.cellType = newVal
      },
      userInfo(newVal){
        let json = {}
        for(let i in this.userInfo){
          this.$set(json,i,this.userInfo[i].toString())
        }
        this.form = json
      }
    },
    methods:{
      addRole(){
        let flag = true
        for(let i in this.formType){
          if(this.form[i] === ''){
            flag = false
          }
        }
        if(flag){
          this.$http.post(http+editDept,JSON.stringify(this.form),{emulateJSON:true}).then((data) => {
            if(data.data.success){
              this.cellType = false
            }else{
              this.$message.error(data.data.message)
            }
          },(err) => {
            console.error(err.data.message)
          })
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
