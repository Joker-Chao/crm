<template>
  <div>
    <el-dialog title="修改文章" :visible.sync="cellType" @close="cloesCell" @open="openCell">{{form}}
      <el-form ref="form" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item label="标题">
              <el-input v-model="form.title" placeholder="标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="选择类型">
              <el-select v-model="form.idChannel" placeholder="类型" v-if="optChannel">
                <el-option v-for="item in optChannel" :label="item.name" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div>
      <div ref="editor" class="editor" v-model="editor"></div>
    </div>
    <div style="margin: 20px; text-align: right;">
      <el-button type="primary" @click="uptxt">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {
    http,
    dict
  } from '@/api/api.js'
  export default {
    props: ['type', 'changeCell', 'tname', 'userInfo'],
    data() {
      return {
        cellType: this.type,
        formType: {
          title: '', //标题
          idChannel: '' //类型
        },
        optChannel: '',
        editor: '',
        file: '',
        form: ''
      }
    },
    watch: {
      type(newVal) {
        this.cellType = newVal
      },
      userInfo(newVal){
        let json = {}
        for(let i in this.formType){
          this.$set(json,i,this.userInfo[i].toString())
        }
        this.form = json
      }
    },
    methods: {
      openCell() {
        this.$nextTick(() => {
          this.fileLoad()
        })
      },
      fileLoad(){
        this.editor = new wangeditor(this.$refs.editor);
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.uploadImgServer = '/upload'
        // 限制一次最多上传 1 张图片
        this.editor.customConfig.uploadImgMaxLength = 5
        this.editor.customConfig.customUploadImg = (files, insert) => {
          // files 是 input 中选中的文件列表
          // insert 是获取图片 url 后，插入到编辑器的方法
          let arr = []
          for(let i in files){
            arr.push(publicImg + files[i].name)
          }
          this.file = arr
          insert(arr)

        }
        this.editor.create();
      },
      upFile(){
        if(this.file == ''){
          return
        }
        let d = new FormData
        for(let i in this.file){
          d.append('file',this.file[i])
        }
        this.$http.post(http + file,d,{
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.token
          }
        }).then((data) => {
          if(data.data.success){
              this.$message.success('上传成功')
            }else{
              this.$message.error(data.data.message)
            }
          },(err) => {
            console.error(err.data.message)
        })
      },
      cloesCell() {
        this.cellType = false
        this.changeCell(this.tname)
      },
      uptxt(){
        let flag = true
        for (let i in json) {
          if (json[i] === '') {
            flag = false
          }
        }
        if (flag) {
          const json = {
            id: this.userInfo.id,
            author: this.$store.state.user.info.profile.name,
            content: this.editor.txt.html().replace(/\%/g,'%25'),
            idChannel: this.form.idChannel,
            Title: this.form.title
          }
          this.$http.post(http + article,JSON.stringify(json)).then((data) => {
            if(data.data.success){
              console.log(data.data.data)
              this.upFile()
            }else{
              this.$message.error(data.data.message)
            }
          },(err) => {
            console.error(err.data.message)
          })
        } else {
          this.$message({
            message: '请输入完整的信息',
            type: 'warning'
          })
        }
      },
      getChannelList (){
        this.$http.get(http + channelList).then((data) => {
          if(data.data.success){
            this.optChannel = data.data.data
          }else{
            this.$message.error(data.data.message)
          }
        },(err) => {
          console.error(err.data.message)
        })
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
