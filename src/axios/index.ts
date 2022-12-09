import axios from 'axios'
import md5 from '@/utils/md5.js'
import {goLogin} from '@/utils/mdLogin'
import {getToken} from '@/utils/common'

//设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'
//请求前拦截
axios.interceptors.request.use(
    config => {
        if (!config.headers['REQUESTCLIENT']) {
            config.headers['REQUESTCLIENT'] = 4 //web端
        }
        if (!config.headers['REQUESTAPP']) {
            config.headers['REQUESTAPP'] = 1 //澜渟app
        }
        config.data.token = getToken()
        config.data = attestation(config.data)
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
//请求返回拦截
axios.interceptors.response.use(
    response => {
        if ((response.data.code == 201 || response.data.code == 3 || response.data.code == 102) && !(JSON.parse(response.config.data)).isTourist) {
            goLogin()
        }
        return response.data
    },
    error => {
        return error.response.data
    }
)

/**
    验签方法
    @param {Object}postData  验签
    @return
*/
function attestation(postData: { timestamp: number; nonce: string; sign: any }) {
    postData.timestamp = new Date().getTime()
    postData.nonce = getNonce()
    let checkData = JSON.parse(JSON.stringify(postData))
    for (let key in checkData) {
        if (typeof(checkData[key])=='undefined' || typeof(checkData[key])=='object') {
            delete checkData[key]
        }
    }
    postData.sign = md5(objArgs(sort_ASCII(checkData))).toUpperCase()
    return postData
}

/**
    获取32位随机字符串
    @param 
    @return
*/
function getNonce () {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var nums = "";
    for (var i = 0; i < 32; i++) {
        var id = Math.floor(Math.random() * 61);
        nums += chars[id];
    }
    return nums;
}

/**
    Js对象按ASCII码排序
    @param {Object}obj Js对象参数
    @return
*/
function sort_ASCII(obj: {[x: string]: any, timestamp: number}) {
    var arr = new Array()
    var num = 0
    for (var i in obj) {
        arr[num] = i
        num++
    }
    var sortArr = arr.sort()
    var sortObj: any = {}
    for (var i in sortArr) {
        sortObj[sortArr[i]] = obj[sortArr[i]]
    }
    return sortObj
}

/**
    post请求转换成get请求
    @param {Object}obj 参数
    @return
*/
function objArgs(obj: { [x: string]: string }) {
    var url = '';
    for (var name in obj) {
        url += name + '=' + obj[name] + '&'; // 转码并进行赋值
    }
    url += "secret=BCy94HkqITdAJDCPhw9Sjd6TwLoV8igR";
    return url; // 返回
}

export default axios