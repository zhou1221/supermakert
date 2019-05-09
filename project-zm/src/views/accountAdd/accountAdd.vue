<template>
  <div class="account-Add">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span>添加管理员账号</span>
        <!-- 内容 -->
      </div>
      <div class="text item">
        <el-form
          :model="user"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <!-- 用户名 -->
          <el-form-item label="账号" prop="username">
            <el-input type="text" v-model="user.username" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 输入密码 -->
          <el-form-item label="密码" prop="password">
            <el-input type="text" v-model="user.password" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="text" v-model="user.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 用户组 -->
          <el-form-item label="选择用户组" prop="group">
            <el-select v-model="user.group" placeholder="请选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通用户" value="普通用户"></el-option>
            </el-select>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
//  引入工具函数
import { passwordReg } from "../../utils/passwordReg.js";
// 引入qs模块
// import qs from "qs";

export default {
  data() {
    const watchPassword=(rule,value,callback)=>{
      this.request.post("/account/watchPassword",{username:value})
      .then((res)=>{
        let {code,reason}=res
        console.log(res);
        
        if(code===1){
           
          callback(new Error(reason))
        }else if(code===0){
            
        callback()
        }
      
        
      }).catch(err=>{
        console.log(err);
        
      })

      // callback()
    }
    const writePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!passwordReg(value)) {
        callback(
          new Error("以字母开头，长度在3~6之间，只能包含字符、数字和下划线")
        );
      } else {
        if (this.user.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }

        callback();
      }
    };
    const checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.user.password) {
        callback(new Error("两次输入不一致"));
      } else {
        callback();
      }
    };
    return {
      user: {
        username: "",
        password: "",
        checkPass: "",
        group:""
      },
      rules: {
        username: [
          { required: true, validator: watchPassword, trigger: "blur" },
        
        ],
        password: [
          { required: true, validator: writePassword, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: checkPassword, trigger: "blur" }
        ],
        group: [{ required: true, message: "请选择用户组", trigger: "change" }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(value => {
        if (value) {
          let arr = {
            username: this.user.username,
            password: this.user.password,
            group: this.user.group
          };
          // console.log(arr);

          // console.log(this.request);

          this.request
            .post("/account/accountAdd", arr)
            .then(res => {
              console.log("成功", res);
              //解构后端数据
              let { code, reason } = res;
              if (code === 0) {
                // 提示信息
                this.$message({
                  showClose: true,
                  message: reason,
                  type: "success"
                });
                this.$router.push("/home/accountManage");
              } else if (code === 1) {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log("失败", err);
            });
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }

};
</script>
<style lang="less">
@import "./accountAdd.less";
</style>