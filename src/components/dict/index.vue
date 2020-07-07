<template>
  <div v-if="$store.state.user.menuList">
    <el-button type="primary" v-for="item in $store.state.user.menuList[this.$route.path]" :key="item.id" v-if="item.statusName === '启用'"
      @click="btn(item.code)">
      {{item.name}}
    </el-button>
    <el-row style="padding: 10px 0;">
      <el-col :span="20">
        <el-input v-model="names" placeholder="字典名"></el-input>
      </el-col>
      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click="getDictList()">搜索</el-button>
      </el-col>
      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <div v-if="tableData" style="padding: 20px 0;">
      <el-table :data="tableData" row-key="id" style="width: 100%;margin-top:20px;" border :highlight-current-row="!!cellData" @cell-click="cellTable">
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="detail" label="详情">
        </el-table-column>
        <el-table-column prop="id" label="字典id">
        </el-table-column>
      </el-table>
    </div>

    <!-- 功能项对话框 -->
    <div>
      <dict-add :type="btnTyep['dictAdd']" :changeCell="showAdd" :tname="'dictAdd'" v-show="btnTyep['dictAdd']"></dict-add>
      <dict-update :type="btnTyep['dictEdit']" :changeCell="showAdd" :tname="'dictEdit'" :userInfo="cellData" v-show="btnTyep['dictEdit']"></dict-update>
    </div>
  </div>
</template>

<script>
  import {
    http,
    dictList,
    dict
  } from '@/api/api.js'
  import DictAdd from './DictAdd.vue'
  import DictUpdate from './DictUpdate.vue'
  export default {
    data() {
      return {
        tableData: [], //字典列表
        names: '', //搜索的名字
        btnTyep: { //功能对话框状态
          dictAdd: false, //添加字典
          dictEdit: false //修改字典
        },
        cellData: '', //被点击的单元格
      }
    },
    components: {
      DictAdd,
      DictUpdate
    },
    mounted() {
      this.getDictList()
    },
    methods: {
      //格式化状态
      fatStatus(row, column, cellValue, index) {
        if (cellValue === 0) {
          return '弃用'
        } else if (cellValue === 1) {
          return '启用'
        } else if (cellValue === 2) {
          return '删除'
        }
      },
      //功能项的对话框回调
      showAdd(val) {
        this.getDictList()
        this.cellData = ''
        this.btnTyep[val] = false
      },
      //点击选中的字典
      cellTable(row) {
        if (row === this.cellData) return
        this.cellData = row
      },
      // 功能项点击
      btn(val) {
        if (val === 'dictAdd') {
          this.btnTyep[val] = true
        } else {
          if (this.cellData === '') {
            this.$message.error('请选择你需要操作的菜单');
          } else {
            if (val === 'dictDelete') {
              this.$confirm('确定要删除字典 (' + this.cellData.name + ') 吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$http.delete(http + dict, {
                  params: {
                    id: this.cellData.id
                  }
                }).then((data) => {
                  if (data.data.success) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getDictList()
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
        this.getDictList()
      },
      //获取字典信息
      getDictList() {
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const params = {
          name: this.names
        }
        this.$http.get(http + dictList, {
          params
        }).then((data) => {
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
