<template>
  <div>
    <el-dialog title="修改角色" :visible.sync="cellType" @close="changeCell(tname)" v-if="dept">{{form}}
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
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {http,deptList,editRole} from '@/api/api.js'
  export default{
    props: ['type','changeCell','tname','userInfo'],
    data(){
      return{
        cellType: this.type,
        formType: {  //添加角色所需数据
          name: '', //角色名称
          tips: '', //角色编码
          deptid: '' //部门id
        },
        form: this.userInfo,
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
      },
      userInfo(newVal){
        let json = {}
        for(let i in newVal){
          this.$set(json,i,newVal[i])
        }
        this.form = json
      }
    },
    mounted(){
      this.getdeptList()
    },
    methods:{
      updateRole(){
        let flag = true
        for(let i in this.formType){
          if(this.form[i] === ''){
            flag = false
          }
        }
        if(flag){
          if(Array.isArray(this.form.deptid)){
            this.form.deptid = this.form.deptid[this.form.deptid.length - 1]
          }
          this.$http.post(http+editRole,JSON.stringify(this.form),{emulateJSON:true}).then((data) => {
            if(data.data.success){
              this.cellType = false
              this.form = ''
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
