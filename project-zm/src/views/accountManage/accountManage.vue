<template>
  <div class="account-Manage">
    <!-- 面板 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span>账号管理</span>
      </div>
      <!-- 身体 -->
      <div class="text item">
        <template>
          <!-- 在表格上面绑定selection-change内置事件，触发函数 -->
          <el-table ref="accountTable" 
          :data="tableData" 
          tooltip-effect="dark" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
          >
              <!-- 选择框 -->
            <el-table-column type="selection" width="55"></el-table-column>
                <!-- 账号-->
              <el-table-column prop="account" label="账号" width="120"></el-table-column>
              <!-- 用户组 -->
            <el-table-column prop="user_group" label="用户组"  width='300'   show-overflow-tooltip></el-table-column>
            <!-- 日期 -->
            <el-table-column label="日期" width="200">
                                             <!-- 将时间过滤，设置格式 -->
              <template slot-scope="scope">{{ scope.row.create_time|filtertime }}</template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
                <!-- 修改 -->
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="success"
                    @click="handleEdit(scope.row.id)">
                    <i class="el-icon-edit"></i>
                    修改</el-button>

                    <!-- 删除 -->
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row.id)">
                    <i class="el-icon-delete"></i>
                    删除</el-button>
                </template>
              </el-table-column>
          
          </el-table>

     <!-- 修改的模态框 -->
<el-dialog title="修改用户" :visible.sync="dialogFormVisible"  width=350px;>
  <!-- 修改表单 -->
  <el-form :model="editForm"  :rules='rules' ref="editForm">
    <!-- 用户名 -->
    <el-form-item label="用户名" :label-width="formLabelWidth"  prop="username">
      <el-input v-model="editForm.username" auto-complete="off" style="width:220px"></el-input>
    </el-form-item>
    <!-- 用户组 -->
    <el-form-item label="用户组"    :label-width="formLabelWidth"  prop="usergroup">
      <el-select v-model="editForm.usergroup" placeholder="请选择用户组">
        <el-option label="超级管理员" value="超级管理员"></el-option>
        <el-option label="普通用户" value="普通用户"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary"    @click="saveFrom">确 定</el-button>
  </div>
</el-dialog>

<!-- 分页 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[1, 3, 5]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

<!-- 按钮 -->
          <div style="margin-top: 20px">
    <el-button type="danger" @click="batchDel">批量删除</el-button>
    <el-button type="info"  @click="cancelTable">取消选择</el-button>
  </div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入设置时间的第三方模块
import moment from "moment";
export default {
  data() {
    return {
      tableData: [
        // {
        //   username: "王小虎",
        //   group: "普通用户",
        //    creatDate: "2016-05-03",
        // }
      ],
      // 模态框内的表单数据
      editForm:{
        username:'',
        usergroup:''
      },
      editId:'',//保存修改按钮中获得的ID值
      dialogFormVisible:false,//设置模态框的显示和隐藏
      formLabelWidth:"100px",//表单标签的宽度
       rules:{//设置修改模态框中的规则
       username:[
         {required:true,message:"用户名不能为空",trigger:"blur"},
         {min:3,max:6,message:"长度3-6",trigger:"blur"}
       ]},
       selectId:[],//存储多选项每行的ID

       currentPage:1,//当前所在的页码
       total:0,//页码总计
       pagesize:1//每页多少条
    }
  },
  methods:{
      //  修改按钮
      handleEdit(id){
         this.editId=id;//保存修改按钮中获得的ID值
        //  打开模态版
         this.dialogFormVisible=true
        // clearValidate	移除整个表单的校验结果
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate()
        })

        //  发送请求给后端
         this.request.post("/account/editaccount",{id})
         .then((res)=>{
          //  获得后端返回的数据进行框内的赋值
           this.editForm.username=res[0].account;
           this.editForm.usergroup=res[0].user_group;       
         }).catch((err)=>{
           console.log(err);
           
         })
      },
      // 修改中模态框的确认按钮设置
      saveFrom(){
         
        this.$refs.editForm.validate((val)=>{
          if(val){
            this.dialogFormVisible=false;
            let parms={
          account:this.editForm.username,
          group:this.editForm.usergroup,
          id:this.editId  //获取修改按钮中获得的ID值
        }
        
        this.request.post('/account/editsave',parms)
        .then((res)=>{
          // console.log(res);
          let {code,reason}=res
  
          this.$message({
          message: reason,
          type: 'success'
        });
         
          this.watchlistbypage()
          
        }).catch((err)=>{
          console.log(err);
          
        })

          }else{
            this.$message.error(reason)
            return 

          }
        })
      },
      // 单个删除按钮
      handleDelete(id){
          this.$confirm('是否确定删除此用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
               }).then(() => {
                //  发出AJAX  请求给后端
               this.request.get("/account/delaccount",{id})
                .then((res)=>{
                 console.log(res);
              
               }).catch((err)=>{
                console.log(err);
              
               })

            this.watchlistbypage()
            // 弹出删除成功的对话框
              this.$message({
            type: 'success',
            message: '删除成功!'
          });
           }).catch(() => {
          // 弹出取消删除的对话框
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });       
      }, 
      //  取消选择按钮 
      cancelTable(){

       //给整个用户表格清除选择，调用Elementui内置方法clearSelection
          this.$refs.accountTable.clearSelection()
      },
      // 获取整个表格的选择状态,获取选择的id值
      handleSelectionChange(val){
            //  console.log(val);
            //   循环每个值, 获取id赋值给selectId
              this.selectId=val.map(v=>{
                return v.id
              })
      },
      // 批量删除按钮
      batchDel(){
          // this.selectId得到是数组，需要判断长度取反，结束请求
          // 否则所有信息删除完毕，依然会发送请求给后台，导致后台奔溃！！！
            if(!this.selectId.length){
              return false
            }
          //温馨提示
          this.$confirm('是否批量删除该文件？, 温馨提示', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

        //  执行删除
         let parms={
           id:this.selectId
         }
           this.request.get("/account/batchDelaccount",parms)
           .then((res)=>{
             let {code,reason}=res
             if(code===0){
                this.$message({
                            type: 'success',
                            message:reason
                          });
                  this.watchlistbypage()

             }else if(code===1){
               this.$message.error(reason)

             }
           }).catch((err)=>{
             console.log(err);
           })
            //  取消删除
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 分页
      handleSizeChange(val){
        // 多少条每页
           console.log(val);
           this.pagesize=val
           this.watchlistbypage()
      },
      handleCurrentChange(val){
        // 当前所在的页数
             console.log(val);
             this.currentPage=val
             this.watchlistbypage()
      },
          //  从数据库查找所有数据赋值给列表
          // 修订版本，根据分页从数据库拿对应的用户列表
      watchlistbypage(){
            // 因为多次使用这个函数，封装到methods中，再直接调用
           let obj={
             currentPage:this.currentPage,
             pagesize:this.pagesize
             
           }
            this.request
          .get("/account/accountlistbypage",obj)
          .then(res => {
                // console.log(res);
                // 把后端响应的数据赋值给账号列表，渲染表格
                let {total,data}=res
                this.tableData=data
                this.total=total
               if(!data.length && this.currentPage !== 1){
                 this.pagesize-=1;
                 this.watchlistbypage()
               }
          })
          .catch(err => {
            console.log(err);
          });

      }
  },
  // 在这个周期发送ajax最合适，生命周期，钩子函数，因为多次使用这个函数，封装到methods中，直接在此处调用
    created() {
      // 调用
      this.watchlistbypage()
    
  },
  // 过滤时间
  filters:{
    // 谁使用过滤器，val  就是谁
    filtertime(val){
       return moment(val).format('YYYY-MM-DD hh:mm:ss')
    }
   
  }
};
</script>
<style lang="less">
@import "./accountManage.less";
</style>