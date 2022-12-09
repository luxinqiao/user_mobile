import { getBrowserType } from '@/utils/common'
import { getAppType } from '@/utils/app'

const appType: string = getAppType(),
    browserType: string = getBrowserType()

//market://details?id=包名  应用市场
const user_android = "market://details?id=com.mld.LanTin"
const user_android_wc = "https://a.app.qq.com/o/simple.jsp?pkgname=com.mld.LanTin"
const user_ios = "https://itunes.apple.com/cn/app/id1243415475?mt=8"

/**
    安卓微信引导层
    @param
    @return
 */
const weichatGuideDialog = () => {
    if (browserType == 'wechat' && appType === 'android') {
        var confirm = document.createElement('div')
        confirm.setAttribute('id','weichatGuide')
        confirm.innerHTML = `
            <span class="icon"></span>
            <p class="txt">点击右上角 <span>...</span><br>选择在<span> 浏览器 </span>中打开</p>
        `
        let btn = document.createElement('p')
        btn.className = 'know_btn'
        btn.innerText = '我知道了'
        btn.addEventListener('click',()=>{
            document.getElementsByTagName('body')[0].removeChild(confirm)
        })
        confirm.append(btn)
        document.getElementsByTagName('body')[0].appendChild(confirm)
        window.addEventListener( "popstate" , function (e) {
            if (document.getElementById('weichatGuide')) {
                document.getElementsByTagName('body')[0].removeChild(confirm)
            }
        }, false )
    }
}

/**
    下载app
    @param
    @return
 */
const downloadApp = ()=> {
    if (appType == 'ios') {
        window.location.href = `${user_ios}&timestamp=${new Date().getTime()}`
    } else {
        if ( browserType == 'wechat') {
            window.location.href = `${user_android_wc}&timestamp=${new Date().getTime()}`
        } else {
            window.location.href = `${user_android}&timestamp=${new Date().getTime()}`
        }
    }
}

export {
    downloadApp,
    weichatGuideDialog
}
