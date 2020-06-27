<template>
  <div v-if="$store.state.user.menuList">
    <el-button type="primary" v-for="item in $store.state.user.menuList[this.$route.path]" :key="item.id" v-if="item.statusName === '启用'">
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
      <el-table :data="tableData" style="width: 100%">
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
  </div>
</template>

<script>
  import {http,operationList,userList} from '@/api/api.js'
  export default {
    data() {
      return {
        tableData: [], //用户列表
        total: '', //总页数
        names: '' //搜索的名字
      }
    },
    mounted() {
      this.getOperationList()
      this.getUserlist(1)
    },
    methods: {
      reset(){
        this.names = ''
        this.getUserlist(1)
      },
      changePage(page){
        this.getUserlist(page)
      },
      getUserlist(page){
        const params = {
          page,
          limit: 6,
          name: this.names
        }
        this.$http.get(http + userList,{params}).then((data) => {
          this.tableData = data.data.data.records
          this.total = data.data.data.total
          console.log(data.data.data)
        },(err) => {
          location.href = './login.html'
        })
      },
      getOperationList() {
        this.$http.get(http + operationList).then((data) => {
          const res = data.data.data
          const result = {}
          res.forEach(item => {
            item.children.forEach(val => {
              this.$set(result, val.url, val.children)
            })
          })
          this.$store.commit('setMenuList', result)
          // console.log(result)
          // console.log(this.$store.state.user.menuList[this.$route.path])
        }, (err) => {
          location.href = "./login.html"
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
