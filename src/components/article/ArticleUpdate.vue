<template>
  <div>
    <el-dialog title="修改文章" :visible.sync="cellType" @close="changeCell(tname)" @open="openCell">
      <div>
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="标题">
                <el-input v-model="form.title" placeholder="标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择类型">
                <el-select v-model="form.idChannel" placeholder="类型" v-if="optChannel">
                  <el-option v-for="item in optChannel" :label="item.name" :key="item.id" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <div ref="editor" class="editor"></div>
      </div>
      <div style="margin: 20px; text-align: right;">
        <el-button type="primary" @click="uptxt">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    http,
    channelList,
    article,
    file,
    publicImg
  } from '@/api/api.js'
  import wangeditor from 'wangeditor'
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
        form: '',
        publicImg
      }
    },
    watch: {
      type(newVal) {
        this.cellType = newVal
      },
      userInfo(newVal) {
        let json = {}
        for (let i in this.formType) {
          this.$set(json, i, this.userInfo[i])
        }
        this.editor = this.userInfo.content
        this.form = json
      }
    },
    methods: {
      openCell() {
        this.$nextTick(() => {
          this.fileLoad()
          this.getChannelList()
        })
      },
      fileLoad() {
        this.editor = new wangeditor(this.$refs.editor);
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.uploadImgServer = '/upload'
        // 限制一次最多上传 几 张图片
        this.editor.customConfig.uploadImgMaxLength = 5
        this.editor.customConfig.customUploadImg = (files, insert) => {
          // files 是 input 中选中的文件列表
          // insert 是获取图片 url 后，插入到编辑器的方法
          let arr = []
          for (let i in files) {
            arr.push(publicImg + files[i].name)
          }
          this.file = arr
          insert(arr)

        }
        this.editor.create();
        this.editor.txt.html(this.userInfo.content)
      },
      upFile() {
        if (this.file == '') {
          return
        }
        let d = new FormData
        for (let i in this.file) {
          d.append('file', this.file[i])
        }
        this.$http.post(http + file, d, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.token
          }
        }).then((data) => {
          if (data.data.success) {
            this.$message.success('上传成功')
            this.cellType = false
          } else {
            this.$message.error(data.data.message)
          }
        }, (err) => {
          console.error(err.data.message)
        })
      },
      uptxt() {
        const json = {
          id: this.userInfo.id,
          author: this.$store.state.user.info.profile.name,
          content: this.editor.txt.html().replace(/\%/g, '%25'),
          idChannel: this.form.idChannel,
          Title: this.form.title
        }
        let flag = true
        for (let i in json) {
          if (json[i] === '') {
            flag = false
          }
        }
        if (flag) {
          this.$http.post(http + article, JSON.stringify(json)).then((data) => {
            if (data.data.success) {
              this.upFile()
              this.$message({
                message: '提交成功',
                type: 'success'
              });
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
      },
      getChannelList() {
        this.$http.get(http + channelList).then((data) => {
          if (data.data.success) {
            this.optChannel = data.data.data
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

<style scoped>
  /deep/ .el-dialog__header {
    text-align: center;
    font-weight: 700;
    letter-spacing: 5px;
  }

  /deep/ .el-form-item__label {
    text-align: center;
    padding: 0;
  }

  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
</style>
