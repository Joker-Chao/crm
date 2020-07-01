<template>
  <div v-if="$store.state.user.menuList">
    <el-button type="primary"
    v-for="item in $store.state.user.menuList[this.$route.path]"
    :key="item.id"
    v-if="item.statusName === '启用'"
    @click="btn(item.code)">
      {{item.name}}
    </el-button>
    <el-row style="padding: 10px 0;">
      <el-col :span="20">
        <el-input v-model="names"></el-input>
      </el-col>
      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click="getUserlist(1)">搜索</el-button>
      </el-col>
      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <div v-if="tableData">
      <el-table :data="tableData" style="width: 100%" @cell-click="cellTable" :highlight-current-row="true">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="昵称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="账号">
                <span>{{ props.row.account }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ props.row.sexName }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ props.row.statusName }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ props.row.email }}</span>
              </el-form-item>
              <el-form-item label="部门">
                <span>{{ props.row.deptName }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="name">
        </el-table-column>
        <el-table-column label="账号" prop="account">
        </el-table-column>
        <el-table-column label="状态" prop="statusName">
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total" style="text-align: center;margin-top: 20px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="6"
        :total="total"
        @current-change="changePage">
      </el-pagination>
    </div>
    <!-- 功能项对话框 -->
    <div>
      <mgr-add :type="btnTyep['mgrAdd']" :changeCell="showAdd" :tname="'mgrAdd'" v-show="btnTyep['mgrAdd']"></mgr-add>
      <mgr-update :type="btnTyep['mgrEdit']" :changeCell="showAdd" :tname="'mgrEdit'" :userInfo="cellData" v-show="btnTyep['mgrEdit']"></mgr-update>
      <set-role :type="btnTyep['mgrSetRole']" :changeCell="showAdd" :tname="'mgrSetRole'" :userInfo="cellData" v-show="btnTyep['mgrSetRole']"></set-role>
    </div>

  </div>
</template>

<script>
  import {http,userList,editUser} from '@/api/api.js'
  import MgrAdd from './MgrAdd.vue'
  import MgrUpdate from './MgrUpdate.vue'
  import SetRole from './SetRole.vue'
  export default {
    data() {
      return {
        tableData: [], //用户列表
        total: 0, //总页数
        names: '', //搜索的名字
        btnTyep: {  //功能对话框状态
          mgrAdd: false, //添加用户
          mgrEdit: false, //修改用户
          mgrSetRole: false  //分配角色
        },
        cellData: '', //被点击的单元格
        currentPage: 1
      }
    },
    components:{
      MgrAdd,
      MgrUpdate,
      SetRole
    },
    mounted() {
      this.getUserlist(1)
    },
    methods: {
      //功能项的对话框回调
      showAdd(val){
        this.getUserlist(this.currentPage)
        this.cellData = ''
        this.btnTyep[val] = false
      },
      //点击选中的用户
      cellTable(row){
        if(row === this.cellData) return
        this.cellData = row
      },
      // 功能项点击
      btn(val){
        if(val === 'mgrAdd'){
          this.btnTyep[val] = true
        }else{
          if(this.cellData === ''){
            this.$message.error('请选择你需要操作的用户');
          }else{
            if(val === 'mgrDelete'){
              if(this.cellData.status === 3){
                this.$message.error(this.cellData.name + '已经被删除了，不能再进行删除操作')
                return
              }
              this.$confirm('确定要删除用户' + this.cellData.name + '吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$http.delete(http+editUser,{
                  params : {
                    userId:this.cellData.id
                  }
                }).then((data) => {
                  if(data.data.success){
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getUserlist(this.currentPage)
                    this.cellData = ''
                  }else{
                    this.$message.error(data.data.message)
                  }
                },(err) => {
                  console.error(err.data.message)
                })
              }).catch(() => {
                this.cellData = ''
              })
            }else{
              this.btnTyep[val] = true
            }
          }
        }
      },
      //重置
      reset(){
        this.names = ''
        this.total = 0
        this.cellData = ''
        this.changePage(1)
      },
      changePage(page){
        this.currentPage = page
        this.getUserlist(this.currentPage)
      },
      //获取用户信息
      getUserlist(page){
        const params = {
          page,
          limit: 6,
          name: this.names
        }
        this.$http.get(http + userList,{params}).then((data) => {
          if(data.data.success){
            this.tableData = data.data.data.records
            this.total = data.data.data.total
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

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
