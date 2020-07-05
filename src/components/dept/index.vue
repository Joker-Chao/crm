<template>
  <div v-if="$store.state.user.menuList">
    <el-button type="primary" v-for="item in $store.state.user.menuList[this.$route.path]" :key="item.id" v-if="item.statusName === '启用'" @click="btn(item.code)">
      {{item.name}}
    </el-button>
    <el-table :data="tableData" style="width: 100%;top: 20px;" row-key="id" @cell-click="cellTable" :highlight-current-row="!!cellData" border :tree-props="{children: 'children'}">
      <el-table-column prop="fullname" sortable label="部门全称">
      </el-table-column>
      <el-table-column prop="simplename" sortable label="部门简称">
      </el-table-column>
      <el-table-column prop="id" sortable label="部门id">
      </el-table-column>
    </el-table>
    <!-- 功能项对话框 -->
    <div>
      <dept-add :type="btnTyep['deptAdd']" :changeCell="showAdd" :tname="'deptAdd'" :userInfo="cellData" v-show="btnTyep['deptAdd']"></dept-add>
      <dept-update :type="btnTyep['deptEdit']" :changeCell="showAdd" :tname="'deptEdit'" :userInfo="cellData" v-show="btnTyep['deptEdit']"></dept-update>
    </div>
  </div>
</template>

<script>
  import {
    http,
    deptList,
    editDept
  } from '@/api/api.js'
  import DeptAdd from './DeptAdd.vue'
  import DeptUpdate from './DeptUpdate.vue'
  export default {
    data() {
      return {
        tableData: [], //部门列表
        names: '', //搜索的名字
        btnTyep: { //功能对话框状态
          deptAdd: false, //添加部门
          deptEdit: false //修改部门
        },
        cellData: '', //被点击的单元格
      }
    },
    components: {
      DeptAdd,
      DeptUpdate
    },
    mounted() {
      this.getDeptList()
    },
    methods: {
      //功能项的对话框回调
      showAdd(val) {
        this.getDeptList()
        this.cellData = ''
        this.btnTyep[val] = false
      },
      //点击选中的部门
      cellTable(row) {
        if (row === this.cellData) return
        this.cellData = row
      },
      // 功能项点击
      btn(val) {
        if (val === 'deptAdd') {
          this.btnTyep[val] = true
        } else {
          if (this.cellData === '') {
            this.$message.error('请选择你需要操作的部门');
          } else {
            if (val === 'deptDelete') {
              this.$confirm('确定要删除 (' + this.cellData.fullname + ') 部门吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$http.delete(http + editDept,{
                  params:{
                    id: this.cellData.id
                  }
                }).then((data) => {
                  if (data.data.success) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getDeptList()
                    this.cellData = ''
                  } else {
                    this.$message.error(data.data.message)
                  }
                },(err) => {
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
      //获取角色信息
      getDeptList() {
        this.$http.get(http + deptList).then((data) => {
          if (data.data.success) {
            this.tableData = data.data.data
          } else {
            this.$message.error(data.data.message)
          }
        }, (err) => {
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
