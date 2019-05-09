<template>
  <div class="salse-total">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>销售统计</span>
      </div>
      <div class="text item">
      <div class="block">
    <span class="demonstration">选择范围</span>
    <el-date-picker
      v-model="value9"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      default-value="2010-10-01">
    </el-date-picker>
  </div>
      
     <div class="text item">

       <div id="box" style="height:500px">


       </div>
     </div>

      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data(){
    return{
      value9:"ssss"

    }
  },
  // 生命周期钩子函数 适合操作dom
   mounted() {
      // 2019-04-10 2019-04-15
      // 这是后端响应的数据   
      var res = {
          categoryName: ['2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14', '2019-04-15', '2019-04-16'],
          value: [500, 1500, 3000, 2000, 1250, 460, 5000]
      }

      let {categoryName, value} = res;

      this.drawSalesChart(categoryName, value); // 调用函数 生成报表
   },
   methods: {
    // 生成销售报表
    drawSalesChart(categoryData=[], value=[]) {
        // 选中dom容器 初始化
        let myChart = this.echarts.init( document.getElementById('box') )
        // 准备配置
        let option = {
            tooltip: {
                show: true
            },
            legend: {
                data:['销量']
            },
            xAxis : [
                {
                    type : 'category',
                    data : categoryData
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    "name":"销量",
                    "type":"line",
                    "data":value
                }
            ]
        }
        // 使用配置生成报表
        myChart.setOption( option )
    }
   }
};
</script>
<style lang="less">
@import "./salsetotal.less";
</style>