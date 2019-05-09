<template>
 <div class="password-Modify">

   <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>密码修改</span>
 
  </div>
  <div class="text item">
   <el-form :model="changePass" 
             status-icon :rules="rules" 
             ref="changeForm" 
             label-width="100px" 
             class="demo-ruleForm"
             >
  <el-form-item label="原密码" prop="oldPassword">
    <el-input type="text" v-model="changePass.oldPassword"     auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="新密码"      prop="newPassword">
    <el-input type="text" v-model="changePass.newPassword" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="新密码确认"     prop="checkPassword">
    <el-input  type="text" v-model.number="changePass.checkPassword"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm()">修改</el-button>
    <el-button @click="resetForm()">重置</el-button>
  </el-form-item>
</el-form>

 
  </div>
</el-card>

 </div>

</template>
<script>
import {passwordReg}  from "../../utils/passwordReg.js"
export default {
    data(){
        const  change=(rule,value,callback)=>{
            if(value===""){
                callback(new Error("请输入新密码"))
            } else if(!passwordReg(value)){
                 callback(new Error("以字母开头，长度在3~6之间，只能包含字符、数字和下划线"))
            }else{
                if(this.changePass.checkPassword!==""){
                                        
                    this.$refs.changeForm.validateField("checkPassword")
                }
                callback()
            }

        }
        const checkChange=(rule,value,callback)=>{
            if(value===""){

                callback(new Error("请输入确认密码"))

            }else if(this.changePass.newPassword!==value){
                callback(new Error("密码请输入一致"))

            }else{callback()}
            
        }

        const requireoldpassword=(rule,value,callback)=>{
                let obj={
                    oldPassword:value
                }
             this.request.post("/account/sqloldPassword",obj)
             .then((res)=>{
                 let {code,reason}=res
                 if(code===0){
                     this.$message({
                         type:"success",
                         message:reason
                     })
                     callback()
                 }else if(code===1){
                    
                     callback(new Error(reason))

                 }
                 
             }).catch((err)=>{
                 console.log(err);
                 
             })
       
        }

        return{
         
            changePass:{
                oldPassword:'',
                newPassword:'',
                checkPassword:''

            },
            rules:{
                oldPassword:[
                
                   {required:true,validator:requireoldpassword,trigger:"blur"}
                    
                ],
                    newPassword:[
       
                        {required:"true",validator:change,trigger:"blur"}
                    ],
                    checkPassword:[
                        {required:'true',validator:checkChange,trigger:"blur"}
                    ]
                
            
              }
        }
    },
    methods:{
        submitForm(){
                   
            this.$refs.changeForm.validate((value)=>{
                if(value){
                    let arr={
                        newPassword:this.changePass.newPassword
                    }
                   this.request.post("/account/newpassword",arr)
                   .then((res)=>{
                       let {code,reason}=res
                       if (code === 0) {
                            this.$message({
                            type: "success",
                            message: reason
                            });
                            // 清除本地存储的TOKEN
                            this.local.removeItem("zz")
                            // 转跳到登录页面
                            this.$router.push("/login")
                        } else if (code === 1) {
                            this.$message.error(reason);
                        }
                       
                   }).catch((err)=>{
                       console.log(err);
                       
                   })             
                }else{
                    alert("密码修改失败")
                    return
                }
            })
            


        },
        resetForm(){
            this.$refs.changeForm.resetFields()

        },
    }
    
}
</script>
<style lang="less">
   @import "./passwordModify.less";

</style>