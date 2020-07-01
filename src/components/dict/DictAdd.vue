<template>
  <div>
    <el-dialog title="添加菜单" :visible.sync="cellType" @close="changeCell(tname)">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="字典名称">
          <el-input v-model="form.dictName"></el-input>
        </el-form-item>
        <el-row v-if="status.length > 0">
          <el-form-item label="字典详情"></el-form-item>
          <div v-for="(item,index) in status">
            <el-col :span="10">
              <el-form-item label="状态码">
                <el-input v-model="item[idnex].status"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="含义">
                <el-input v-model="item[idnex].content"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="danger">移除</el-button>
            </el-col>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addStatus">添加字典详情</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    http,
    dict
  } from '@/api/api.js'
  export default {
    props: ['type', 'changeCell', 'tname'],
    data() {
      return {
        cellType: this.type,
        form: { //添加菜单所需数据
          name: '', //菜单名称
          code: '', //编码
          component: '', //组件
          url: '', //链接标识
          status: '1', //状态
          ismenu: '0' //是否是菜单
        },
        status: []
      }
    },
    watch: {
      type(newVal) {
        this.cellType = newVal
      }
    },
    methods: {
      addStatus() {

      },
      addMenu() {
        let flag = true
        for (let i in this.form) {
          if (this.form[i] === '') {
            flag = false
          }
        }
        if (flag) {
          //排序
          this.form.num = 0
          this.$http.post(http + dict, JSON.stringify(this.form), {
            emulateJSON: true
          }).then((data) => {
            if (data.data.success) {
              this.form = { //添加菜单所需数据
                name: '', //菜单名称
                code: '', //编码
                component: '', //组件
                url: '', //链接标识
                status: '1', //状态
                isMenu: '0' //是否是菜单
              }
              this.cellType = false
            } else {
              this.$message.error(data.data.message)
            }
          }, (err) => {
            console.error(err.data.message)
          })
          delete this.form.pcode
          delete this.form.num
        } else {
          this.$message({
            message: '请输入完整的信息',
            type: 'warning'
          })
        }
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-dialog__header {
    text-align: center;
    font-weight: 700;
    letter-spacing: 5px;
  }
</style>
