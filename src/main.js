import Vue from 'vue'
import resource from 'vue-resource'
import echarts from 'echarts'
import store from './store/index.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index.js'
import App from './App.vue'

// 把echarts添加到vue实例中
Vue.prototype.$echarts = echarts

Vue.use(resource)
Vue.use(ElementUI);

//判断用户是否登录
if(localStorage.token){
  // 登录成功
  // 设置请求头
  Vue.http.headers.common['Authorization'] = localStorage.token
}else{
  // 登录失败
  location.href = './login.html'
}

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
