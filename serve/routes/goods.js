var express = require('express');
var router = express.Router();
const  connection=require('./js/con')


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
// 商品添加的路由
router.post("/goodsAdd",(req,res)=>{
   
    let {userGroup,barcode,goodsname,
        sellingprice,marketprice,
        buysprice,amount,weight,
        units,vip,discount,words}=req.body;

        // 准备SQL
        let sqlStr=`insert into goods(userGroup,barcode,goodsname,
            sellingprice,marketprice,
            buysprice,amount,weight,
            units,vip,discount,words)  
            values("${userGroup}","${barcode}","${goodsname}","${sellingprice}",
                    "${marketprice}","${buysprice}","${amount}","${weight}",
                    "${units}","${vip}","${discount}","${words}");`;

            //   console.log(sqlStr);
        // 执行sql
        connection.query(sqlStr,(err,data)=>{
            if(err) throw err;
            if (data.affectedRows > 0) {
                // 响应成功的数据对象给前端
                res.send({code: 0, reason: "添加账号成功!哈哈！"})
            } else {
                // 响应失败的数据对象给前端
                res.send({code: 1, reason: "添加账号失败!呵呵！"})
            }
        })

})
// 查询商品列表路由，渲染列表
router.get("/goodslist",(req,res)=>{
    let {pagesize,currentPage}=req.query;

    let sqlStr=`select * from  goods`

    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        let total=data.length;
        let n=(currentPage-1)*pagesize
        sqlStr+=`  limit ${n},${pagesize};`
        console.log(sqlStr);
        
        connection.query(sqlStr,(err,data)=>{
            if(err) throw err;
              res.send({data,total})
        })
         
        
    })
 
})

//删除商品路由
router.get("/delgoods",(req,res)=>{

    let  {id}=req.query;
    // 准备SQL
     let sqlStr=`delete from goods where id=${id};`
     console.log(sqlStr);
     
    // 执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
      if(data.affectedRows>0){
          res.send({code:0,reason:"删除成功"})
      }else{
        res.send({code:1,reason:"删除失败"})

      }
        
        
    })
    
})
// 修改图标按钮的路由

router.post("/changegoods",(req,res)=>{
    
    let {id}=req.body;

    let sqlStr=`select *from goods where id=${id};`
connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    
    res.send(data)
    
})

})
// 修改保存按钮的路由
router.get("/savegoods",(req,res)=>{

let  {barcode,goodsname,userGroup,sellingprice,id}=req.query;


let sqlStr=`update goods set barcode="${barcode}",
           goodsname="${goodsname}",userGroup="${userGroup}",
           sellingprice="${sellingprice}" where id=${id}`
    
// console.log(sqlStr);
connection.query(sqlStr,(err,data)=>{
    if(err) throw err
    if(data.affectedRows>0){
        res.send({code:0,reason:"修改成功"})
    }else{
        res.send({code:1,reason:"修改失败"})

    }
})


})



// 批量删除路由
router.get("/delmorelist",(req,res)=>{
    let {id}=req.query;
    // console.log(id);
    // 准备SQL
    let sqlStr=`delete from goods where id in (${id})`
    // console.log(sqlStr);
    // 执行SQL
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows>0){
            res.send({code:0,reason:"删除成功"})
        }else{
            res.send({code:1,reason:"删除失败"})

        }
    })

})


// 商品模糊查询
router.get("/search",(req,res)=>{
    let {cateName, keyword} = req.query;

		// 构造sql
		let sqlStr = `select * from goods where 1=1`;

		// 如果cateName为空或全部  代表查询所有分类  否则就是按照分类查询
		if (cateName !== '全部' && cateName !== '') {
			sqlStr += ` and cateName='${cateName}'`;
		}

		// 如果kewword为空就是查询所有名称或条形码 否则 就是查询条形码或名称包含关键字的
		if (keyword !== '') {
			sqlStr += ` and(goodsname like '%${keyword}%' or barcode like '%${keyword}%')`
		}

		// 执行sql
		connection.query(sqlStr, (err, data) => {
			if (err) throw err;
			res.send(data);
		})
    
})

module.exports = router;





















/* 
create table  goods(
    id int primary key auto_increment,
    creat_time timestamp default current_timestamp,
    userGroup   varchar(50),
    barcode     varchar(50),
    goodsname   varchar(50),

    sellingprice   varchar(50),
    marketprice   varchar(50),
    buysprice   varchar(50),
    amount   varchar(50),
    weight   varchar(50),
    units   varchar(50),
    vip   varchar(50),
    discount   varchar(50),
    words   varchar(50)

)
 */




