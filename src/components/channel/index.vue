<template>
  <div v-if="$store.state.user.menuList">
    <el-button type="primary" v-for="item in $store.state.user.menuList[this.$route.path]" :key="item.id" v-if="item.statusName === '启用'"
      @click="btn(item.code)">
      {{item.name}}
    </el-button>
    <div v-if="tableData" style="padding: 20px 0;">
      <el-table :data="tableData" row-key="id" style="width: 100%;margin-top:20px;" border :highlight-current-row="!!cellData" @cell-click="cellTable">
        <el-table-column prop="name" label="分类名称">
        </el-table-column>
        <el-table-column prop="code" label="类型编码">
        </el-table-column>
        <el-table-column prop="id" label="分类id">
        </el-table-column>
        <el-table-column prop="modifyTime" label="更新时间">
        </el-table-column>
      </el-table>
    </div>
    <!-- 功能项对话框 -->
    <div>
      <channel-add :type="btnTyep['channeladd']" :changeCell="showAdd" :tname="'channeladd'" v-show="btnTyep['channeladd']"></channel-add>
      <channel-update :type="btnTyep['channelEdit']" :changeCell="showAdd" :tname="'channelEdit'" :userInfo="cellData" v-show="btnTyep['channelEdit']"></channel-update>
    </div>
  </div>
</template>

<script>
  import {
    http,
    channelList,
    channel
  } from '@/api/api.js'
  import ChannelAdd from './ChannelAdd.vue'
  import ChannelUpdate from './ChannelUpdate.vue'
  export default {
    data() {
      return {
        tableData: [], //字典列表
        names: '', //搜索的名字
        btnTyep: { //功能对话框状态
          channeladd: false, //添加字典
          channelEdit: false //修改字典
        },
        cellData: '', //被点击的单元格
      }
    },
    components: {
      ChannelAdd,
      ChannelUpdate
    },
    mounted() {
      this.getChannelList()
    },
    methods: {
      //功能项的对话框回调
      showAdd(val) {
        this.getChannelList()
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
        if (val === 'channeladd') {
          this.btnTyep[val] = true
        } else {
          if (this.cellData === '') {
            this.$message.error('请选择你需要操作的菜单');
          } else {
            if (val === 'channelDelete') {
              this.$confirm('确定要删除字典 (' + this.cellData.name + ') 吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$http.delete(http + channel, {
                  params: {
                    id: this.cellData.id
                  }
                }).then((data) => {
                  if (data.data.success) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getChannelList()
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
      //获取字典信息
      getChannelList() {
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const params = {
          name: this.names
        }
        this.$http.get(http + channelList, {
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
