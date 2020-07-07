<template>
  <div v-if="$store.state.user.menuList">
    <el-button type="primary" v-for="item in $store.state.user.menuList[this.$route.path]" :key="item.id" v-if="item.statusName === '启用'"
      @click="btn(item.code)">
      {{item.name}}
    </el-button>
    <el-row style="padding: 10px 0;">
      <el-col :span="20">
        <el-input v-model="names" placeholder="角色名"></el-input>
      </el-col>
      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click="getRoleList()">搜索</el-button>
      </el-col>
      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <div v-if="tableData" style="padding: 20px 0;">
      <el-table :data="tableData" style="width: 100%" @cell-click="cellTable" :highlight-current-row="!!cellData">
        <el-table-column label="角色名称" prop="name">
        </el-table-column>
        <el-table-column label="部门名称" prop="deptName">
        </el-table-column>
        <el-table-column label="角色id" prop="id">
        </el-table-column>
      </el-table>
    </div>
    <!-- 功能项对话框 -->
    <div>
      <role-add :type="btnTyep['roleAdd']" :changeCell="showAdd" :tname="'roleAdd'" v-show="btnTyep['roleAdd']"></role-add>
      <role-update :type="btnTyep['roleEdit']" :changeCell="showAdd" :tname="'roleEdit'" :userInfo="cellData" v-show="btnTyep['roleEdit']"></role-update>
      <set-permission :type="btnTyep['roleSetAuthority']" :changeCell="showAdd" :tname="'roleSetAuthority'" :userInfo="cellData"
        v-show="btnTyep['roleSetAuthority']"></set-permission>
    </div>

  </div>
</template>

<script>
  import {
    http,
    roleList,
    editRole
  } from '@/api/api.js'
  import RoleAdd from './RoleAdd.vue'
  import RoleUpdate from './RoleUpdate.vue'
  import SetPermission from './SetPermission.vue'
  export default {
    data() {
      return {
        tableData: [], //角色列表
        names: '', //搜索的名字
        btnTyep: { //功能对话框状态
          roleAdd: false, //添加角色
          roleEdit: false, //修改角色
          roleSetAuthority: false //配置权限
        },
        cellData: '', //被点击的单元格
      }
    },
    components: {
      RoleAdd,
      RoleUpdate,
      SetPermission
    },
    mounted() {
      this.getRoleList()
    },
    methods: {
      //功能项的对话框回调
      showAdd(val) {
        this.getRoleList()
        this.cellData = ''
        this.btnTyep[val] = false
      },
      //点击选中的角色
      cellTable(row) {
        if (row === this.cellData) return
        this.cellData = row
      },
      // 功能项点击
      btn(val) {
        if (val === 'roleAdd') {
          this.btnTyep[val] = true
        } else {
          if (this.cellData === '') {
            this.$message.error('请选择你需要操作的角色');
          } else {
            if (val === 'roleDelete') {
              this.$confirm('确定要删除角色' + this.cellData.name + '吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$http.delete(http + editRole, {
                  params: {
                    roleId: this.cellData.id
                  }
                }).then((data) => {
                  if (data.data.success) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getRoleList()
                    this.cellData = ''
                  } else {
                    this.$message.error(data.data.message)
                  }
                }, (err) => {
                  console.error(err.data.message)
                })
              }).catch(() => {
                this.cellData = ''
              })
            } else {
              this.btnTyep[val] = true
            }
          }
        }
      },
      //重置
      reset() {
        this.names = ''
        this.cellData = ''
        this.getRoleList()
      },
      //获取角色信息
      getRoleList() {
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const params = {
          name: this.names
        }
        this.$http.get(http + roleList, {
          params
        }).then((data) => {
          if (data.data.success) {
            console.log(data.data)
            this.tableData = data.data.data
          } else {
            this.$message.error(data.data.message)
          }
        }, (err) => {
          console.error(err.data.message)
        })
        setTimeout(() => {
          loading.close();
        }, 1000);
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
