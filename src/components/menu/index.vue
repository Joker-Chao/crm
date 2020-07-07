<template>
  <div v-if="$store.state.user.menuList">
    <el-button type="primary" v-for="item in $store.state.user.menuList[this.$route.path]" :key="item.id" v-if="item.statusName === '启用'" @click="btn(item.code)">
      {{item.name}}
    </el-button>
    <el-table :data="tableData" style="width: 100%;top: 20px;" row-key="id" @cell-click="cellTable" :highlight-current-row="!!cellData" border :tree-props="{children: 'children'}">
      <el-table-column prop="name" sortable label="菜单名称">
      </el-table-column>
      <el-table-column prop="url" sortable label="链接标识">
      </el-table-column>
      <el-table-column prop="isMenuName" sortable label="是否是菜单">
      </el-table-column>
      <el-table-column prop="status" sortable label="状态" :formatter="fatStatus">
      </el-table-column>
      <el-table-column prop="id" sortable label="菜单id">
      </el-table-column>
    </el-table>
    <!-- 功能项对话框 -->
    <div>
      <menu-add :type="btnTyep['menuAdd']" :changeCell="showAdd" :tname="'menuAdd'" :userInfo="cellData" v-show="btnTyep['menuAdd']"></menu-add>
      <menu-update :type="btnTyep['menuEdit']" :changeCell="showAdd" :tname="'menuEdit'" :userInfo="cellData" v-show="btnTyep['menuEdit']"></menu-update>
    </div>
  </div>
</template>

<script>
  import {
    http,
    operationList,
    editMenu
  } from '@/api/api.js'
  import MenuAdd from './MenuAdd.vue'
  import MenuUpdate from './MenuUpdate.vue'
  export default {
    data() {
      return {
        tableData: [], //部门列表
        names: '', //搜索的名字
        btnTyep: { //功能对话框状态
          menuAdd: false, //添加部门
          menuEdit: false //修改部门
        },
        cellData: '', //被点击的单元格
      }
    },
    components: {
      MenuAdd,
      MenuUpdate
    },
    mounted() {
      this.getMenuList()
    },
    methods: {
      //格式化状态
      fatStatus(row, column, cellValue, index){
        if(cellValue === 0){
          return '弃用'
        }else if(cellValue === 1){
          return '启用'
        }else if(cellValue === 2){
          return '删除'
        }
      },
      //功能项的对话框回调
      showAdd(val) {
        this.getMenuList()
        this.cellData = ''
        this.btnTyep[val] = false
      },
      //点击选中的菜单
      cellTable(row) {
        if (row === this.cellData) return
        this.cellData = row
      },
      // 功能项点击
      btn(val) {
        if (val === 'menuAdd') {
          this.btnTyep[val] = true
        } else {
          if (this.cellData === '') {
            this.$message.error('请选择你需要操作的菜单');
          } else {
            if (val === 'menuDelete') {
              this.$confirm('确定要删除菜单 (' + this.cellData.name + ') 吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$http.delete(http + editMenu,{
                  params: {
                    id: this.cellData.id
                  }
                }).then((data) => {
                  if (data.data.success) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getMenuList()
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
      //获取菜单信息
      getMenuList() {
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http.get(http + operationList).then((data) => {
          if (data.data.success) {
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
