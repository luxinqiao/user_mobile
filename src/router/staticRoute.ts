export default [{
    path: '/',
    redirect: '/404'
}, {
    path: '/404',
    component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/error/404.vue'], resolve)
}, {
    path: '/login',
    component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/routerView/index.vue'], resolve),
    children: [{
        name: "loginIndex",
        path: "index",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/login/index.vue'], resolve),
        meta: {
            title: '登录'
        }
    },{
        name: "phoneLoginIndex",
        path: "phoneLogin",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/login/phoneLogin.vue'], resolve),
        meta: {
            title: '登录'
        }
    }]
}, {
    path: '/college',
    component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/routerView/index.vue'], resolve),
    children: [{
        path: 'spec',
        component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/routerView/index.vue'], resolve),
        children: [{
            name: "collegeSpecDetail",
            path: "detail",
            component: (resolve: (...modules: any[]) => void) => require(['@/views/college/spec/detail.vue'], resolve),
            meta: {
                title: '专栏详情',
                keepAlive: true
            }
        }]
    }, {
        path: 'course',
        component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/routerView/index.vue'], resolve),
        children: [{
            name: "collegeCourseDetail",
            path: "detail",
            component: (resolve: (...modules: any[]) => void) => require(['@/views/college/course/detail.vue'], resolve),
            meta: {
                title: '课程详情',
                keepAlive: true
            }
        }]
    }, {
        path: 'live',
        component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/routerView/index.vue'], resolve),
        children: [{
            name: "collegeLiveDetail",
            path: "detail",
            component: (resolve: (...modules: any[]) => void) => require(['@/views/college/live/detail.vue'], resolve),
            meta: {
                title: '直播详情'
            }
        }]
    }]
}, {
    path: '/apps',
    component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/routerView/index.vue'], resolve),
    children: [{
        name: "appsBreath",
        path: "breath",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/apps/breath.vue'], resolve),
        meta: {
            title: '腹式呼吸',
        }
    }, {
        name: "appsBreathdesc",
        path: "breathdesc",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/apps/breathdesc.vue'], resolve),
        meta: {
            title: '训练说明'
        }
    }, {
        name: 'appsKegelQuickStart01',
        path: "kegelQuickStart01",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/apps/kegelQuickStart01.vue'], resolve),
        meta: {
            title: '快速上手',
        }
    }, {
        name: 'appsKegelTrainGuide',
        path: "kegelTrainGuide",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/apps/kegelTrainGuide.vue'], resolve),
        meta: {
            title: '训练指导'
        }
    }, {
        name: 'appsWrightin',
        path: "wrightin",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/apps/wrightin.vue'], resolve),
        meta: {
            title: '澜渟'
        }
    }, {
        name: 'appsBreathTrainHelp',
        path: "breathTrainHelp",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/apps/breathTrainHelp.vue'], resolve),
        meta: {
            title: '腹式呼吸-训练帮助'
        }
    }]
}, {
    path: '/pullNew',
    component: (resolve: (...modules: any[]) => void) => require(['@/views/sys/routerView/index.vue'], resolve),
    children: [{
        name: "pullNewSign",
        path: "sign",
        component: (resolve: (...modules: any[]) => void) => require(['@/views/pullNew/sign.vue'], resolve),
        meta: {
            title: '澜渟注册有礼'
        }
    }]
},]