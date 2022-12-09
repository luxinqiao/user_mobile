import {getBrowserType, isEmpty, getToken} from './common'
import vue from '@/main'
import {goLogin as goLoginApp} from './app'

/**
    校验token是否为空
    @param
    @return token是否为空
*/
const checkTokenEmpty = () => {
    if (isEmpty(getToken())) {
        if ( window.location.href.indexOf('/login/') < 0) {
            sessionStorage.md_history_url = window.location.href
            if (getBrowserType() == 'wechat' && checkWechatParamEmpty()) {
                vue.$router.push('/login/index')
            } else {
                vue.$router.push('/login/phoneLogin')
            }
        }
        return true
    }
    return false
}

/**
    校验token
    @param
    @return
*/
const checkToken = (callbackFn?: () => any) => {
    if (window.location.href.indexOf('/login/') > 0) {
        return
    }
    sessionStorage.md_history_url = window.location.href
    if (isEmpty(getToken())) {
        if (getBrowserType() == 'wechat' && checkWechatParamEmpty()) {
            vue.$router.push('/login/index')
        } else {
            vue.$router.push('/login/phoneLogin')
        }
        return
    }
    vue.$axios.post(`${vue.$request.live}/common/token/check`, {
        token: getToken(),
    }).then((res: any) => {
        if (res.code != 200) {
            localStorage.md_token = ''
            if (getBrowserType() == 'wechat' && checkWechatParamEmpty()) {
                vue.$router.push('/login/index')
            } else {
                vue.$router.push('/login/phoneLogin')
            }
        } else {
            typeof callbackFn == "function" && callbackFn()
        }
    })
}

/**
    校验微信参数是否为空
    @param
    @return 微信参数是否为空
*/
const checkWechatParamEmpty = () => {
    return isEmpty(sessionStorage.md_wechat_unionid) || isEmpty(sessionStorage.md_wechat_nickname) || isEmpty(sessionStorage.md_wechat_headimgurl) || isEmpty(localStorage.md_wechat_openid)
}

/**
    跳转登录页
    @param
    @return 
*/
const goLogin = ()=>{
    let browserType = getBrowserType()
    if (browserType == 'wechat') {
        if (window.location.href.indexOf('/login/') > 0) {
            return
        }
        if (checkWechatParamEmpty()) {
            vue.$router.push('/login/index')
        } else {
            vue.$router.push('/login/phoneLogin')
        }
    } else if (browserType == 'browser') {
        if (window.location.href.indexOf('/login/') > 0) {
            return
        }
        vue.$router.push('/login/phoneLogin')
    } else {
        goLoginApp()
    }
}

export {
    checkTokenEmpty,
    checkToken,
    goLogin
}
