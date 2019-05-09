var express = require('express');
var router = express.Router();
const  connection=require('./js/con')
// 引入token第三方模块
const  jwt=require("jsonwebtoken")
// 准备秘钥
 const secretkey="zm"
// 写一个路由，统一设置响应头，解决跨域问题
router.all("*",(req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","http://127.0.0.1:8080")
  res.setHeader("Access-Control-Allow-Headers", "authorization"); // 允许通过头部信息authorization 携带token
  next()
})


/* --------------------  验证token合法性开始  ---------------- */ 
// 准备一个签名（秘钥）
const secretKey = 'zm';
/* 验证token的合法性 */
const expressJwt = require('express-jwt');

// 验证token的合法性
router.use(expressJwt ({
            secret: secretKey
}).unless({
    path: ['/login/checklogin']  // 除了这个地址，其他的URL都需要验证（其他的所有请求 都要带上token 才能获取数据 否则不能获取到数据）
})); 
// 路由拦截器
router.use(function (err, req, res, next) {
    // 如果前端没有token或者是错误的token 就会抛出如下错误
    if (err.name === 'UnauthorizedError') { 
        // 响应给前端token无效的信息
        res.status(401).send('token不合法...');
    }
})

/* --------------------  验证token合法性结束  ---------------- */ 


router.post('/checklogin',(req, res)=>{


   let {account,password}=req.body
   let sqlStr=`select *from account where account="${account}"  and password="${password}";`
 
    console.log(sqlStr);
    

   connection.query(sqlStr,(err,data)=>{
     if(err) throw err
     if(data.length){
    // 根据用户输入值查看到数据，存在则生成token
      const token=jwt.sign(Object.assign({},data[0]),secretkey,{expiresIn:60*60*2})
            console.log(token);
            
                          //  把token 发送给前端
            res.send({code:0,reason:"登录成功",token});
     }else{
        res.send({code:1,reason:"登录失败"})

     }
     
   })
   


 

});

module.exports = router;
