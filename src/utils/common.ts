import {getHeadTop as getAppHeadTop} from './app'

/**
    是否为空
    @param a 变量
    @return 是否为空
*/
const isEmpty = (a: any) => {
	if (a === undefined || a === 'undefined') {
        return true
    }
    if (a === null || a === 'null') {
        return true
    }
    if (trimStr(a.toString()) === '') {
        return true
    }
    if (JSON.stringify(a) === '{}') {
        return true
    }
    if (JSON.stringify(a) === '[]') {
        return true
    }
    return false
}

/**
    去除字符串左右空格
    @param {String}str 原字符串
    @return {String} 去除左右空格后的字符串
 */
const trimStr = (str: string) => {
    if (!str) {
        return ''
    }
    if (typeof(str) == 'number') {
        str = (str as number).toString()
    }
    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
}

/**
    价格转换-元
    @param price 价格
    @return {string} 转换后的价格
*/
const priceInteger = (price: string) => {
    if(isEmpty(price)) {
        return ''
    } 
    if(price == '0') {
        return '0'
    }   
	return Number(price)/100
}

/**
    价格分转元（保留2位小数）
    @param price 价格分
    @return 价格元
*/
const priceTransition = (price: string) => {
    if (isEmpty(price) || price == '0') {
        return '0.00'
    }
    return (Number(price)/100).toFixed(2)
}

/**
    价格分转元
    @param price 价格分
    @return 价格元
*/
const priceTransitionYuan = (price: string) => {
    if (isEmpty(price) || price == '0') {
        return '0'
    }
    return Number(price)/100
}

/**
    日期格式化
    @param time 时间
    @param format 时间格式
    @return 新格式时间
 */
const dateFormat = (time: Date, format: string) => {
    const t = new Date(time)
    const tf = (i:number)=> {
        return (i < 10 ? '0' : '') + i
    }
    return format.replace(/YYYY|MM|DD|hh|mm|ss|zz/g, (a: string)=> {
        switch (a) {
            case 'YYYY':
                return tf(t.getFullYear())
                break
            case 'MM':
                return tf(t.getMonth() + 1)
                break
            case 'DD':
                return tf(t.getDate())
                break
            case 'hh':
                return tf(t.getHours())
                break
            case 'mm':
                return tf(t.getMinutes())
                break
            case 'ss':
                return tf(t.getSeconds())
                break
            case 'zz':
                return tf(t.getMilliseconds())
                break
            default:
                return ''
                break
        }
    })
}

/**
    校验是否手机设备
    @param
    @return 是否手机设备
 */
const checkMobile = () => {
    const agents: string[] = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    for (let i:number = 0; i < agents.length; i++) {
        if (navigator.userAgent.indexOf(agents[i]) > 0) {
            return true
        }
    }
    return false
}

/**
    阻止事件冒泡
    @param
    @return
 */
const stopProp = () => {
    let e:Event = window.event as Event
    if (e.stopPropagation) {
        e.stopPropagation()
    } else {
        e.cancelBubble = true
    }
}

/**
    阻止默认行为
    @param
    @return
 */
const preventDefault = () => {
    let e:Event = window.event as Event
    if (e.preventDefault) {
        e.preventDefault()
    } else {
        e.returnValue = false
    }
}

/*
    获取对象值（满足ts校验）
    @param obj 对象
    @param key 键
    @return 值
 */
const getPropValue = <T, K extends keyof T>(obj: T, key: K): T[K] => {
    return obj[key]
}

/**
    px转换成rem
    @param px px尺寸
    @return rem尺寸
 */
const convertRem = (px: number) => {
    return px / (document.documentElement.clientWidth / 375 * 10)
}

/**
    rem转换成px
    @param rem rem尺寸
    @return px尺寸
 */
const convertPx = (rem: number) => {
    return rem * document.documentElement.clientWidth / 375 * 10
}

/**
    获取cookie参数
    @param key 键
    @return 值
 */
const getCookie = (key: string) => {
    const cookieArr: string[] = document.cookie.split(';')
    for (let i:number = 0; i < cookieArr.length; i++) {
        const arr: string[] = cookieArr[i].split('=')
        if (trimStr(arr[0]) === key) {
            return arr[1]
        }
    }
    return ''
}

/**
    获取浏览器类型
    @param
    @return 浏览器类型
 */
const getBrowserType = () => {
    const u: any = window.navigator.userAgent
    if (u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        return 'wechat'
    }
    if (!isEmpty(getCookie('app_uinfo'))) {
        return 'app'
    }
    return 'browser'
}

/**
	获取token
	@param
	@return token
 */
const getToken = () => {
    const browserType = getBrowserType()
    if (browserType == 'app') {
        const app_uinfo = getCookie('app_uinfo')
        return app_uinfo.split('|')[1]
    } else if (browserType == 'wechat') {
        return localStorage.md_token
    } else if (browserType == 'browser') {
        return localStorage.md_token
    }
    return localStorage.md_token
}

/**
	获取头部padding-top（app状态栏高度）
	@param
	@return 头部padding-top
 */
const getHeadPaddingTop = () => {
    const browserType = getBrowserType()
    if (browserType == 'app') {
        return Math.round(getAppHeadTop())
    } else if (browserType == 'wechat') {
        return 0
    }
    return 0
}

/**
    获取头部高度（app状态栏高度+4.4rem）
	@param
	@return 头部高度
 */
const getHeadHeight = () => {
    const browserType = getBrowserType()
    if (browserType == 'app') {
        return Math.round(getAppHeadTop() + convertPx(4.4))
    } else if (browserType == 'wechat') {
        return 0
    }
    return Math.round(convertPx(4.4))
}

/**
    获取ios版本（android返回0）
    @param
    @return ios版本
 */
const getIosVersion = () => {
    const verinfo = navigator.userAgent.toLowerCase().match(/os [\d._]*/gi)
    const version: string = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
    if (version) {
        return parseInt(version)
    }
    return 0
}

/**
	判断机型是否是iphoneX
    (iphoneX及之后更新的iphone手机，其window.screen.height最小是812，且window.devicePixelRatio最小是2)
	@param
	@return {Boolean} 参数值
*/
const checkIOSX = () => {
    const height = window.screen.height
    if (getIosVersion() == 0) {
        return false
    }
    if (window.devicePixelRatio >= 2) { //当前显示设备的物理像素分辨率与 CSS 像素分辨率的比率
        if (getBrowserType() == 'wechat') {
            if ( (height+88) >= 812) {
                return true
            } else {
                return false
            }
        } else {
            if(height >= 812) {
                return true
            }
        }
    }
    return false
}

/**
	获取链接参数
	@param
	@return {String} 参数值
*/
const getParameter = (param:any) => {
	const h = window.location.href
	const i = h.indexOf('?')<0 ? h.length : h.indexOf('?')
	const r = h.substr(i+1).match(new RegExp('(^|&)'+param+'=([^&]*)(&|$)','i'))
	if (r != null) {
		return r[2]
	} else {
		return ''
	}
}

/**
	转换链接:字符串转成对象
	@param {String} url 链接
	@return {Object} 转换后的链接
*/
const urlChange = (url: string) => {
    let obj:any = {}
    if (url.indexOf('?') > -1) {
        let urllist = (url).split('?')[1].split('&')
        for(let i = 0;i<urllist.length;i++){
            let subArr = urllist[i].split('=')
            obj[subArr[0]] = decodeURIComponent(subArr[1])
        }
    }
    return obj
}

/**
	设置微信授权参数
	@param {Object}param 微信授权参数
	@return
*/
const setWechatRole = (param:any) => {
	if (!isEmpty(param.uuid)) {
		localStorage.md_token = param.token
	}
	if (!isEmpty(param.uuid)) {
		sessionStorage.md_uuid = param.uuid
	}
	if (!isEmpty(param.openid)) {
		localStorage.md_wechat_openid = param.openid
	}
	if (!isEmpty(param.unionid)) {
		sessionStorage.md_wechat_unionid = param.unionid
	}
	if (!isEmpty(param.nickname)) {
		sessionStorage.md_wechat_nickname = param.nickname
	}
	if (!isEmpty(param.headimgurl)) {
		sessionStorage.md_wechat_headimgurl = param.headimgurl
	}
}

/**
	节流
	@param fn 回调函数
	@return
*/
const limit = function(fn: Function) {
    let isLimit = false
    return function() {
        if (!isLimit) {
            isLimit = true
            fn.call(this, function() {
                isLimit = false
            }, ...arguments)
        }
    }
}

/**
	防抖
	@param fn 回调函数
	@return
*/
const debounce = function(fn: Function, wait: number) {
    let timeout: any = null
    return function (...args: any[]) {
        timeout && clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.call(this, args)
        }, wait)
    }
}

/**
	对象参数转url链接
	@param {any}params 
	@return 转换后的参数
*/
const paramToLink = function(params: any) {
    let paramStr = ''
    Object.keys(params).forEach((item) => {
        if (paramStr === '') {
            paramStr = `${item}=${params[item]}`;
        } else {
            paramStr = `${paramStr}&${item}=${params[item]}`;
        }
    })
    return paramStr
}

/**
	图片压缩
	@param {Number}width 宽
    @param {Number}height 高
	@return {String} 压缩链接
*/
const compressImg = (width: number, height: number) => {
    return '?x-oss-process=image/auto-orient,0/resize,m_lfit,h_' + height + ',w_' + width
}

export {
    isEmpty,
    trimStr,
    priceTransition,
    priceTransitionYuan,
    priceInteger,
    dateFormat,
    checkMobile,
    checkIOSX,
    stopProp,
    preventDefault,
    getPropValue,
    convertRem,
    convertPx,
    getCookie,
    getBrowserType,
    getToken,
    getHeadPaddingTop,
    getHeadHeight,
    getIosVersion,
    getParameter,
    urlChange,
    setWechatRole,
    limit,
    debounce,
    paramToLink,
    compressImg
}
