<template>
  <div>
    <el-dialog title="添加栏目" :visible.sync="cellType" @close="changeCell(tname)">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="类型名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="类型编码">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    http,
    channel
  } from '@/api/api.js'
  export default {
    props: ['type', 'changeCell', 'tname'],
    data() {
      return {
        cellType: this.type,
        form: { //添加栏目所需数据
          name: '',   //类型名称
          code: ''   //类型编码
        }
      }
    },
    watch: {
      type(newVal) {
        this.cellType = newVal
      }
    },
    methods: {
      addMenu() {
        let flag = true
        for (let i in this.form) {
          if (this.form[i] === '') {
            flag = false
          }
        }
        if (flag) {
          this.$http.post(http + channel, this.form,{emulateJSON: true}).then((data) => {
            if (data.data.success) {
              for(let i in this.form){
                this.form[i] = ''
              }
              this.cellType = false
            } else {
              this.$message.error(data.data.message)
            }
          }, (err) => {
            console.error(err.data.message)
          })
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
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
</style>
