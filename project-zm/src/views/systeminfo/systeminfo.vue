<template>
 <div class="systeminfo">
<el-card class="box-card">
    <!-- 头部 -->
  <div slot="header" class="clearfix">
    <span>系统管理</span>
    
  </div>
  <!-- 内容 -->
  <div  class="text item">
<el-alert
    title="消息提示的文案1"
    type="info"
    show-icon>
  </el-alert>
  <br>
  <el-alert
    title="消息提示的文案2"
    type="info"
    show-icon>
  </el-alert>

<el-row>
    <!--  -->
  <el-col :span="12"   class="grid-content">
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>销售排行</span>
  </div>
  <div class="text item">

      <el-table
    :data="sellData"
    style="width: 100%"
    :row-class-name="tableRowClassName"
    >

    <el-table-column
      prop="goodsname"
      label="商品姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="volume"
      label="销量">
    </el-table-column>
  </el-table>

  </div>
</el-card>

  </el-col>

  <!--  右 -->
  <el-col :span="12" class="grid-content" >
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>缺货商品</span>

  </div>
  <div class="text item">
      <el-table
    :data="stockoutData"
    style="width: 100%"
    :row-class-name="tableRowClassName"
    >

    <el-table-column
      prop="goodsname"
      label="商品姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="volume"
      label="入库">
    </el-table-column>

     <el-table-column
      prop="putbox"
      label="操作">
      
   
    </el-table-column>
  </el-table>

  </div>
</el-card>


  </el-col>
</el-row>














  </div>

</el-card>



 </div>

</template>
<script>
export default {

    data(){
        return{
            sellData:
                [
                    {  goodsname:"哈哈哈",volume:"5"},
                    {  goodsname:"哈哈哈",volume:"5"},
                    {  goodsname:"哈哈哈",volume:"5"}

                
                ],
              stockoutData:[
                  {goodsname:"dddd",volume:"5",putbox:"入库"}
              ]
            
        }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    }
    
}
</script>
<style lang="less">
@import "./systeminfo.less";

</style>