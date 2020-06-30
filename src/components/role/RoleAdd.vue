<template>
  <div>
    <el-dialog title="添加角色" :visible.sync="cellType" @close="closeCell" v-if="dept">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="form.tips"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader v-model="form.deptid" :options="dept" :show-all-levels="false" :props="props"></el-cascader>
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
  import {http,deptList,editRole} from '@/api/api.js'
  export default{
    props: ['type','changeCell','tname'],
    data(){
      return{
        cellType: this.type,
        form: {  //添加角色所需数据
          name: '', //角色名称
          tips: '', //角色编码
          deptid: '' //部门id
        },
        props: { //联级选择配置
          value: 'id',
          label: 'simplename',
          children: 'children'
        },
        dept: ''
      }
    },
    watch:{
      type(newVal){
        this.cellType = newVal
      }
    },
    mounted(){
      this.getdeptList()
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
          //当前用户id
          this.form.pid = this.$store.state.user.info.profile.id
          //排序
          this.form.num = 0
          //部门id
          this.form.deptid = this.form.deptid[this.form.deptid.length - 1]
          this.$http.post(http+editRole,JSON.stringify(this.form),{emulateJSON:true}).then((data) => {
            if(data.data.success){
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
      },
      childrenIsNull(data){
        for(let i = 0;i < data.length;i++){
          if(data[i].children.length === 0){
            data[i].children = null
          }else{
            this.childrenIsNull(data[i].children)
          }
        }
        return data
      },
      getdeptList(){
        this.$http.get(http+deptList).then((data) => {
          if(data.data.success){
            this.dept = this.childrenIsNull(data.data.data)
          }else{
            this.$message.error(data.data.message)
          }
        },(err) => {
          console.error(err.data.message)
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
