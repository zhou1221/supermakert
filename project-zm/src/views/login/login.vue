<template>
  <div class="login">
    <div class="login-from">
        <p><span class="el-icon-menu"></span>超市后台管理系统登录</p>
      <el-form
        :model="user"
        status-icon
        :rules="rules"
        ref="From"
        label-width="100px"
        class="demo-ruleForm"
      >
                   <!-- rules中的字段必须和验证定义的字段名字一致 -->
        <el-form-item label="账号" prop="account">
          <el-input type="text" v-model="user.account" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="text" v-model="user.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button   @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        // 定义密码一致的验证
        const confirmPassword=(rule,value,callback)=>{
            if(value===''){
                callback(new Error('确认密码不能为空'))
            }else if(value!==this.user.password){
                callback(new Error('两次密码不一致'))
            } else{
                callback()
            }
        }
        // 自定义输入密码
        const writePassword=(rule,value,callback)=>{
           if(value===""){
               callback(new Error('请输入密码'))
           }else if(value.length<3 || value.length>6){
            callback(new Error('请输入3-6之间的长度'))
           }else{
               if(this.user.checkPass !==""){// 如果确认密码不为空 
                // 触发一致性验证
                   this.$refs.From.validateField('checkPass')
                          
               }
                callback()           
           }
        }

        return{
            user:{
               account:'',
               password:'',
               checkPass:''
            },
            rules:{
                account: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    {min:3,max:6,message:'账号在3-6个字符之间',trigger:'blur'}
                ],
                password:[
                    // {required:true,message:"请输入密码",trigger:'blur'},
                    // {min:3,max:6,message:"密码在3-6个字符之间",trigger:'blur'}

                    {required:true,validator:writePassword,trigger:'blur'}
                ],
                checkPass:[
                    {required:true,validator:confirmPassword,trigger:'blur'}
                ]
            }
        }
    },
    methods:{
        submitForm(){
            this.$refs.From.validate(valid=>{
            //     // 如果所有前端验证都通过 valid就是true 否则就是false
                if(valid){
            //         // 提交数据给后端

                    let params={
                        account:this.user.account,
                        password:this.user.password
                    }
                        //    把当前登录的用户信息发送给后端进行验证
                    this.request.post("/login/checklogin",params)
                    .then(res=>{
                    //    接收成功的参数及生成的token
                       let {code,reason,token}=res
                       if(code===0){
                           this.$message({
                               type:"success",
                               message:reason
                           })
    /////token///////////////////// 后端生成的token，存入浏览器的本地存储
                          this.local.saveItem("zz",token)
                        //   验证成功进入home 页面
                            this.$router.push('/home')
                       }else if(code===1){
                           this.$message.error(reason)
                       }
                        
                    }
                    ).catch(err=>{
                        console.log(err);
                        
                    })                  
                }else{
                    alert('登录失败')
                    return false
                }
            })              
        },
        resetForm(){
             // 重置表单
             this.$refs.From.resetFields()
       
        }
    }
};

</script>
<style lang="less">

@import './login.less';

</style>

