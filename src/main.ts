import {clearRoute} from '@/router/hisRoute'
clearRoute()

import Vue from 'vue'
Vue.config.productionTip = false

import request from '@/axios/request'
Vue.prototype.$request = request

import axios from '@/axios'
Vue.prototype.$axios = axios

import resize from '@/resize'
resize.resetPxWidth(375)

import router from '@/router'
import store from '@/store/index'
import index from '@/index.vue'
const vue = new Vue({
    router,
    store,
    render: h => h(index)
}).$mount('#app')

Vue.config.ignoredElements = [
    'wx-open-launch-app',
    'wx-open-launch-weapp'
]

export default vue