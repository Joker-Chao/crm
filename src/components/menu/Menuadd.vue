<template>
  <div>
    <el-dialog title="添加菜单" :visible.sync="cellType" @close="changeCell(tname)">
      <el-alert
        style="margin-bottom: 20px;"
        title="介绍"
        type="info"
        close-text=" "
        v-if="userInfo == ''"
        description="当前创建的是一级菜单">
      </el-alert>
      <el-alert
        title="介绍"
        type="info"
        close-text=" "
        v-else
        :description="'当前创建的是 (' + userInfo.name + ')下的子级菜单'">
      </el-alert>
      <el-form ref="form" :model="form" label-width="100px">
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
						<el-radio label="0"></el-radio>
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
        <el-button type="primary" @click="addMenu">确 定</el-button>
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
        form: {  //添加菜单所需数据
          name: '', //菜单名称
          code: '' ,//编码
          component: '', //组件
          url: '', //链接标识
          status: '1', //状态
          ismenu: '0' //是否是菜单
        }
      }
    },
    watch:{
      type(newVal){
        this.cellType = newVal
      }
    },
    methods:{
      addMenu(){
        let flag = true
        for(let i in this.form){
          if(this.form[i] === ''){
            flag = false
          }
        }
        if(flag){
          //上级部门id
          if(this.userInfo == ''){
            this.form.pcode = 0
          }else{
            this.form.pcode = this.userInfo.code
          }
          //排序
          this.form.num = 0
          this.$http.post(http+editMenu,JSON.stringify(this.form),{emulateJSON:true}).then((data) => {
            if(data.data.success){
              this.form = {  //添加菜单所需数据
                name: '', //菜单名称
                code: '' ,//编码
                component: '', //组件
                url: '', //链接标识
                status: '1', //状态
                isMenu: '0' //是否是菜单
             }
              this.cellType = false
            }else{
              this.$message.error(data.data.message)
            }
          },(err) => {
            console.error(err.data.message)
          })
          delete this.form.pcode
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
