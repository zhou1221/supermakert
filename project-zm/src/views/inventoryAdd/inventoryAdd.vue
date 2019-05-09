
<template>
<div class="inventoryAdd">


 <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span> 添加库存</span>
   
  </div>
  <!-- 内容 -->
  <div class="text item">

<el-form :model="inventoryFrom" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="商品条形码" prop="barcode">
    <el-input type="text" v-model="inventoryFrom.barcode" auto-complete="off" style="width:200px;"></el-input>
  </el-form-item>
  <el-form-item label="数量" prop="amount">
    <el-input type="text" v-model="inventoryFrom.amount" auto-complete="off" style="width:100px;"></el-input>
  </el-form-item>
  <el-form-item label="进价" prop="buysprice">
    <el-input v-model.number="inventoryFrom.buysprice"  style="width:100px;"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm()">入库</el-button>
    <el-button @click="resetForm()">重置</el-button>
  </el-form-item>
</el-form>



  
  </div>
</el-card>


</div>
    
</template>

<script>
export default {

    data(){
        return{
            inventoryFrom:{
                barcode:"",
                amount:"",
                buysprice:""
            },
            rules:{
                barcode:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                amount:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                buysprice:[
                     {required:true,message:"必填",trigger:"blur"},
                     {type:"number",message:"类型必须为数字",trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        //  入库数据
        submitForm(){

        },
        resetForm(){

        }
    }

}
</script>

<style lang="less">
@import './inventoryAdd.less';
</style>

