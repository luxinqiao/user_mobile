import { initConfig } from './weChat'
import { getAppType } from '@/utils/app'
import { getBrowserType,getIosVersion, isEmpty } from '@/utils/common'
import { downloadApp } from '@/utils/downloadApp'
import vue from '@/main'

const browserType: string = getBrowserType(),
    appType: string = getAppType(),
    iosVersion: number = getIosVersion()

/** 
 *  初始化打开App蒙层（添加透明蒙层至元素上方）
 *  @param info {
 *  boxId:  盒子元素ID
 *  boxWidth 盒子元素宽度
 *  boxHeight 盒子元素高度
 *  domId:  待添加元素ID - 非必填，默认open_app_btn
 *  extinfo  传给app参数
 * }
*/
const initOpenAppEl = (info:any) => {
    let btn = document.getElementById(info.boxId) as HTMLElement
    if(isEmpty(info.domId)) {
        if(btn.querySelector('#open_app_btn')) {
            return 
        }
    } else {
        if(btn.querySelector(`#${info.domId}`)) {
            return 
        }
    }
    if(browserType == 'browser') {
        let dom = document.createElement('div')
        dom.setAttribute('id',isEmpty(info.domId)?'open_app_btn':info.domId)
        dom.setAttribute('style',`position:absolute; top: 0; left:0; width:${info.boxWidth}px; height: ${info.boxHeight}px;`)
        dom.addEventListener('click',()=>{
            openAppNormal('user')
        })
        btn.appendChild(dom)
        return
    } else if(browserType == 'wechat') {
        async function initDom(){
            let status
            if(isEmpty(sessionStorage.wechatConfig)) {
                status = await initConfig()
                sessionStorage.wechatConfig = status?1:0
            } else {
                status = sessionStorage.wechatConfig == 1?true: false
            }
            //获取微信打开app权限失败：添加元素仅支持下载app
            if(!status) {
                let dom = document.createElement('div')
                dom.setAttribute('id',isEmpty(info.domId)?'open_app_btn':info.domId)
                dom.setAttribute('style',`position:absolute; top: 0; left:0; width:${info.boxWidth}px; height: ${info.boxHeight}px;`)
                dom.addEventListener('click',()=>{
                    goDownload()
                })
                btn.appendChild(dom)
                return
            }
            //获取微信打开app权限成功：先打开app，打开失败再下载app
            let dom = document.createElement('wx-open-launch-app')
            dom.setAttribute('style',`position:absolute; top: 0; left:0; width:${info.boxWidth}px; height: ${info.boxHeight}px;`)
            dom.setAttribute('id',isEmpty(info.domId)?'open_app_btn':info.domId)
            dom.setAttribute('appid','wx0964356f5aed5205') //澜渟
            dom.setAttribute('extinfo',info.extinfo)
            dom.innerHTML = `<script type='text/wxtag-template'>
                    <style scoped>
                        .open_btn{
                            position: relative;
                            width:${info.domWidth}px; height: ${info.boxHeight}px;
                            opacity: 0;
                        }
                    </style>
                    <div class='open_btn'></div>
                </script>`
            btn.appendChild(dom)
            dom.addEventListener('launch', (e:any)=> {
                //打开app成功
            })
            dom.addEventListener('error', (e:any)=> {
                //打开app失败：下载app
                goDownload()
            })
        }
        initDom()
    }
}

/**
    打开app-普通
    @param type app类型(user/doctor/medUser)
    @return
 */
const openAppNormal  = (type: string, addUrl?:string) => {
    if(browserType == 'wechat') {
        goDownload()
        return
    }
    let hostUrl = window.location.href
    //定时器处理打不开app跳转AppStore
    var handleCallBack = function() {
        var num = 0, i = setInterval(()=>{
            num++
            if(document.hidden) {
                clearInterval(i)
                window.location.replace(hostUrl)
            } else if (num>100){
                clearInterval(i)
                if (appType == 'android' || iosVersion < 9) {
                    document.body.removeChild(ifr)
                }
                goDownload()
            }
        }, 20)
    }
    const protocol: string = getProtocol(type) + (isEmpty(addUrl)?'':addUrl)
    let ifr: any
    if (appType == 'android' || iosVersion < 9) {
        ifr = document.createElement('iframe')
        ifr.setAttribute('src', protocol)
        ifr.setAttribute('style', 'display:none')
        document.body.appendChild(ifr)
    } else if (iosVersion >= 9) {
        window.location.href = protocol  
    }
    handleCallBack()
}
/**
    获取app协议
    @param type app类型(user/doctor)
    @return
 */
const getProtocol = (type: string)=> {
    if (type == 'user') {
        return 'lanting://'
    } else if (type == 'doctor') {
        return 'lantingdoctor://'
    }
    return ''
}

/**
    下载app
    @param
    @return
 */
const goDownload = ()=> {
    if (appType === 'ios') { //ios浏览器+ios微信：跳appstore
        downloadApp()
    } else { //android微信：跳下载页
        vue.$router.push('/apps/wrightin')
    }
}

export {
    initOpenAppEl,
    openAppNormal
}