/*
    添加路由
    @param route 路由
    @param type 类型（history/route）
    @return
 */
const pushRoute = (route: string, type: string) => {
    const routes: string[] = getRoutes(type)
    if (routes.indexOf(route) == -1) {
        routes.push(route)
        setRoutes(routes, type)
    }
}

/*
    清空路由
    @param
    @return
 */
const clearRoute = () => {
    sessionStorage.routeRoutes = ''
}

/*
    释放冗余路由（back时）
    @param type 类型（history/route）
    @return
 */
const releaseRoute = (type: string) => {
    const routes: string[] = getRoutes(type)
    if (routes.length > 0) {
        routes.splice(routes.length - 1 , 1)
        setRoutes(routes, type)
    }
}

/*
    获取浏览器路由方向(forwoard/back)
    @param fromPath 原路由
    @param toPath 目标路由
    @return 浏览器路由方向
 */
const getHistoryDirection = (fromPath: string, toPath: string) => {
    if (fromPath == '/') {
        return ''
    }
    const hisRoutes: string[] = getRoutes('history')
    if (hisRoutes.indexOf(toPath) == -1) {
        return 'forward'
    }
    return 'back'
}
/*
    获取vue路由方向(forwoard/back)
    @param fromPath 原路由
    @param toPath 目标路由
    @return vue路由方向
 */
const getRouteDirection = (fromPath: string, toPath: string) => {
    if (fromPath == '/') {
        return 'forward'
    }
    const routeRoutes: string[] = getRoutes('route')
    if (routeRoutes.indexOf(toPath) == -1) {
        return 'forward'
    }
    return 'back'
}

/*
    获取路由
    @param type 类型（history/route）
    @return
 */
const getRoutes = (type: string) => {
    if (type == 'history') {
        return sessionStorage.hisRoutes ? sessionStorage.hisRoutes.split(';') : []
    } else if (type == 'route') {
        return sessionStorage.routeRoutes ? sessionStorage.routeRoutes.split(';') : []
    }
    return []
}
/*
    设置路由
    @param routes 路由
    @param type 类型（history/route）
    @return
 */
const setRoutes = (routes: string[], type: string) => {
    if (type == 'history') {
        sessionStorage.hisRoutes = routes.join(';')
    } else if (type == 'route') {
        sessionStorage.routeRoutes = routes.join(';')
    }
}

export {
    pushRoute,
    clearRoute,
    releaseRoute,
    getHistoryDirection,
    getRouteDirection
}
