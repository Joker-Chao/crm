<template>
  <div>
    <div id="main" style="height:600px;padding-top: 50px;"></div>
  </div>
</template>

<script>
  import {http,channelList,articleNum} from '../api/api.js'
  export default {
    mounted() {
      this.getArticleData()
    },
    methods:{
      getArticleData(){
        Promise.all([this.$http.get(http+channelList),this.$http.get(http+articleNum)]).then((data) => {
          let articleListData,articleNumData
					if(data[0].data.success){
						//获取文章类型
						articleListData = data[0].data.data.map((res) => {
						  return res.name
						})
					}else{
						this.$message.error(data[0].data.message)
					}
          if(data[1].data.success){
            // 获取文章数量
            articleNumData = data[1].data.data.map((res) => {
              return res.articles
            })
          }else{
						this.$message.error(data[1].data.message)
					}
          this.viewEcharts(articleListData,articleNumData)
        },(err) => {
          console.error(err.data.message)
        })
      },
      viewEcharts(arr1,arr2){
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '文章统计',
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {},
          xAxis: {
            data: arr1
          },
          textStyle:{
            color: '#fff'
          },
          yAxis: {},
          series: [{
            name: '数量',
            type: 'line',
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
