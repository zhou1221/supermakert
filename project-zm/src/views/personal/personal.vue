<template>
    <div class="personal">
 <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>个人中心</span>
 
  </div>
  <div class="text item">
<!-- action	必选参数，上传的地址
  http-request设置覆盖默认的上传行为，可以自定义上传的实现，类型function
  show-file-list	是否显示已上传文件列表	boolean
 before-upload  :上传文件之前的钩子，参数为上传的文件，
                 若返回 false 或者返回 Promise 且被 reject，则停止上传。	function(file) -->
    <el-upload
        class="avatar-uploader"
        action="hahahehexixi"
        :http-request="upload"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload">
        <!-- 图像 -->
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <!-- 图标 -->
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

      <div>
      <p>ID:{{id}}</p>
      <p>账号：{{account}}</p>
       <p>创建组:{{user_group}}</p>
      <p>创建时间:{{create_time|filterstime}}</p>
     </div>
  </div>
</el-card>
    </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
    data(){
        return{
            id:"",
            account:"",
            create_time:"",
            user_group:"",
            imageUrl:""
        }
    },
    methods:{
        getaccountInfo(){

            this.request.get("/account/getaccountInfo")
            .then((res=>{
               let {id,create_time,account,user_group}=res
            //    console.log(id,create_time,account,user_group);
                    this.id=id
                    this.account=account
                    this.create_time=create_time
                    this.user_group=user_group
            })).catch(err=>{
                console.log(err);
                
            })

        },
        // 头像上传成功回调
    //     handleAvatarSuccess(res, file) {

    //     this.imageUrl = URL.createObjectURL(file.raw);
    //   },
    //   头像上传之前回调
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    //   覆盖默认的上传行为，可以自定义上传的实现,自定义上传
      upload(file){

        //   创建一个FormData对象,是window上的内置对象。专门用于文件上传。 window.FormData
            let formdata=new FormData()
            //将当前文件追加进去
            formdata.append("file",file.file)
           
        //    console.log(file.file);//传入图片的文件信息
           axios.post("/account/upload",formdata,{

            //图片上传必须设置请求头为multipart/form-data
               headers:{"Content-Type":"multipart/form-data"}
           }).then((response)=>{
                // 接收后端响应的数据
              let {code, reason, path} = response.data;   
              // 判断   
              if (code === 0) {
                  this.$message({
                      type: 'success',
                      message: reason
                  })
                 // 回填头像
                 this.imageUrl = `http://127.0.0.1:666${path}`; 

                //  触发父组件方法
                this.$emit('A')
                
              } else if (code === 1) {
                  this.$message.error(reason)
              }
              
           })
           .catch(err => {
               console.log(err)
           })
        
           
           
      }
    

    },
    filters:{
        filterstime(val){
            return moment(val).format("YYYY-MM-DD")

        }

    },
    created(){
        this.getaccountInfo()
    }

}
</script>

<style  lang="less">
.personal{
    .el-card{
        border-radius: 15px;
        border-color:rgb(113, 114, 114);
        box-shadow:5px 5px 5px 3px  rgb(134, 132, 132);
        .el-card__header{
         font-size:18px;font-weight: 600;
         padding:12px 12px;
         background: rgb(243, 236, 236);
         border-bottom:1px solid #666
     }
    }
                .avatar-uploader .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .avatar-uploader .el-upload:hover {
                border-color: #409EFF;
            }
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .avatar {
                width: 178px;
                height: 178px;
                display: block;
            }
   
}

</style>
