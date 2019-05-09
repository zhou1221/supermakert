<template>
<div class="home">
   
   <el-container>
  <el-aside width="200px">
      


<LeftNav></LeftNav>


  </el-aside>

  <el-container>
         <!-- 头部 -->
    <el-header>
    <!-- 头部组件出口 -->
      <Top  ref="top"></Top>
    </el-header>


         <!-- 中间 -->
    <el-main>
        <router-view  @A="B"></router-view>
    </el-main>

    <el-footer>
      <!-- 底部出口 -->
       <Foot></Foot>
    </el-footer>

  </el-container>
</el-container>


</div>

</template>
<script>

import LeftNav from '../../components/LeftNav/leftnav';

import Top from '../../components/top/top';

import Foot from '../../components/foot/foot'
export default {
    components:{
        LeftNav,
        Top,
        Foot
    },
    methods:{
      B(){
        this.$refs.top.changeuser()
   
      }
    }
    
}
</script>
<style>


</style>

