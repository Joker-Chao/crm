<template>
  <div>
    <el-dialog title="添加菜单" :visible.sync="cellType" @close="cloesCell">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="字典名称">
          <el-input v-model="form.dictName"></el-input>
        </el-form-item>
        <el-row v-if="dictDetial.length > 0">
          <el-form-item label="字典详情"></el-form-item>
          <div v-for="(item,index) in dictDetial">
            <el-col :span="9">
              <el-form-item label="状态码">
                <el-input v-model="item.status"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="含义">
                <el-input v-model="item.content"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align: center;">
              <el-button type="danger" @click="dictDetial.splice(index,1)">移除</el-button>
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
        form: { //添加字典所需数据
          dictName: ''   //字典名字
        },
        dictDetial: []
      }
    },
    watch: {
      type(newVal) {
        this.cellType = newVal
      }
    },
    methods: {
      cloesCell(){
        this.form.dictName = ''   //字典名字
        this.dictDetial = []
        this.cellType = false

        this.changeCell(this.tname)
      },
      addStatus() {
        this.dictDetial.push({status: '',content: ''})
      },
      changeTypeDict(){
        let str = ''
        for(let i in this.dictDetial){
          str += this.dictDetial[i].status + ':' + this.dictDetial[i].content + ';'
        }
        return str
      },
      addMenu() {
        let flag = true
        for (let i in this.form) {
          if (this.form[i] === '') {
            flag = false
          }
        }
        if (flag) {
          if(this.dictDetial.length === 0){
            this.$message({
              message: '请添加字典详情',
              type: 'warning'
            })
            return
          }
          for (let i in this.dictDetial) {
            if (this.dictDetial[i].status === '' || this.dictDetial[i].content === '') {
              this.$message({
                message: '请输入字典详情内容',
                type: 'warning'
              })
              return
            }
          }
       
          const res = `?dictName=${this.form.dictName}&dictValues=${this.changeTypeDict(this.dictDetial)}`
          this.$http.post(http + dict + res).then((data) => {
            if (data.data.success) {
              this.cloesCell()
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
