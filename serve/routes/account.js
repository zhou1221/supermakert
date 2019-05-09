var express = require('express');
var router = express.Router();

// 引入数据库
const  connection=require('./js/con')

// 写一个路由，统一设置响应头，解决跨域问题
router.all("*",(req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","http://127.0.0.1:8080")
    res.setHeader("Access-Control-Allow-Headers", "authorization,Content-Type"); // 允许通过头部信息authorization 携带token
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

router.post('/accountAdd', function(req, res, next) {
    // 设置响应头，解决跨域问题。
    // res.setHeader("Access-Control-Allow-Origin", "*")
    let {username,password,group}=req.body;
    //    准备数据
	const sqlStr = `insert into account(account, user_group, password) values('${username}', '${group}', '${password}')`;
         console.log(sqlStr);
    //   执行数据存入数据库
connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 如果受影响行数大于0 代表成功 否则代表失败
    if (data.affectedRows > 0) {
        // 响应成功的数据对象给前端
        res.send({code: 0, reason: "添加账号成功!哈哈！"})
    } else {
        // 响应失败的数据对象给前端
        res.send({code: 1, reason: "添加账号失败!呵呵！"})
    }
})


});
        //通过分页去访问用户列表的路由
router.get("/accountlistbypage",(req,res)=>{

    let {currentPage,pagesize}=req.query
    // 准备sql
    let sqlStr=`select*from account  order by create_time desc`
    
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        // 获取列表总数量
         total=data.length
         let n=(currentPage-1)*pagesize
         sqlStr+=`  limit ${n},${pagesize}`;
      // 执行sql
      connection.query(sqlStr,(err,data)=>{
        if(err) throw err;

        res.send({total,data})

      })
    })
  
})

// 删除列表访问的路由

router.get("/delaccount",(req,res)=>{ 
       let {id}=req.query;
    //    console.log(id);
        // 设置数据
    const sqlStr=`delete from account  where id=${id}`;
        //  执行数据
    connection.query(sqlStr,((err,data)=>{
        if(err) throw err;    
        if(data.affectedRows>0){
             res.send({code:0,reason:"删除用户成功"})
        }else{
            res.send({code:1,reason:"删除用户失败"})
        }              
    }))       
})


//  修改用户的路由

router.post("/editaccount",(req,res)=>{
    let {id}=req.body;  
    //  构造SQl
     let sqlStr=`select * from account where id=${id}`
     connection.query(sqlStr,(err,data)=>{
         if(err) throw err;
         res.send(data)       
     })
})

// 修改模态版中的确认按钮
router.post('/editsave',(req,res)=>{
    let {account,group,id}=req.body;
    console.log(account,group,id);
    
    let sqlStr=`update account set account="${account}" ,user_group="${group}"  where id=${id} `
          console.log(sqlStr);
          
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows>0){
            res.send({code:0,reason:"修改账号成功"})
        }else{
            res.send({code:0,reason:"修改账号失败"})
            
        }
    })
    
})

// 批量删除按钮的路由
router.get("/batchDelaccount",(req,res)=>{

    let {id}=req.query;
    console.log(id);
    let sqlStr=`delete from account where id in(${id})`
    // console.log(sqlStr); 打印格式是否正确
    
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows>0){
            res.send({code:0,reason:"删除用户成功"})
        }else{
            res.send({code:1,reason:"删除数据失败"})
        }
        
    })
  
})

 
// 修改密码页面中，验证是否存在密码
router.post("/sqloldPassword",(req,res)=>{
    let {oldPassword}=req.body;
    // console.log(oldPassword);
    
         let {password}=req.user;
         if(password===oldPassword){
               res.send({code:0,reason:"原密码输入正确"})
         }else{
                 res.send({code:1,reason:"密码不存在，请重新输入"})
         }

})
// 修改密码提交路由
router.post("/newpassword",(req,res)=>{
       let {newPassword}=req.body

       let {id}=req.user;
       const sqlStr=`update account set password="${newPassword}"  where id=${id}`
      
       connection.query(sqlStr,(err,data)=>{
           if(err) throw err;
           
           if(data.affectedRows>0){
               res.send({code:0,reason:"修改密码成功"})
           }else{
               res.send({code:1,reason:"修改密码失败"})
           }
       })
      

})


// 
router.get("/getaccountInfo",(req,res)=>{
  
    

     res.send(req.user)
})








// top组件中获取当前登录的用户名
router.get("/getaccount",(req,res)=>{
    
    let  id=req.user.id
    let sqlStr=`select* from account where id=${id};`
  
    
    connection.query(sqlStr,(err,data)=>{
     
        
    res.send(data)
    })


    // console.log(req.user);

    
})
/* ----------------- 上传后端配置 开始 -------------- */ 

// 引入multer
const multer = require('multer')

// 配置上传到服务器放置的目录 和 重命名
const storage = multer.diskStorage({
	destination: 'public/upload', // 图片上传到服务器的这个目录
	  // 图片重命名
    filename (req, file, cb) {
        var fileFormat =(file.originalname).split("."); // haha.jpg => ['haha', 'jpg']
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
})

// 上传对象
const upload = multer({
    storage,
});

/* ----------------- 上传后端配置 结束-------------- */ 

/* 头像上传请求 */ 
router.post('/upload', upload.single('file'), (req, res) => {
	// 获取文件名
	let filename = req.file.filename;
	// 拼接路径
	let path = `/upload/${filename}`;

	// 构造sql
	const sqlStr = `update account set img_url='${path}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "头像修改成功!", path})
		} else {
			res.send({code: 1, reason: "头像修改失败"})
		}
	})
})


// 
router.get("/menus",(req,res)=>{
  	// 获取用户组
	let userGroup = req.user.user_group;

    let role = userGroup === '超级管理员' ? 'super' : 'normal';
    
    // console.log(userGroup);

    let menus= [
        {
          icon: "el-icon-location",
          title: "系统管理",
          roles: ['super', 'normal'],
          child: [{ path: "/home/systeminfo", childtitle: "系统信息" }]
        },
        {
          icon: "el-icon-date",
          title: "账号管理",
          roles: ['super'],
          child: [
            { path: "/home/accountManage", childtitle: "账号管理" },
            { path: "/home/accountAdd", childtitle: "添加账号" },
            { path: "/home/passwordModify", childtitle: "密码修改" }
          ]
        },
        {
          icon: "el-icon-message",
          title: "商品管理",
          roles: ['super', 'normal'],
          child: [
            { path: "/home/goodsmanage", childtitle: "商品管理" },
            { path: "/home/goodsadd", childtitle: "添加商品" }
          ]
        },
        {
          icon: "el-icon-goods",
          title: "统计管理",
          roles: ['super'],
          child: [
            { path: "/home/salsetotal", childtitle: "销售统计" },
            { path: "/home/stocktotal", childtitle: "进货统计" }
          ]
        },
        {
          icon: "el-icon-goods",
          title: "进货管理",
          roles: ['super'],
          child: [
            { path: "/home/inventoryManage", childtitle: "库存管理" },
            { path: "/home/inventoryAdd", childtitle: "添加库存" }
          ]
        }
      ]
      // 功能和上面一样 把菜单数组中 包含当前登录用户角色的数据 过滤出来
    let accessMenu = menus.filter(item => item.roles.includes(role))

	res.send({accessMenu})
})


// 
router.post("/watchPassword",(req,res)=>{
  
    let {username}=req.body
    console.log(username);
    sqlStr=`select * from  account  where account="${username}";`
 
    console.log(sqlStr);
    
    //执行sql
    connection.query(sqlStr,(err,data) => {
       
        console.log(data);
        if(err) throw err
        
        if(data.length){
          res.send({code :1 ,reason:"账户名已存在"})
        }else{
          res.send({code:0,reason:"账户名验证通过"})
        }
      })

})



module.exports = router;
