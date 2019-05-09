<template>
  <div class="top">
    <el-row :gutter="24">
      <el-col :span="20">
        <h1>
          <span class="el-icon-menu"></span>华联超市管理系统
        </h1>
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-col :span="8">
            <div class="avatar">
              <img :src="path" width="50px" height="50px">
            </div>
          </el-col>
          <el-col :span="16">
            <el-dropdown  @command="handlecommand">

              <span class="el-dropdown-link">
                {{account}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  command="personal">个人中心</el-dropdown-item>
                <el-dropdown-item  command="logout">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  data(){
    return{
        account:"",
        path:""
    }
  },

     methods:{
       handlecommand(command){
         console.log(command);
         if(command==="personal"){
              
              this.$router.push("/home/personal")
       

           
         }else if(command==="logout"){
          this.local.removeItem("zz")
           this.$router.push("/")
         }
         
       },
       changeuser(){

         this.request.get("/account/getaccount")
         .then((res)=>{
           console.log(res);
          
           
          let{account,img_url}=res[0]
        
          this.account=account
          this.path=`http://127.0.0.1:666/${img_url}`
            
           
         }).catch(err=>{
           console.log(err);
           
         })
       }
     },
     created(){
       this.changeuser()
     }
}
</script>
<style  lang="less">

</style>

