<template>
  <div>
    <el-dialog title="修改用户" :visible.sync="cellType" @close="changeCell(tname)">
      <el-form ref="form" :model="form" label-width="80px" v-if="dept&&userInfo">
        <el-form-item label="账户">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.birthday" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader v-model="form.deptid" :options="dept" :show-all-levels="false" :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cellType = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {http,deptList,editUser} from '@/api/api.js'
  export default{
    props: ['type','changeCell','tname','userInfo'],
    data(){
      return{
        cellType: this.type,
        props: { //联级选择配置
          value: 'id',
          label: 'simplename',
          children: 'children'
        },
        formType: {  //添加用户所需数据
          account: '', //账号
          name: '', //姓名
          birthday: '', //生日
          sex: '', //性别
          email: '', //邮箱
          phone: '', //电话
          deptid: '', //部门id
          status: '' //状态
        },
        dept: '',
        form: this.userInfo,
        account: this.userInfo.account
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
        this.account = json.account
        this.form = json
      }
    },
    mounted(){
      this.getdeptList()
    },
    methods:{
      updateUser(){
        let flag = true
        for(let i in this.formType){
          if(this.form[i] === ''){
            flag = false
          }
        }
        if(this.account !== this.form.account){
          this.$message.error('不能修改账号');
          this.form.account = this.account
          return
        }
        if(flag){
          if(Array.isArray(this.form.deptid)){
            this.form.deptid = this.form.deptid[this.form.deptid.length - 1]
          }
          this.form.birthday = this.setTimeType(this.form.birthday)
          this.$http.post(http+editUser,this.form,{emulateJSON:true}).then((data) => {
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
      setTimeType(time){
        time = new Date(time)
        return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
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
