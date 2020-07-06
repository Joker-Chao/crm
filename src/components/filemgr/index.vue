<template>
  <div v-if="$store.state.user.menuList">
    <el-upload class="upload-demo" drag :action="upFile" multiple :headers="headers" :on-success="success" :on-error="error">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <el-row style="padding: 10px 0;">
      <el-col :span="20">
        <el-input v-model="names"></el-input>
      </el-col>
      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click="getFileList(1)">搜索</el-button>
      </el-col>
      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <div v-if="tableData">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="id" prop="id">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime">
        </el-table-column>
        <el-table-column label="文件预览" prop="realFileName">
          <template slot-scope="scope">
            <img :src="publicImg + scope.row.originalFileName" alt="" style="height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="downloadFile(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total" style="text-align: center;margin-top: 20px;">
      <el-pagination background layout="prev, pager, next" :page-size="6" :total="total" @current-change="changePage">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {
    http,
    fileMgrList,
    fileDownload,
    file,
    publicImg
  } from '@/api/api.js'
  export default {
    data() {
      return {
        tableData: [], //用户列表
        total: 0, //总页数
        names: '', //搜索的名字
        cellData: '', //被点击的单元格
        currentPage: 1, //当前页
        upFile: http + file, //文件上传地址
        //文件上传格式
        headers: {
          'Authorization': localStorage.token
        },
        publicImg
      }
    },
    mounted() {
      this.getFileList(1)
    },
    methods: {
      success(data){
        if (data.success) {
          this.getFileList(this.currentPage)
        } else {
          this.$message.error(data.message)
        }
      },
      error(err){
        console.error(err.message)
      },
      downloadFile(data) {
        location.href = http + fileDownload + '?idFile=' + data.id + '&fileName=' + data.originalFileName
      },
      //重置
      reset() {
        this.names = ''
        this.total = 0
        this.cellData = ''
        this.changePage(1)
      },
      changePage(page) {
        this.currentPage = page
        this.getFileList(this.currentPage)
      },
      //获取用户信息
      getFileList(page) {
        const params = {
          page,
          limit: 6,
          originalFileName: this.names
        }
        this.$http.get(http + fileMgrList, {
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
