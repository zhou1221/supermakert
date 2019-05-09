<template>
  <div class="goods-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品管理</span>
      </div>
      <div class="text item">
        <el-form
          :model="goodsForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >



              <!--  所属分类-->
   <el-form-item label="所属分类" prop="userGroup">
    <el-select v-model="goodsForm.userGroup" placeholder="请选择用户组">
    <el-option label="体育用品" value="体育用品"></el-option>
    <el-option label="生活用品" value="生活用品"></el-option>
    <el-option label="食品" value="食品"></el-option>
    <el-option label="服饰" value="服饰"></el-option>

    </el-select>
</el-form-item>

                       <!-- 商品条形码 -->
          <el-form-item label="商品条形码" prop="barcode">
            <el-input type="text" v-model="goodsForm.barcode" auto-complete="off"></el-input>&emsp;
        <el-button type="success" >生成条形码</el-button>
          </el-form-item>


                  <!-- 商品名称 -->
          <el-form-item label="商品名称" prop="goodsname">
            <el-input type="text" v-model="goodsForm.goodsname" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 商品售价 -->
          <el-form-item label="商品售价" prop="sellingprice">
            <el-input type="text" v-model.number="goodsForm.sellingprice"></el-input>元
          </el-form-item>
          <!--市场售价  -->
          <el-form-item label="市场售价" prop="marketprice">
            <el-input type="text" v-model.number="goodsForm.marketprice"></el-input>元
            <p>默认市场价为售价1.2倍</p>
          </el-form-item>

          <!--商品进价  -->
          <el-form-item label="商品进价" prop="buysprice">
            <el-input type="text" v-model.number="goodsForm.buysprice"></el-input>元
          </el-form-item>
          <!-- 入库数量 -->
          <el-form-item label="入库数量" prop="amount">
            <el-input type="text" v-model.number="goodsForm.amount"></el-input>

          </el-form-item>

          <!--  商品重量-->
          <el-form-item label="商品重量" prop="weight">
            <el-input type="text" v-model.number="goodsForm.weight"></el-input>
            <p>记重商品为千克</p>
          </el-form-item>

          <!-- 商品单位 -->
          <el-form-item label="商品单位" prop="units">
            <el-input type="text" v-model="goodsForm.units"></el-input>
          </el-form-item>

                  <!-- 会员优惠 -->
          <el-form-item label="会员优惠" prop="vip">
            <el-radio-group v-model="goodsForm.vip">
              <el-radio label="享受"></el-radio>
              <el-radio label="不享受"></el-radio>
            </el-radio-group>
          </el-form-item>
                  <!-- 是否促销 -->
          <el-form-item label="是否促销" prop="discount">
            <el-radio-group v-model="goodsForm.discount">
              <el-radio :label="1" >启用</el-radio>
              <el-radio :label="2" >禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="商品简介" prop="words">

                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="goodsForm.words">
                </el-input>
                <p>不超过200字</p>
          </el-form-item>




          <!-- 按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm()">添加</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsForm: {
            userGroup:"",
            barcode:"",
            goodsname:"",
            sellingprice:"",
            marketprice:"",
            buysprice:"",
            amount:"",
            weight:"",
            units:"",
            vip:"",
            discount:"",
            words:""
    },
      rules:{
          userGroup:[
              {required:"true",message:"请选择用户组",trigger:"blur"}
          ],
          barcode:[
              {required:"true",message:"请设置条形码",trigger:"blur"}
          ],
          goodsname:[
              {required:"true",message:"请输入商品名称",trigger:"blur"}
          ],
          sellingprice:[
              {required:"true",message:"请输入商品售价",trigger:"blur"},
              {type:"number",message:"必须为数字值",trigger:"blur"}

          ],
    
          marketprice:[
              {type:"number",message:"必须为数字值",trigger:"blur"}
          ],
          buysprice:[
              {type:"number",message:"必须为数字值",trigger:"blur"}
          ],
          amount:[
               {type:"number",message:"必须为数字值",trigger:"blur"}

          ],
          weight:[
            {type:"number",message:"必须为数字值",trigger:"blur"}
    
          ],
          units:[{required:"false"}

          ],
          vip:[
              {required:"true",message:"请选择一项",trigger:"blur"}

          ],
          discount:[
             {required:"true",message:"请选择一项",trigger:"blur"}
          ]
      }
    };
  },
  methods: {
    submitForm() {
        this.$refs.ruleForm.validate((value)=>{
            if(value){
                let obj={
                      userGroup:this.goodsForm.userGroup,
                      barcode:this.goodsForm.barcode,
                      goodsname:this.goodsForm.goodsname,
                      sellingprice:this.goodsForm.sellingprice,
                      marketprice:this.goodsForm.marketprice,
                      buysprice:this.goodsForm.buysprice,
                      amount:this.goodsForm.amount,
                      weight:this.goodsForm.weight,
                      units:this.goodsForm.units,
                      vip:this.goodsForm.vip,
                      discount:this.goodsForm.discount,
                      words:this.goodsForm.words
              
                }
                console.log("验证成欧诺");
                console.log(obj);
                

                this.request.post("/goods/goodsAdd",obj)
                .then(res=>{
              
                  let {code,reason}=res;
                  if(code===0){
                        this.$message({
                            type: 'success',
                            message:reason
                          });
                          // 路由跳转页面
                      this.$router.push("/home/goodsmanage")  

                  }else if(code===1){
                        this.$message.error(reason)
                  }
                  
                }).catch(err=>{
                  console.log(err);
                  
                })

            }else{
             this.$message({
            type: 'info',
            message: '添加商品失败'
          }); 
                
            }
           
            
        })
    },
    resetForm() {
        this.$refs.ruleForm.resetFields()
      
    }
  }
};
</script>
<style lang="less">
@import "./goodsAdd.less";
</style>