<template>
  <div id="app">
    <el-container>
      <!-- 导航 -->
      <el-aside style="width: auto;">
        <el-menu
        default-active="1-4-1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        v-if="$store.state.menu.menu && $store.state.user.info"
        router>
          <el-menu-item index="/">
            <i class="el-icon-location"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu v-for="item in $store.state.menu.menu" :key="item.uid" :index="item.path">
            <template slot="title">
              <i :class="icontype[item.id]"></i>
              <span slot="title">{{item.name}}{{item.path}}</span>
            </template>
            <el-menu-item v-for="val in item.children" :key="val.uid" :index="val.path" :disabled="!$store.state.user.info.permissions.includes(val.path)">
              <i :class="icontype[val.id]"></i>
              <span slot="title">{{val.name}}{{val.path}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main v-if="$store.state.user.info">
        <div class="content-warpper">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="12">
              <div>
                <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                  <el-radio-button :label="false">展开</el-radio-button>
                  <el-radio-button :label="true">收起</el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="text-align: right;padding-right: 40px;">
                当前账号：
                <router-link to="/user" style="color: aqua;">{{$store.state.user.info.profile.name}}</router-link>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="padding: 10px 20px;">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {http,menuList,user} from './api/api.js'
export default {
  name:'app',
  data(){
    return{
      isCollapse: false,
      icontype: {
        1: 'el-icon-setting',
        2: 'el-icon-tickets',
        4: 'el-icon-user',
        12: 'el-icon-s-custom',
        21: 'el-icon-s-check',
        17: 'el-icon-menu',
        22: 'el-icon-collection',
        41: 'el-icon-s-order',
        46: 'el-icon-document-add',
        42: 'el-icon-document',
        45: 'el-icon-folder-opened'
      }
    }
  },
  mounted(){
    this.getMenu()
    this.getInfo()
  },
  methods: {
    // 获取菜单栏
    getMenu(){
      this.$http.get(http+menuList).then((data) => {
        // console.log(data.data.data)
        this.$store.commit('setMenu',data.data.data)
      },(err) => {
        location.href = './login.html'
      })
    },
    // 获取当前账号信息
    getInfo(){
      this.$http.get(http+user).then((data) => {
        // console.log(data.data.data)
        this.$store.commit('setInfo',data.data.data)
      },(err) => {
        location.href = './login.html'
      })
    }
  }
}
</script>

<style scoped>
.el-main{
  padding: 0;
}
.content-warpper{
  width: auto;
  height: 50px;
  line-height: 50px;
  background-color: #f5f5f5;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 700px;
}
.el-menu-vertical-demo{
  min-height: 500px;
}
</style>
