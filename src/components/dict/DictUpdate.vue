<template>
  <div>
    <el-dialog title="修改菜单" :visible.sync="cellType" @close="changeCell(tname)">
      <el-form ref="form" :model="form" label-width="100px" v-if="form">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="form.component"></el-input>
        </el-form-item>
        <el-form-item label="链接标识">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">弃用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否是菜单">
          <el-radio-group v-model="form.ismenu">
            <el-radio label="1">菜单</el-radio>
            <el-radio label="0">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cellType = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {http,editMenu} from '@/api/api.js'
  export default{
    props: ['type','changeCell','tname','userInfo'],
    data(){
      return{
        cellType: this.type,
        formType: {  //添加角色所需数据
          name: '', //菜单名称
          code: '' ,//编码
          component: '', //组件
          url: '', //链接标识
          status: '1', //状态
          ismenu: '0' //是否是菜单
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
      update(){
        let flag = true
        for(let i in this.formType){
          if(this.form[i] === ''){
            flag = false
          }
        }
        if(flag){
          this.$http.post(http+editMenu,JSON.stringify(this.form),{emulateJSON:true}).then((data) => {
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
