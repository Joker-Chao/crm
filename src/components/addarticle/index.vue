<template>
  <div>
    <div class="title" style="padding: 20px 0">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-input v-model="form.title" placeholder="标题"></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="form.idChannel" placeholder="选择类型" v-if="optChannel">
              <el-option v-for="item in optChannel" :label="item.name" :key="item.id" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="background-color: #fff;">
      <div ref="editor" class="editor"></div>
    </div>
    <div style="margin: 20px; text-align: right;">
      <el-button type="primary" @click="uptxt">提交</el-button>
    </div>
  </div>
</template>

<script>
  import wangeditor from 'wangeditor'
  import {http,channelList,file,article,publicImg} from '@/api/api.js'
  export default{
    data(){
      return{
        form: {
          title: '', //标题
          idChannel: '' //类型
        },
        optChannel: '',
        editor: '',
        file: ''
      }
    },
    mounted(){
      this.fileLoad()
      this.getChannelList()
    },
    methods: {
      fileLoad(){
        this.editor = new wangeditor(this.$refs.editor);
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.uploadImgServer = '/upload'
        // 限制一次最多上传 1 张图片
        this.editor.customConfig.uploadImgMaxLength = 5
        this.editor.customConfig.customUploadImg = (files, insert) => {
          // files 是 input 中选中的文件列表
          // insert 是获取图片 url 后，插入到编辑器的方法
          let d = new FormData
          for(let i in files){
            d.append('file',files[i])
          }
          this.$http.post(http + file,d,{
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': localStorage.token
            }
          }).then((data) => {
            if(data.data.success){
               insert(publicImg + data.data.data.originalFileName)//data.data.data.realFileName
              }else{
                this.$message.error(data.data.message)
              }
            },(err) => {
              console.error(err.data.message)
          })
        }
        this.editor.create();
      },
      uptxt(){
        const json = {
          author: this.$store.state.user.info.profile.name,
          content: this.editor.txt.html().replace(/\%/g,'%25'),
          idChannel: this.form.idChannel,
          title: this.form.title
        }
        console.log(json)
        let flag = true
        for (let i in json) {
          if (json[i] === '') {
            flag = false
          }
        }
        if (flag) {
          this.$http.post(http + article,JSON.stringify(json)).then((data) => {
            if(data.data.success){
              this.$message({
                message: '提交成功',
                type: 'success'
              });
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
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http.get(http + channelList).then((data) => {
          if(data.data.success){
            this.optChannel = data.data.data
          }else{
            this.$message.error(data.data.message)
          }
        },(err) => {
          console.error(err.data.message)
        })
        setTimeout(() => {
          loading.close();
        }, 1000);
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-form-item__label{
    text-align: center;
  }
  .editor{
    position: relative;
    z-index: 1;
  }
  .title{
    position: relative;
    z-index: 2;
  }
</style>
