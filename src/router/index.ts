import Vue from 'vue'
import Router from 'vue-router'
import routes from './staticRoute'
import {pushRoute, getHistoryDirection, getRouteDirection, releaseRoute} from './hisRoute'

//重写push：链接拼时间戳
const routerPush: any = Router.prototype.push
;(Router.prototype.push as any) = function(route: string): Promise<Router> {
    const time: string = new Date().getTime().toString()
    route += route.indexOf('?') == -1 ? '?t=' + time : '&t=' + time
    return routerPush.call(this, route).catch((error:any) => error)
}
//重写replace：链接拼时间戳+释放当前路由
const routerReplace: any = Router.prototype.replace
;(Router.prototype.replace as any) = function(route: string): Promise<Router> {
    releaseRoute('history')
    releaseRoute('route')
    const time: string = new Date().getTime().toString()
    route += route.indexOf('?') == -1 ? '?t=' + time : '&t=' + time
    return routerReplace.call(this, route).catch((error:any) => error)
}

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes,
    scrollBehavior(to: any, from: any, savedPosition: any) {
        if (savedPosition && to.meta.keepAlive) {
            return savedPosition
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ x: 0, y: 1 })
            }, 200)
        })
    }
})

//路由钩子拦截
router.beforeEach((to: any, from: any, next: any) => {
    //设置路由前进/后退状态
    sessionStorage.hisDirection = getHistoryDirection(from.fullPath, to.fullPath)
    if (sessionStorage.hisDirection == 'forward' || sessionStorage.hisDirection == '') {
        pushRoute(to.fullPath, 'history')
    } else {
        releaseRoute('history')
    }
    sessionStorage.routeDirection = getRouteDirection(from.fullPath, to.fullPath)
    if (sessionStorage.routeDirection == 'forward') {
        pushRoute(to.fullPath, 'route')
    } else {
        releaseRoute('route')
    }
    //设置页面滑动状态（向左滑/向右滑）
    if (sessionStorage.hisDirection == 'forward') {
        Vue.prototype.transition = 'trans-left'
    } else if (sessionStorage.hisDirection == 'back') {
        Vue.prototype.transition = 'trans-right'
    } else {
        Vue.prototype.transition = 'trans-origin'
    }
    //无效页面拦截，跳404
    if (to.matched.length === 0) {
        router.push({path: '/404'})
        return
    }
    //设置浏览器标题
    document.title = to.meta.title ? to.meta.title : '极致学院'
    
    next()
})

export default router
