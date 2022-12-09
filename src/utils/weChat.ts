import wx from 'weixin-js-sdk'
import vue from '@/main'
import {isEmpty, getBrowserType, setWechatRole, urlChange} from '@/utils/common'

/** 
 * 微信重定向
 * @param 
 * @return
*/
const redirect = (callbackFn?: () => any)=> {
    if(getBrowserType() == 'wechat'&& (isEmpty(vue.$route.query.openid) || isEmpty(sessionStorage.md_wechat_unionid) || isEmpty(sessionStorage.md_wechat_nickname) || isEmpty(sessionStorage.md_wechat_headimgurl))) {
        window.location.replace(`${vue.$request.c}/v1/wechat/login?back_url=${window.location.href.indexOf('?')<0?window.location.href+'?':window.location.href}`)
        let inter = setInterval(()=>{
            let urlObj = urlChange(window.location.href)
            if(!isEmpty(urlObj.openid)&&isEmpty(localStorage.md_wechat_openid)) {
                typeof callbackFn == "function" && callbackFn()
                setWechatRole(urlChange(window.location.href))
                clearInterval(inter)
            }
            if(!isEmpty(localStorage.md_wechat_openid)&&!isEmpty(urlObj.openid)) {
                clearInterval(inter)
            }
        },500)
        if(!isEmpty(localStorage.md_wechat_openid)) {
            clearInterval(inter)
        }
        return
    }
    typeof callbackFn == "function" && callbackFn()
}

/** 
 *  初始化打开小程序蒙层（添加透明蒙层至元素上方）
 *  @param info {
 *  boxId:  元素ID
 *  boxWidth 元素宽度
 *  boxHeight 元素高度
 *  domId 待添加元素ID - 非必填，默认xcx_btn
 *  appid 小程序id  gh_****
 *  url  小程序页面路径
 * }
*/
const initOpenXcxEl = (info:any) => {
    if(getBrowserType() !='wechat') {
        return
    }
    let btn = document.getElementById(info.boxId) as HTMLElement
    if(isEmpty(info.domId)) {
        if(btn.querySelector('#xcx_btn')) {
            return 
        }
    } else {
        if(btn.querySelector(`#${info.domId}`)) {
            return 
        }
    }
    async function initDom() {
        let status:any
        if(isEmpty(sessionStorage.wechatConfig)) {
            status = await initConfig()
            sessionStorage.wechatConfig = status?1:0
        } else {
            status = sessionStorage.wechatConfig == 1?true: false
        }
        if(!status) {
            let dom = document.createElement('div')
            dom.setAttribute('style',`position:absolute; top: 0; left:0; width:${info.boxWidth}px; height: ${info.boxHeight}px;`)
            dom.addEventListener('click',()=>{
                console.log('不支持小程序')
            })
            btn.appendChild(dom)
            return
        }
        let dom = document.createElement('wx-open-launch-weapp')
        dom.setAttribute('style',`position:absolute; top: 0; left:0; width:${info.boxWidth}px; height: ${info.boxHeight}px;`)
        dom.setAttribute('id',isEmpty(info.domId)?'xcx_btn':info.domId)
        dom.setAttribute('username',info.appid)
        dom.setAttribute('path',info.url)
        dom.innerHTML = `<script type='text/wxtag-template'>
                <style scoped>
                    .open_btn{
                        position: relative;
                        width:${info.boxWidth}px; height: ${info.boxHeight}px;
                        opacity: 0;
                    }
                </style>
                <div class='open_btn'></div>
            </script>`
        btn.appendChild(dom)
        dom.addEventListener('launch', (e:any)=> {
            console.log('xcxLaunch')
        })
        dom.addEventListener('error', (e:any)=> {
            console.log('xcxLaunch')
        })
    }
    initDom()
}

/** 
 * 分享 
 * @param info {
 *  title:  标题
 *  des 描述
 *  linkurl 分享链接
 *  img 分享图片
 * }
*/
const share = async(info:any)=>{
    await initConfig()
    wx.onMenuShareAppMessage({
        title: info.title,
        desc: info.des,
        link: info.linkurl,
        imgUrl: info.img,
        success:(res:any) =>{
            console.log('已分享');
        },
        cancel: (res:any)=> {
            console.log('已取消');
        },
        fail: (res:any) => {
            console.log(JSON.stringify(res));
        }
    })
    wx.onMenuShareTimeline({
        title: info.title,
        link: info.linkurl,
        imgUrl: info.img,
        success:(res:any) =>{
            console.log('已分享');
        },
        cancel: (res:any)=> {
            console.log('已取消');
        },
        fail: (res:any) => {
            console.log(JSON.stringify(res));
        }
    });
}

/** 
 * 初始化微信sdk，获取权限
 * @param
 * @return {Boolean} true-支持  false-不支持
*/
const initConfig = ()=>{
    return new Promise((resolve,reject)=>{
        if(getBrowserType() != 'wechat') {
            resolve(false)
            return
        }
        if(!checkWechatVersion()) {
            resolve(false)
            return
        }
        vue.$axios.post(`${vue.$request.c}/v1/wechat/jssdk`, {
            url: encodeURIComponent(`${window.location.href.indexOf('#')<0?window.location.href:window.location.href.split('#')[0]}`)
        }).then((res: any) => {
            if (res.code == 200 && wx) {
                let isError = false
                wx.config({
                    debug: false, 
                    appId: res.data.appid, // 必填，公众号的唯一标识
                    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                    signature: res.data.signature, // 必填，签名
                    openTagList: [
                        'wx-open-launch-app',
                        'wx-open-launch-weapp'
                    ],
                    jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline']
                })
                wx.ready(()=> {
                    if(isError) {
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                })
                wx.error((res:any)=> {
                    isError = true
                    resolve(false)
                })
            } 
        })
    })
}

/** 
 * 判断当前微信版本号是否支持
 * @param 
 * @return {Boolean} true-支持  false-不支持
*/
const checkWechatVersion = ()=>{
    document.addEventListener('WeixinOpenTagsError', (e)=> {
        return false
    })
    let wechat:any
    wechat = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)
    let judgewechat = wechat[1].split('.')
    if(
        Number(judgewechat[0])>7 || 
        (Number(judgewechat[0])==7 && Number(judgewechat[1])>0) || 
        (Number(judgewechat[0])==7 && Number(judgewechat[1])==0 && Number(judgewechat[2])>=12)){
        return true
    } else {
        return false
    }
}

export {
    redirect,
    initOpenXcxEl,
    share,
    initConfig
}