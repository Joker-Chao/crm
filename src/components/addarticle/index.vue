<template>
  <div>
    <div style="margin: 20px;">
      <el-button type="primary">提交</el-button>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="标题">
            <el-input v-model="form.title" placeholder="标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="选择类型">
            <el-select v-model="form.idChannel" placeholder="类型">
              <el-option v-for="item in channelList" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <div ref="editor"></div>
    </div>
  </div>
</template>

<script>
  import wangeditor from 'wangeditor'
  export default{
    data(){
      return{
        form: {
          title: '', //标题
          idChannel: '' //类型
        },
        channelList: ''
      }
    },
    mounted(){
      let editor = new wangeditor(this.$refs.editor);
      editor.create();
    }
  }
</script>

<style>
</style>
