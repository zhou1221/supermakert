<template>
    <div class="inventoryManage">
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>库存管理</span>
        
            </div>
            <div  class="text item">
             <el-form :inline="true" :model="classify" class="demo-form-inline">
                <el-form-item label="活动区域">
                    <el-select v-model="classify.region" placeholder="活动区域">
                    <el-option label="体育用品" value="体育用品"></el-option>
                    <el-option label="生活用品" value="生活用品"></el-option>
                    <el-option label="食品" value="食品"></el-option>
                    <el-option label="服饰" value="服饰"></el-option>
                    </el-select>
                </el-form-item>


                  <el-form-item label="关键字">
                    <el-input v-model="classify.user" placeholder="输入关键字"></el-input>
                    <span>(商品名称，条形码)</span>
                </el-form-item>

   <el-form-item>
    <el-button type="primary" @click="onSubmit">查询</el-button>
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
            classify:{}
        }
    },
    methods:{
        onSubmit(){

        }
    }

}
</script>

<style lang="less">
@import './inventoryManage.less';



</style>
