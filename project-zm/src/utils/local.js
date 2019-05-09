
/////////将token存储在浏览器本地存储
export default{
    saveItem(key,val){
        window.localStorage.setItem(key,JSON.stringify(val))
    },
    getItem(key){
       return JSON.parse(window.localStorage.getItem(key))
    },
    removeItem(key){
        window.localStorage.removeItem(key)
    }
}