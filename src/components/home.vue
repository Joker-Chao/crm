<template>
  <div>
    <div id="main" style="width: 800px;height:600px;"></div>
  </div>
</template>

<script>
  import {http,articleList,articleNum} from '../api/api.js'
  export default {
    mounted() {
      this.getArticleData()
    },
    methods:{
      getArticleData(){
        Promise.all([this.$http.get(http+articleList),this.$http.get(http+articleNum)]).then((data) => {
          //获取文章类型
          const articleListData = data[0].data.data.map((res) => {
            return res.name
          })
          // 获取文章数量
          const articleNumData = data[1].data.data.map((res) => {
            return res.articles
          })
          this.viewEcharts(articleListData,articleNumData)
        },(err) => {
          location.href = './login.html'
        })
      },
      viewEcharts(arr1,arr2){
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '文章统计'
          },
          tooltip: {},
          xAxis: {
            data: arr1
          },
          yAxis: {},
          series: [{
            name: '数量',
            type: 'bar',
            data: arr2
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    }
  }
</script>

<style>
</style>
