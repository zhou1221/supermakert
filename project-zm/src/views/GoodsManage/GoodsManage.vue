<template>
  <div class="goods-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品管理</span>
      </div>
      <div class="text item">
        <el-form ref="form" :model="searchForm" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="cateName">
                <el-select v-model="searchForm.cateName" placeholder="---请选择分类---">
                  <el-option label="体育用品" value="体育用品"></el-option>
                  <el-option label="生活用品" value="生活用品"></el-option>
                  <el-option label="食品" value="食品"></el-option>
                  <el-option label="服装" value="服装"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关键字" prop="keyword">
                <el-input class="hei" type="text" v-model="searchForm.keyword" auto-complete="off" placeholder="(商品名称，条形码)"></el-input>
   
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-button type="success"  @click="search" round>查询</el-button>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <el-table
            ref="goodsTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <!-- 多选 -->
            <el-table-column type="selection" width="55"></el-table-column>
            <!-- 商品条形码 -->
            <el-table-column prop="barcode" label="商品条形码" width="120"></el-table-column>
            <!-- 商品名称 -->
            <el-table-column prop="goodsname" label="商品名称" show-overflow-tooltip></el-table-column>
            <!-- 所属分类 -->
            <el-table-column prop="userGroup" label="所属分类" show-overflow-tooltip></el-table-column>
            <!-- 售价 -->
            <el-table-column prop="sellingprice" label="售价" show-overflow-tooltip></el-table-column>
            <!-- 进价 -->
            <el-table-column prop="buysprice" label="进价" show-overflow-tooltip></el-table-column>
            <!--市场价  -->
            <el-table-column prop="marketprice" label="市场价" show-overflow-tooltip></el-table-column>
            <!--入库数量  -->
            <el-table-column prop="amount" label="入库数量" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改图标按钮 -->
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-edit"
                  @click="changeBnt(scope.row.id)"
                ></el-button>
                <!--删除图标按钮  -->
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delgoods(scope.row.id)"
                ></el-button>
              </template>
            </el-table-column>

            <el-table-column label="日期" width="120">
              <template slot-scope="scope">{{ scope.row.creat_time|filtertime }}</template>
            </el-table-column>
          </el-table>

          <!-- 分页-->

          <div class="block" style="margin-top:20px auto 10px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[1, 3, 5]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>

          <!--按钮 -->

          <div style="margin-top:20px;">
            <el-form-item>
              <el-button type="primary" @click="submitForm()">批量删除</el-button>
              <el-button @click="resetForm()">取消选择</el-button>
            </el-form-item>
          </div>


<!-- 修改商品的模态框 -->
<el-dialog title="修改商品信息" :visible.sync="dialogFormVisible">
  <el-form :model="changeform" ref="changeform" :rules="changerules">
    <!-- 条形码 -->
    <el-form-item label="商品条形码" :label-width="formLabelWidth"  prop="barcode">
      <el-input v-model="changeform.barcode" auto-complete="off"></el-input>
    </el-form-item>
    <!--  商品名称-->
     <el-form-item label="商品名称" :label-width="formLabelWidth"  prop="goodsname">
      <el-input v-model="changeform.goodsname" auto-complete="off"></el-input>
    </el-form-item>
    <!--  所属分类-->
    <el-form-item label="所属分类" :label-width="formLabelWidth"  prop="userGroup">
      <el-select v-model="changeform.userGroup" placeholder="所属分类">
        <el-option label="体育用品" value="体育用品"></el-option>
        <el-option label="生活用品" value="生活用品"></el-option>
        <el-option label="食品" value="食品"></el-option>
        <el-option label="服饰" value="服饰"></el-option>
      </el-select>
    </el-form-item>
           <!-- 售价 -->
      <el-form-item label="售价" :label-width="formLabelWidth"  prop="sellingprice">
      <el-input v-model="changeform.sellingprice" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="savegoods">确 定</el-button>
  </div>
</el-dialog>



           </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
// 引入处理时间的第三方模块moment
import moment from "moment";

export default {
  data() {
    return {
      selectId: "", //多选项的ID值，以便多次使用
      editId:"", //修改按钮的ID
     
        searchForm:{
          cateName:"",
          keyword:""
  

        },
      // 修改模态版的数据
      dialogTableVisible: false,
        dialogFormVisible: false,
        changeform: {
          barcode: '',
          goodsname: '',
          userGroup: '',
          sellingprice: '',
        },
        formLabelWidth: '120px',
        changerules:{
           barcode:[{required:true,message:"不能为空",trigger:"blur"}],
            goodsname:[{required:true,message:"不能为空",trigger:"blur"}],
            sellingprice:[{required:true,message:"不能为空",trigger:"blur"},
                        //  {type:"number",message:"必须为数字类型",trigger:"blur"}
            ]
        },
      // 商品列表的渲染数据集合
      tableData: [],

      //  分页
      pagesize:3,
      currentPage: 1,
      total:0//总条数
    };
  },
  methods: {
    // 删除图标按钮
    delgoods(id) {
      console.log(id);
      let obj = {
        id
      };
      this.request
        .get("/goods/delgoods", obj)
        .then(res => {
          let { code, reason } = res;

          this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else if (code === 1) {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 模糊查询
    search(){
      
       let obj={
         cateName:this.searchForm.cateName,
         keyword:this.searchForm.keyword
       } 
       this.request.get("/goods/search",obj)
       .then(res=>{
         console.log(res);
          this.tableData = res;
         
       }).catch(err=>{
         console.log(err);
         
       })



    },
    // 修改图标按钮
    changeBnt(id) {
      this.dialogFormVisible=true
    
        // clearValidate	移除整个表单的校验结果
        this.$nextTick(() => {
          this.$refs.changeform.clearValidate()
        })

      console.log(id);
        this.editId=id;
      let obj={
        id
      }
         
          this.request.post("/goods/changegoods",obj)
          .then((res)=>{
            console.log(res);
            // 根据id查询对应数据，将数据库的数据赋值给当前修改列表
            this.changeform.barcode=res[0].barcode;
            this.changeform.goodsname=res[0].goodsname;
            this.changeform.userGroup=res[0].userGroup;
            this.changeform.sellingprice=res[0].sellingprice;
  
          }).catch((err)=>{
            console.log(err);
            
          })
     
    },
    handleSelectionChange(val) {
      // 保存当前选择项的ID值，以便批量删除使用
      console.log(val);
      this.selectId = val.map(v => v.id);
    },
  
    // 修改列表中确定保存按钮
    savegoods(){
    
    
         this.$refs.changeform.clearValidate();


       this.$refs.changeform.validate((val)=>{
          let obj={
                barcode:this.changeform.barcode,
                goodsname:this.changeform.goodsname,
                userGroup: this.changeform.userGroup,
                sellingprice: this.changeform.sellingprice,
                id:this.editId
                }
    
         if(val){
           this.request.get("/goods/savegoods",obj)
           .then((res)=>{
             let {code,reason}=res
             
             if(code===0){
               this.$message({
                 type:"success",
                 message:reason
               })
             }else if(code===1){
               $this.$message.error(reason)
             }
            //  关闭窗口
              this.dialogFormVisible=false
            // 刷新列表
             this.watchgoodslist()

           }).catch((err)=>{
             console.log(err);
             
           })

         }else{
         return false
        }
       })


    },
  
    handleDelete() {},
    handleSizeChange(val) {
     console.log(val);
     this.pagesize=val
     this.watchgoodslist()
    },
    handleCurrentChange(val) {
     console.log(val);
     this.currentPage=val
     this.watchgoodslist()
    },
    //批量删除按钮 
    submitForm() {
      // 判断id数组的长度是否为空，为空，则停止
       if(!this.selectId.length){
         return
       }

         this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

            // console.log(this.selectId);
         let obj={
           id:this.selectId
         }
      this.request.get("/goods/delmorelist",obj)
      .then((res)=>{
        console.log(res);
        let {code,reason}=res

        if(code===0){
          this.$message({
            type:"success",
            message:reason
          })
                  // 调用刷新列表数据
                this.watchgoodslist()
               

        }else if(code===1){
          this.$message.error(reason)
        }
        
      }).catch((err)=>{
        console.log(err);
        
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //  取消选择按钮
    resetForm() {
      this.$refs.goodsTable.clearSelection()
        
    },
    // 刷新列表
    watchgoodslist(){
      let obj={
        currentPage:this.currentPage,
        pagesize:this.pagesize
      }
         
      this.request
      .get("/goods/goodslist",obj)
      .then(res => {
        // console.log(res);
        let {total,data}=res
        this.total=total
        // 将返回的数组赋值给当前列表数据
        this.tableData = data
        if(!data.length && this.currentPage !== 1){
                 this.pagesize-=1;
                 this.watchgoodslist()}
      })
      .catch(err => {
        console.log(err);
      });
    }
  },
  filters: {
    //过滤器过滤时间格式
    filtertime(val) {
      return moment(val).format("YYYY-MM-DD hh:mm:ss");
    }
  },
  // 钩子函数，生命周期
  created() {
    this.watchgoodslist()
  }
};
</script>
<style lang="less">
@import "./goddsmanage.less";
</style>