<template>
  <div class="leftnav">
    <!-- // :default-active="$route.push"  设置激活样式与当前路由地址同步 -->
    <el-menu
      :default-active="$route.push"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      unique-opened
      router
      active-text-color="#ffd04b"
    >
      <el-submenu :index="(index+1)+''" v-for="(val,index) in user" :key="index">
        <template slot="title">
          <i :class="val.icon"></i>
          <span>{{val.title}}</span>
        </template>
        <el-menu-item
          v-for="(arr,index2) in val.child"
          :index="arr.path"
          :key="index2"
        >{{arr.childtitle}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user:[]
    };
  },
  methods:{
    getmenus(){
      this.request.get("/account/menus")
      .then(res=>{
     // 接收后端响应的菜单
                this.user = res.accessMenu;
        
      }).catch(err=>{
        console.log(err);
        
      })

    }

  },
  created(){
    this.getmenus()

  }
};
</script>

<style lang='less'>

 @import "./left.less";

</style>

