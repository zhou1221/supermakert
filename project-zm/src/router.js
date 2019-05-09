import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 登录
      path: '/login',
      component:()=>import('./views/login/login.vue')
    },
    {
      // 后台主界面
      path: '/home',   
      component: () => import('./views/home/home.vue'),
      redirect:'/home/systeminfo',
      children:[
        {
          path: '/home/personal',   
          component: () => import('./views/personal/personal.vue')
        },
        {
          path: '/home/systeminfo',   
          component: () => import('./views/systeminfo/systeminfo.vue')
        },
        {
          path: '/home/accountAdd',   
          component: () => import('./views/accountAdd/accountAdd.vue')
        },
        {
          path: '/home/accountManage',   
          component: () => import('./views/accountManage/accountManage.vue')
        },
        {
          path: '/home/passwordModify',   
          component: () => import('./views/passwordModify/passwordModify.vue')
        },
        {
          path: '/home/goodsAdd',   
          component: () => import('./views/GoodsAdd/goodsAdd.vue')
        },
        {
          path: '/home/goodsManage',   
          component: () => import('./views/GoodsManage/GoodsManage.vue')
        },
        {
          path: '/home/salsetotal',   
          component: () => import('./views/salseTotal/salseTotal.vue')
        },{
          path: '/home/stocktotal',   
          component: () => import('./views/stockTotal/stockTotal.vue')
        },
        {
          path: '/home/inventoryManage',   
          component: () => import('./views/inventoryManage/inventoryManage.vue')
        },
        {
          path: '/home/inventoryAdd',   
          component: () => import('./views/inventoryAdd/inventoryAdd.vue')
        },


      ]
    }
  ]
})
