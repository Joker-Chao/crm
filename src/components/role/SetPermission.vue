<template>
  <div>
    <el-dialog title="分配权限" :visible.sync="cellType" @close="changeCell(tname)" @open="getMenuTree">{{checkedIds}}
      <div v-if="permissionInfo && checkedIds">
        <el-tree
          ref="permissionTree"
          :data="permissionInfo"
          show-checkbox
          node-key="id"
          :default-expanded-keys="checkedIds"
          :default-checked-keys="checkedIds"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cellType = false">取 消</el-button>
        <el-button type="primary" @click="btnRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {http,menuTree,savePermission} from '@/api/api.js'
  export default{
    props: ['type','changeCell','tname','userInfo'],
    data(){
      return{
        cellType: this.type,
        permissionInfo: '', //权限信息
        checkedIds: '',  //当前已有的权限
        defaultProps:{
          children: 'children',
          label: 'name'
        }
      }
    },
    watch:{
      type(newVal){
        this.cellType = newVal
      }
    },
    methods:{
      btnRole(){
        const checkNodes = [...this.$refs.permissionTree.getCheckedKeys(),...this.$refs.permissionTree.getHalfCheckedKeys()]
        this.$http.post(http+savePermission,{
            roleId: this.userInfo.id,
            permissions: checkNodes.toString()
        },{emulateJSON:true}).then((data) => {
          if(data.data.success){
            this.checkedIds = ''
            this.permissionInfo = ''
            this.cellType = false
          }else{
            this.$message.error(data.data.message)
          }
        },(err) => {
          console.error(err.data.message)
        })
      },
      getMenuTree(){
        this.$http.get(http+menuTree,{
          params: {
            roleId: this.userInfo.id
          }
        }).then((data) => {
          if(data.data.success){
            this.permissionInfo = data.data.data.treeData
            this.checkedIds = data.data.data.checkedIds
          }else{
            this.$message.error(data.data.message)
          }
        },(err) => {
          console.error(err.data.message)
        })
      },
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
