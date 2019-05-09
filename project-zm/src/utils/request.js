import axios from "axios";
import qs from "qs";
import local from "../utils/local"
// 设置请求服务根目录地址
axios.defaults.baseURL='http://127.0.0.1:666';
// axios请求拦截器，每次发送请求都携带token
// key值被人偷窥，
axios.interceptors.request.use(config => {
    //////////////获取token
    const token = local.getItem('zz');
    config.headers.authorization = `Bearer ${token}` 
    return config;
})
// axios企业级封装
export default{
    get(url,params={}){
        return new Promise((resolve,reject)=>{
              axios.get(url,{
                  params
              }).then((res)=>{
                   resolve(res.data)
              }).catch((err)=>{
                reject(err)
              })})},
              
    post(url,params={}){
        return new Promise((resolve,reject)=>{
            axios.post(url,qs.stringify(params))
            .then((res)=>{
                resolve(res.data)
            }).catch((err)=>{
                reject(err)
            }) })}}