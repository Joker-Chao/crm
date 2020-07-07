<template>
  <div v-if="$store.state.user.menuList">
    <el-button type="primary" v-for="item in $store.state.user.menuList[this.$route.path]" :key="item.id" v-if="item.statusName === '启用'"
      @click="btn(item.code)">
      {{item.name}}
    </el-button>
    <el-row style="margin: 20px 0;">
      <el-col :span="5">
        <el-input v-model="title" placeholder="标题"></el-input>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-input v-model="author" placeholder="作者"></el-input>
      </el-col>
      <el-col :span="6" :offset="2">
        <el-date-picker v-model="dates" type="datetimerange" value-format="yyyyMMddHHmmss" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-col>
    </el-row>
    <div>
      <el-button type="primary" @click="getArticleList(1)">搜索</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
    </div>
    <div v-if="tableData" style="padding: 20px 0;">
      <el-table :data="tableData" style="width: 100%;top: 20px;" row-key="id" @cell-click="cellTable"
        :highlight-current-row="!!cellData">
        <el-table-column prop="id" label="id">
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="author" label="作者">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total" style="text-align: center;margin-top: 20px;">
      <el-pagination background layout="prev, pager, next" :page-size="10" :total="total" @current-change="changePage">
      </el-pagination>
    </div>
    <!-- 功能项对话框 -->
    <div>
      <article-update :type="btnTyep['update']" :changeCell="showAdd" :tname="'update'" :userInfo="cellData" v-show="btnTyep['update']"></article-update>
    </div>
  </div>
</template>

<script>
  import {
    http,
    articleList,
    article
  } from '@/api/api.js'
  import ArticleUpdate from './ArticleUpdate.vue'
  export default {
    data() {
      return {
        tableData: [], //文章列表
        total: 0, //总页数
        currentPage: 1,
        btnTyep: { //功能对话框状态
          update: false //修改部门
        },
        cellData: '', //被点击的单元格
        title: '', //标题
        author: '', //作者
        dates: '' //日期
      }
    },
    components: {
      ArticleUpdate
    },
    mounted() {
      this.getArticleList(1)
    },
    methods: {
      //功能项的对话框回调
      showAdd(val) {
        this.getArticleList(this.currentPage)
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
        if (this.cellData === '') {
          this.$message.error('请选择你需要操作的部门');
        } else {
          if (val === 'deleteArticle') {
            this.$confirm('确定要删除文章 (' + this.cellData.title + ') 吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.delete(http + article, {
                params: {
                  id: this.cellData.id
                }
              }).then((data) => {
                if (data.data.success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getArticleList(this.currentPage)
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
      },
      //重置
      reset() {
        this.title = ''
        this.total = 0
        this.author = ''
        this.dates = ''
        this.changePage(1)
      },
      changePage(page) {
        this.currentPage = page
        this.getArticleList(this.currentPage)
      },
      //获取角色信息
      getArticleList(page) {
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const params = {
          title: this.title,
          author: this.author,
          startDate: this.dates[0],
          endDate: this.dates[1],
          limit: 6,
          page
        }
        this.$http.get(http + articleList, {
          params
        }).then((data) => {
          if (data.data.success) {
            this.tableData = data.data.data.records
            this.total = data.data.data.total
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
