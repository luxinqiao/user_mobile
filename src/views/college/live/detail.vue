<!-- 课程详情 -->
<template>
<div id='main' :class='isIphoneX?"hasBtnIphoneX":"hasBtn"' :style='"padding-top:"+headHeight+"px"'>
    <md-head backMode='close'></md-head>
    <div id='download'>
        <img :src='require("@/assets/img/college/spec/detail/logo.png")'>
        <div class='msg'>
            <p>澜渟App</p>
            <p>听课体验更流畅</p>
        </div>
        <md-open-app class='download-box' domId='live-download-btn' :canUseWx='appOpen.canUse' :extinfo='appOpen.param'>
            <div class='download-btn'>打开App</div>
        </md-open-app>
    </div>
    <div id='banner'>
        <img class='banner-cover' :src='data.cover'>
        <div class='banner-shade preview' v-if='data.status=="0"'>
            <p class='text'>距开播还剩</p>
            <p class='time' v-if='dataLoaded'>
                <span class='time-value'>{{leftTime.dd}}</span>
                <span class='time-unit'>天</span>
                <span class='time-value'>{{leftTime.hh}}</span>
                <span class='time-unit'>时</span>
                <span class='time-value'>{{leftTime.mm}}</span>
                <span class='time-unit'>分</span>
                <span class='time-value'>{{leftTime.ss}}</span>
                <span class='time-unit'>秒</span>
            </p>
        </div>
        <div class='banner-mark'>
            <div class='banner-mark-source' :class='data.is_broad=="1"?"video":"audio"'>
                {{data.is_broad=='1' ? '视频' : '音频'}}
            </div>
            <div class='banner-mark-status' style='background-color: rgba(51, 51, 51, 0.6);'>
                <img :class='data.status=="1"?"living":""' :src='getStatusIcon()'>
                <span>{{getStatusText()}}</span>
            </div>
        </div>
    </div>
    <div id='info'>
        <div class='info-title'>
            <img class='info-title-logo' :src='require("@/assets/img/college/live/detail/info-logo.png")'>
            <p class='info-title-text text_ellipsis'>{{data.name}}</p>
        </div>
        <div class='info-desc' :class='descArrow=="down"?"text_ellipsis2":""' v-if='data.short_name!=""'>{{data.short_name}}</div>
        <div class='info-desc-more' v-if='descArrow!=""' @click='showMoreDesc()'>
            <img :src='getDescArrowIcon()'>
        </div>
        <div class='info-study'>
            <span class='info-study-num'>{{data.learn_num}}</span>
            <span class='info-study-unit'>人学习</span>
        </div>
        <div class='info-time'>直播时间：{{data.start_at}}</div>
    </div>
    <md-open-app v-if='getCouponShow()' domId='coupon-btn' :canUseWx='appOpen.canUse' :extinfo='appOpen.param'>
        <div id='coupon'>
            <div class='coupon-title'>优惠券</div>
            <div class='coupon-list'>
                <span class='coupon-item' v-for='(item,i) in coupon.datas' :key='i'>{{func.priceTransitionYuan(item.amount)}}元优惠券</span>
            </div>
            <div class='coupon-get'>
                <span>领券</span>
                <img :src='require("@/assets/img/college/spec/detail/arrow-right.png")'>
            </div>
        </div>
    </md-open-app>

    <div class='gap height-1'></div>
    <div id='detail'>
        <p class='detail-title'>详情</p>
        <div class='detail-content' v-html='data.rich_detail'></div>
    </div>
    <div id='member'>
        <p class='member-title'>授课人员</p>
        <div class='member-item' v-for='(item, i) in data.member' :key='i'>
            <img class='member-item-avatar' :src='item.avatar'>
            <div class='member-item-name'>
                <span class='name'>{{item.nickname}}</span>
                <span class='identify'>{{getRuleType(item.rule_type)}}</span>
            </div>
            <div class='member-item-desc text_ellipsis2'>{{item.remark}}</div>
        </div>
    </div>
    
    <!-- 微信+音频 -->
    <md-open-xcx v-if='browserType == "wechat" && data.is_broad == "0"' id='btn' :class='isIphoneX?"iphoneX_btn":""' domId='live-btn'
        :canUseWx='xcxOpen.canUse' :extinfo='xcxOpen.param' :xcxType='xcxOpen.type' :xcxPath='xcxOpen.path+param.live_code'>
        <div class='btn-text'>打开澜渟LIVE小程序{{data.status == "0" ? "预约" : "学习"}}</div>
    </md-open-xcx>
    <!-- 预告 -->
    <md-open-app v-else-if='data.status == "0"' id='btn' :class='isIphoneX?"iphoneX_btn":""' domId='appoint-btn' :canUseWx='appOpen.canUse' :extinfo='appOpen.param'>
        <div class='btn-text'>打开澜渟App预约</div>
    </md-open-app>
    <!-- 直播中+结束 -->
    <md-open-app v-else id='btn' :class='isIphoneX?"iphoneX_btn":""' domId='end-btn' :canUseWx='appOpen.canUse' :extinfo='appOpen.param'>
        <div class='btn-text'>打开澜渟App学习</div>
    </md-open-app>

    <div id='offShelf' v-if='offShelf.show' :style='"top:"+offShelf.top+"px"'>
        <img :src='require("@/assets/img/college/spec/detail/off-shelf.png")' :style='"margin-top:"+offShelf.contentTop+"px"'>
        <p>该内容已下架</p>
    </div>
    <div id='appJump' v-if='browserType=="app"&&func.getAppProduct()=="wrightinDoctor"' :style='"top:"+headHeight+"px"' @click='jumpWrightinDoctor()'>
        <div :class='["appJump-btn" ,isIphoneX?"iphoneX_btn":""]'>
            <div class='appJump-btn-text'>打开澜渟App学习</div>
        </div>
    </div>

    <md-custom :show.sync='customShow' id='load' type='transparent'>
        <img :src='require("@/assets/img/common/load.gif")'>
    </md-custom>
</div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator'
    import {mdHead, mdOpenApp, mdOpenXcx, mdCustom} from '@/components'
    import {convertRem, getHeadHeight, getBrowserType, priceTransitionYuan, convertPx, checkIOSX} from '@/utils/common'
    import {getAppProduct, appFun} from '@/utils/app'
    import {initConfig as initWxSdkConfig} from '@/utils/weChat'

    @Component({
        components: {
            mdHead, mdOpenApp, mdOpenXcx, mdCustom
        }
    })

    export default class collegeLiveDetail extends Vue {
        private func: object = {
            priceTransitionYuan,
            getAppProduct
        }
        private headHeight: number = getHeadHeight()
        private browserType: string = getBrowserType()
        private param: any = {
            live_code: this.$route.query.live_code
        }
        private data: any = {}
        private dataLoaded: boolean = false
        private leftTime: any = {}
        private descArrow: string = ''
        private coupon: any = {
            datas: []
        }
        private appOpen: any = {
            canUse: false,
            param: {
                type: this.$route.query.type,
                code: this.$route.query.live_code
            }
        }
        private xcxOpen: any = {
            canUse: false,
            type: 'live',
            path: () => 'pages/pkgs/college/pages/liveDetail/liveDetail.html?code=',
            param: {
                type: this.$route.query.type,
                code: this.$route.query.live_code
            }
        }
        private offShelf: any = {
            show: false,
            top: 0,
            contentTop: 0
        }
        private isIphoneX:boolean = checkIOSX()
        private customShow: boolean = true

        mounted() {
            this.initOpenApp()
            this.initData()
            this.initCoupon()
            this.addLearn()
        }

        /**
            初始化打开App（打开app、打开小程序的能力）
            @param
            @return
         */
        initOpenApp() {
            if (this.browserType == 'wechat') {
                (async () => {
                    const canUse = await initWxSdkConfig()
                    this.appOpen.canUse = canUse
                    this.xcxOpen.canUse = canUse
                })()
            }
        }

        /**
            初始化数据
            @param
            @return
         */
        initData() {
            this.$axios.post(`${this.$request.live}/v2/source/live`, {
                live_code: this.param.live_code
            }).then((res: any) => {
                this.dataLoaded = true
                this.customShow = false
                if (res.code == 200) {
                    this.data = res.data
                    this.initLeftTime(res.data.left_time)
                    this.initDescArrow()
                } else if (res.code == 214) {
                    this.initOffShelf()
                }
            })
        }

        /**
            初始化剩余时间
            @param seconds 秒
            @return xx天xx时xx分xx秒
         */
        initLeftTime(secondStr: string) {
            let seconds: number = parseInt(secondStr)
            this.leftTime = this.convertTime(seconds)
            let intervalFun = setInterval(() => {
                seconds--
                this.leftTime = this.convertTime(seconds)
                seconds <= 0 && clearTimeout(intervalFun)
            }, 1000)
        }

        /**
            秒转换成 xx天xx时xx分xx秒
            @param seconds 秒
            @return xx天xx时xx分xx秒
         */
        convertTime(seconds: number) {
            const day = Math.floor(seconds / 60 / 60 / 24)
            const hour = Math.floor(seconds / 60 / 60) % 24
            const minute = Math.floor(seconds / 60) % 60
            const second = seconds % 60
            return {
                dd: day.toString(),
                hh: hour<10 ? `0${hour}` : hour.toString(),
                mm: minute<10 ? `0${minute}` : minute.toString(),
                ss: second<10 ? `0${second}` : second.toString()
            }
        }

        /*
            初始化描述箭头
            @param
            @return
         */
        initDescArrow() {
            if (this.data.short_name == '') {
                this.descArrow = ''
                return
            }
            let box = document.querySelector('.info-desc') as Element
            if (Math.round(convertRem(box.scrollHeight) / 1.7) > 2) {
                this.descArrow = 'down'
            }
        }

        /*
            初始化优惠券
            @param
            @return
         */
        initCoupon() {
            this.$axios.post(`${this.$request.live}/v1/coupon/canget`, {
                where_code: this.param.live_code,
                for_where: '11' //直播
            }).then((res: any) => {
                if (res.code == 200) {
                    this.coupon.datas = res.data
                }
            })
        }

        /*
            显示更多描述
            @param
            @return
         */
        showMoreDesc() {
            if (this.descArrow == 'down') {
                this.descArrow = 'up'
            } else {
                this.descArrow = 'down'
            }
        }

        /*
            初始化专栏下架缺省
            @param
            @return
         */
        initOffShelf() {
            this.offShelf.show = true
            this.offShelf.top = convertPx(5.2) + this.headHeight
            this.offShelf.contentTop = (document.documentElement.clientHeight - convertPx(14.5)) / 2 - this.offShelf.top
        }

        /*
            增加学习记录
            @param
            @return
         */
        addLearn() {
            this.$axios.post(`${this.$request.live}/v2/learn/add`, {
                source_code: this.param.live_code,
                source_type: '2', //0-课程,1-专栏,2-直播
                rote_code: 1,
                rote_time: 0,
                chap_code: '',
                isTourist: true
            })
        }

        /**
            获取优惠券显示
            @param
            @return 优惠券显示
         */
        getCouponShow() {
            if (this.data.price == "0") {
                return false
            }
            if (this.data.is_authed == "1") {
                return false
            }
            if (this.coupon.datas.length == 0) {
                return false
            }
            return true
        }

        /**
            获取直播状态图标
            @param
            @return 直播状态图标
         */
        getStatusIcon() {
            if (this.data.status == '0') {
                return require('@/assets/img/college/live/detail/status-pre.png')
            } else if (this.data.status == '1') {
                return require('@/assets/img/college/live/detail/status-living.png')
            } else if (this.data.status == '2') {
                if (this.data.is_broad == '1' && this.data.push_status == '3') {
                    return require('@/assets/img/college/live/detail/status-back.png')
                }
                return require('@/assets/img/college/live/detail/status-end.png')
            }
            return null
        }

        /**
            获取直播状态文案
            @param
            @return 直播状态文案
         */
        getStatusText() {
            if (this.data.status == '0') {
                return '预告'
            } else if (this.data.status == '1') {
                return '直播'
            } else if (this.data.status == '2') {
                if (this.data.is_broad == '1' && this.data.push_status == '3') {
                    return '回看'
                }
                return '结束'
            }
            return ''
        }

        /*
            获取授课人员身份
            @param ruleType 授课人员类型
            @return 授课人员身份
         */
        getRuleType(ruleType: String) {
            if (ruleType == '1') {
                return '主持人'
            } else if (ruleType == '2') {
                return '嘉宾'
            }
            return ''
        }

        /*
            获取更多描述箭头图标
            @param
            @return 更多描述箭头图标
         */
        getDescArrowIcon() {
            if (this.descArrow == 'down') {
                return require('@/assets/img/college/spec/detail/desc-arrow-down.png')
            }
            return require('@/assets/img/college/spec/detail/desc-arrow-up.png')
        }

        /*
            打开澜渟医生App
            @param
            @return
         */
        jumpWrightinDoctor() {
            appFun(() => {
                (window as any).jsInterface.jumpToApp()
            }, () => {
                (window as any).webkit.messageHandlers.jumpToApp.postMessage(null)
            })
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        position: relative;
        background-color: #fff;
        #download {
            position: relative;
            width: 100%; height: 5.2rem;
            background-color: #FFF5F9;
            >img {
                position: absolute;
                top: 0.9rem; left: 1.2rem;
                width: 3.4rem; height: 3.5rem;
            }
            >.msg {
                margin-left: 5.5rem; padding-top: 1rem;
                >p:nth-child(1) {
                    line-height: 1.6rem;
                    font-size: 1.5rem; color: #FF2C79;
                }
                >p:nth-child(2) {
                    margin-top: 0.5rem;
                    line-height: 1.3rem;
                    font-size: 1.3rem; color: #C79AAD;
                }
            }
            .download-box {
                position: absolute;
                top: 1.2rem; right: 1.2rem;
                width: 7.4rem; height: 2.8rem;
                line-height: 2.8rem; text-align: center;
                border-radius: 1.5rem;
                background-color: #FF2C79;
                .download-btn {
                    font-size: 1.2rem; color: #fff;
                }
            }
        }
        #banner {
            position: relative;
            height: 21rem;
            background-color: #f4f4f4;
            >.banner-cover {
                position: absolute; z-index: 1;
                top: 0; left: 0;
                width: 100%; height: 100%;
                object-fit: cover;
            }
            >.banner-shade {
                position: absolute; z-index: 2;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                overflow: hidden;
            }
            >.banner-shade.preview {
                >.text {
                    margin-top: 7rem;
                    height: 2rem;
                    text-align:center; line-height: 2rem;
                    letter-spacing: 0.1rem;
                    color: #fff;
                }
                >.time {
                    margin-top: 1.6rem;
                    text-align: center;
                    height: 3.3rem;
                    line-height: 3.3rem;
                    font-size: 2.4rem; letter-spacing: 0.1rem;
                    >.time-value {
                        margin-left: 0.8rem;
                        line-height: 3.3rem;
                        font-size: 2.4rem; letter-spacing: 0.1rem;
                        color: #fff;
                    }
                    >.time-value:nth-child(1) {
                        margin-left: 0;
                    }
                    >.time-unit {
                        margin-left: 0.8rem;
                        line-height: 3.3rem;
                        letter-spacing: 0.1rem;
                        color: #fff;
                    }
                }
            }
            >.banner-mark {
                position: absolute; z-index: 3;
                top: 1.5rem; right: 0;
                width: 7.2rem; height: 1.8rem;
                >.banner-mark-source {
                    position: absolute;
                    top: 0; left: 0;
                    width: 3.2rem; height: 1.8rem;
                    text-align: center; line-height: 2rem;
                    border-top-left-radius: 1.8rem; border-bottom-left-radius: 1.8rem;
                    font-size: 1rem;
                    color: #fff;
                }
                >.banner-mark-source.video {
                    background-color: #ff2c79;
                }
                >.banner-mark-source.audio {
                    background-color: #ff8b2d;
                }
                >.banner-mark-status {
                    position: absolute;
                    top: 0; right: 0;
                    width: 4rem; height: 1.8rem;
                    >img {
                        position: absolute;
                        top: 0.4rem; left: 0.3rem;
                        width: 1.1rem; height: 1.1rem;
                    }
                    >img.living {
                        top: 0.4rem; left: 0.4rem;
                        width: 0.9rem; height: 1rem;
                    }
                    >span {
                        position: absolute;
                        top: 0.3rem; right: 0.4rem;
                        height: 1.4rem;
                        line-height: 1.4rem;
                        font-size: 1rem;
                        color: #fff;
                    }
                }
            }
        }
        #info {
            position: relative;
            padding: 1.2rem;
            background-color: #fff;
            >.info-title {
                display: flex;
                align-items: center;
                height: 2.2rem; font-weight: bold;
                >.info-title-logo {
                    width: 2.8rem; height: 1.6rem;
                }
                >.info-title-text {
                    flex: 1;
                    margin-left: 0.6rem;
                    height: 2.2rem;
                    line-height: 2.2rem;
                    font-size: 1.6rem;
                }
            }
            >.info-desc {
                margin-top: 0.5rem;
                line-height: 1.7rem;
                font-size: 1.2rem;
                color: #999;
            }
            >.info-desc-more {
                position: absolute;
                top: 4.3rem; right: 0.3rem;
                display: flex;
                justify-content: center; align-items: center;
                width: 2.7rem; height: 2.7rem;
                >img {
                    width: 0.9rem; height: 0.9rem;
                }
            }
            >.info-study {
                margin-top: 1rem;
                height: 1.7rem;
                line-height: 1.7rem;
                >.info-study-num {
                    font-size: 1.2rem;
                    color: #666;
                }
                >.info-study-unit {
                    font-size: 1.2rem;
                    color: #999;
                }
            }
            >.info-time {
                margin-top: -1.7rem;
                height: 1.7rem;
                text-align: right; line-height: 1.7rem;
                font-size: 1.2rem;
                color: #999;
            }
        }
        #coupon {
            display: flex;
            align-items: center;
            height: 5.2rem;
            background-color: #FFF;
            border-top: 0.5px solid #f4f4f4;
            >.coupon-title {
                margin-left: 1.2rem;
            }
            >.coupon-list {
                flex: 1;
                margin-left: 0.8rem;
                height: 2.3rem;
                overflow: hidden;
                >.coupon-item {
                    display: inline-block;
                    margin: 0 1.2rem 0.2rem 0; padding: 0 1rem;
                    height: 2.1rem;
                    text-align: center; line-height: 2.1rem;
                    font-size: 1.1rem;
                    color: #ff2c79;
                    background: url(../../../assets/img/college/spec/detail/coupon.png) no-repeat center center;
                    background-size: 100% 100%;
                }
            }
            >.coupon-get {
                display: flex;
                align-items: center;
                margin-right: 1.6rem;
                height: 1.8rem;
                >span {
                    height: 1.8rem;
                    line-height: 1.8rem;
                    font-size: 1.3rem;
                    color: #999;
                }
                >img {
                    margin-left: 0.4rem;
                    width: 0.6rem; height: 0.9rem;
                }
            }
        }
        #detail {
            padding: 1.6rem 1.2rem 0 1.2rem;
            background-color: #fff;
            >.detail-title {
                height: 2.1rem;
                line-height: 2.1rem;
                font-size: 1.5rem; font-weight: bold;
            }
            >.detail-content {
                margin: 0 1.2rem; padding: 1.2rem 0 2.4rem 0;
                ::v-deep >img {
                    display: block;
                    width: 100%;
                }
            }
        }
        #member {
            margin-top: 2rem; padding: 0 1.2rem 2.4rem 1.2rem;
            >.member-title {
                height: 2.1rem;
                line-height: 2.1rem;
                font-size: 1.5rem; font-weight: bold;
            }
            >.member-item {
                position: relative;
                margin-top: 1.7rem; padding-left: 5.6rem;
                height: 5.6rem;
                >.member-item-avatar {
                    position: absolute;
                    top: 0; left: 0;
                    width: 5.6rem; height: 5.6rem;
                    border-radius: 5.6rem;
                }
                >.member-item-name {
                    display: flex;
                    align-items: center;
                    margin-left: 1rem;
                    >.name {
                        height: 2.1rem;
                        line-height: 2.1rem;
                        font-size: 1.5rem;
                    }
                    >.identify {
                        margin-left: 0.5rem; padding: 0 0.2rem;
                        height: 1.4rem;
                        text-align: center; line-height: 1.4rem;
                        border: 1px solid #ff9f3d; border-radius: 1px;
                        font-size: 1rem;
                        color: #ff9f3d;
                    }
                }
                >.member-item-desc {
                    margin-top: 0.3rem; margin-left: 1rem;
                    line-height: 1.7rem;
                    font-size: 1.2rem;
                    color: #999;
                }
            }
            >.member-item:nth-child(1) {
                margin-top: 1.5rem;
            }
        }
        #btn {
            position: fixed; z-index: 98;
            bottom: 0; left: 0; right: 0;
            padding-top: 1rem;
            height: 5.5rem;
            border-top: 0.5px solid #f4f4f4;
            background-color: #FFF;
            >.btn-text {
                position: absolute;
                top: 1rem; left: 0; right: 0;
                width: 34.3rem; height: 3.8rem;
                margin: auto;
                text-align: center; line-height: 3.8rem;
                border-radius: 2rem;
                background-color: #ff2c79; color: #fff;
            }
        }
        #btn.iphoneX_btn {
            height: 6.5rem;
        }
        #offShelf {
            position: absolute; z-index: 97;
            bottom: 0; left: 0; right: 0;
            background: #fff;
            >img {
                display: block;
                margin: auto;
                width: 14.9rem; height: 10.9rem;
            }
            >p {
                margin-top: 1.6rem;
                text-align: center;
                height: 2rem;
                line-height: 2rem;
                color: #666;
            }
        }
        #appJump {
            position: fixed; z-index: 99;
            top: 0; bottom: 0; left: 0; right: 0;
            >.appJump-btn {
                position: fixed;
                bottom: 0; left: 0; right: 0;
                padding-top: 1rem;
                height: 5.5rem;
                border-top: 0.5px solid #f4f4f4;
                background-color: #fff;
                >.appJump-btn-text {
                    width: 34.3rem; height: 3.8rem;
                    margin: auto;
                    text-align: center; line-height: 3.8rem;
                    border-radius: 2rem;
                    background-color: #ff2c79; color: #fff;
                }
            }
            >.appJump-btn.iphoneX_btn {
                height: 6.5rem;
            }
        }
    }
    #main.hasBtn {
        padding-bottom: 5.5rem;
    }
    #main.hasBtnIphoneX {
        padding-bottom: 6.5rem;
    }
    .gap {
        background-color: #fafafa;
    }
    .gap.height-1 {
        height: 1rem;
    }
    #load {
        img {
            position: fixed;
            top: 0; bottom: 0; right: 0; left: 0;
            margin: auto;
            width: 5rem; height: 5rem;
        }
    }
</style>
