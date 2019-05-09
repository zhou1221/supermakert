import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入封装后的axios
import request from "./utils/request"
import local from './utils/local'

// 引入echerts并挂载在原型上
import echarts from 'echarts'
Vue.prototype.echarts=echarts;

// 把封装后axios的方法挂载在VUE实例对象上
Vue.prototype.request = request;
Vue.prototype.local = local;

Vue.config.productionTip = false

// 引入ElementUI组件
import ElementUI from 'element-ui';
// 引入ElementUI组件CSS样式
import 'element-ui/lib/theme-chalk/index.css';
// 组件
Vue.use(ElementUI)

// 引入公用主页的样式
import './views/home/home.less';
// 引入静态基本样式
import './assets/css/base.less';
import { log } from 'util';

import {Message} from "element-ui";
/////////token 路由守卫//////////////
router.beforeEach((to, from, next) => {
      // 获取浏览器的本地存储的token
  const token = local.getItem("zz");

  console.log(token);
  // next()

  // 判断
  if (token){ 
  next()

  } else {
    //  去登录页面
    if(to.path==="/login"){
  
    next()
    } else{

      Message.error("不要越狱")
    //  去登录页面
      next("/login")
    }
  }

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
