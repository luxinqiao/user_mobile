<template>
    <div id='sign'>
        <img src='@/assets/img/pullNew/sign/bg.png' class='top'>
        <van-swipe class='info' :autoplay="1500" :show-indicators='false' :vertical='true' >
            <div v-for='(item, index) in info' :key='index'>
                <van-swipe-item>
                    <div class='info_list_mid'>
                        <span class='info_list'>{{item}}</span>
                    </div>
                </van-swipe-item>
                <van-swipe-item >
                    <div class='info_list_mid'></div>
                </van-swipe-item>
            </div>
        </van-swipe>
        <div class='title'>新用户福利</div>
        <div class='gift'>
            <img src='@/assets/img/pullNew/sign/wf_one.png'>
            <img src='@/assets/img/pullNew/sign/wf_two.png'>
        </div>
        <input type="number" placeholder='请输入手机号' oninput="if(value.length>11)value=value.slice(0,11);value=value.replace(/[^\d]/g,'')" v-model='phone'>
        <div :class='["btn", {"btn_act":validPhone(phone)}]' @click='receive'>立即领取</div>
        <div class='mid'></div>
        <div class='rule'>
            <div class='rule_tit'>活动规则</div>
            <p>1.活动仅限从未注册过澜渟App和澜渟医生App的新用户参与，每个手机号仅限领取1次；</p>
            <p>2.完成下载并登录App后训练指导视频优惠券自动发放到账号上；</p>
            <p>3.打开极致学院找到对应的课程，点击购买使用优惠券即可免费观看；</p>
            <p>4.可在澜渟App-我的-优惠券，查看自己的优惠券信息；</p>
            <p>5.打开首页-盆底肌肉康复器-训练顾问，即可享受一对一训练指导服务；</p>
            <p>6.此奖品一经领取可永久使用。</p>
        </div>

        <md-alert ref='alert' :show.sync='alertShow' title='领取成功' content='优惠券已放入您的账户，打开澜渟App立即使用吧！' @bindConfirm='confirm()'></md-alert>
        <md-confirm ref='comfirm' :show.sync='confirmShow' :content='confirmCon' @bindRight='confirm()'></md-confirm>
        <md-toast :show.sync='toastShow' :content='errorTip'></md-toast>

        <md-open-app class='open_dom' domId='open_btn' :canUseWx='appOpen.canUse' :style='appOpen.dom' v-if='browserType!="app" && (alertShow || confirmShow) && !isEmpty(appOpen.dom)' @callbackFn='confirm'></md-open-app>
    </div>
</template>

<script lang='ts'>
    import { Vue, Component } from 'vue-property-decorator'
    import {mdToast, mdAlert, mdConfirm, mdOpenApp} from '@/components'
    import {validPhone} from '@/utils/reg'
    import {isEmpty, getBrowserType} from '@/utils/common'
    import {initConfig as initWxSdkConfig} from '@/utils/weChat'

    import { Swipe, SwipeItem } from 'vant'
    Vue.use(Swipe).use(SwipeItem)
    import 'vant/lib/swipe/style'
    import 'vant/lib/swipe-item/style'

    @Component({
        components: {
            mdAlert,
            mdConfirm,
            mdToast,
            mdOpenApp
        }
    })
    export default class pullNewSign extends Vue {
        private phone:string = ''
        private info:Array<string> = []
        private alertShow: boolean = false
        private confirmShow: boolean = false
        private confirmCon: string = ''
        private toastShow: boolean = false
        private errorTip: string = ''
        private validPhone: Function = validPhone
        private isEmpty:Function = isEmpty
        private appOpen:any = {
            canUse: false,
            dom: {}
        }
        private browserType = getBrowserType()

        mounted() {
            this.initData()
            this.initOpenApp()
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
                })()
            }
        }
        /**
         * 初始化页面
         * @param
         * @return
         */
        initData() {
            (this as any).$axios.post(`${(this as any).$request.live}/pull/reg/page`,{
                business_id: this.$route.query.referral_code,
            }, {
                headers: {
                    REQUESTAPP: 1
                }
            }).then((res: any) => {
                if (res.code == 200) {
                    this.info = res.data.recent
                }
            })
        }
        /**
         * 注册
         * @param 
         * @return
         */
        receive() {
            if (!validPhone(this.phone)) {
                return
            }
            ;(this as any).$axios.post(`${(this as any).$request.live}/pull/reg/add`, {
                referral_code: this.$route.query.referral_code,
                phone: this.phone
            },{
                headers: {
                    REQUESTAPP: 1
                }
            }).then((res: any) => {
                let dom
                if (res.code == 200) {
                    this.alertShow = true
                    this.$nextTick(()=>{
                        dom = (this.$refs.alert as any).$refs.alertBtn.getBoundingClientRect()
                        this.appOpen.dom = {
                            top: `${dom.top}px`,
                            left: `${dom.left}px`,
                            width: `${dom.width}px`,
                            height: `${dom.height}px`
                        }
                    })
                } else if (res.code == 602) {
                    this.confirmCon = '仅限新用户领取，<br/>是否前往澜渟App？'
                    this.confirmShow = true
                    this.$nextTick(()=>{
                        dom = (this.$refs.comfirm as any).$refs.comfirmRight.getBoundingClientRect()
                        this.appOpen.dom = {
                            top: `${dom.top}px`,
                            left: `${dom.left}px`,
                            width: `${dom.width}px`,
                            height: `${dom.height}px`
                        }
                    })
                } else if (res.code == 601) {
                    this.confirmCon = '已经领取过啦，不可重复领取。<br/>是否前往澜渟App？'
                    this.confirmShow = true
                    this.$nextTick(()=>{
                        dom = (this.$refs.comfirm as any).$refs.comfirmRight.getBoundingClientRect()
                        this.appOpen.dom = {
                            top: `${dom.top}px`,
                            left: `${dom.left}px`,
                            width: `${dom.width}px`,
                            height: `${dom.height}px`
                        }
                    })
                } else {
                    this.errorTip = res.note
                    this.toastShow = true
                }
            })
        }
        /**
         * 确认弹窗-是
         * @param 
         * @return
         */
        confirm() {
            (this as any).$axios.post(`${(this as any).$request.live}/v1/click`, {
                business_id: this.$route.query.referral_code,
                module: 'pull',
                event: 'lt_register_go_app' 
            },{
                headers: {
                    REQUESTAPP: 1
                }
            }).then((res: any) => {})
            this.alertShow = false
            this.confirmShow = false
        }
    }
</script>

<style lang='scss' scoped>
    #sign {
        position: relative;
        min-height: 100vh; width: 100%;
        background-color: #fff;
        .top {
            position: relative;
            width: 100%; height: auto;
        }
        .info {
            position: absolute;
            top: 0; left: 0; right: 0;
            margin: auto;
            height: 2.8rem; width: 29.4rem;
            .info_list_mid {
                position: relative;
                height: 100%; width: 100%;
                background-color: transparent;
                display: flex;
                justify-content: center; align-items: center;
            }
            .info_list {
                display: block;
                margin: auto;
                height: 2.6rem; width: 29.4rem;
                line-height: 2.8rem; text-align: center;
                font-size: 1.2rem; color: #fff;
                background-color: rgba(0,0,0,0.33);
                border-radius: 1.8rem;
            }
        }
        .title {
            position: relative;
            height: 2.2rem;
            text-align: center; line-height: 2.2rem;
            font-size: 1.6rem; font-weight: bold; letter-spacing: 2px;
        }
        .title::after {
            display: block;
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            margin: auto;
            width: 8rem; height: 0.6rem;
            border-radius: 0.3rem;
            background-color: #FDE1E9;
            opacity: 0.19;
        }
        .gift {
            margin: 3rem 3.4rem 3.7rem 3.4rem;
            height: 6.4rem;
            img {
                width: 14.7rem; height: 6.4rem;
            }
            img:nth-of-type(1) {
                margin-right: 1.3rem;
            }
        }
        input {
            display: block;
            margin: auto;
            width: 27.1rem; height: 3.6rem;
            line-height: 3.6rem; text-align: center;
            border: 1px solid #CCCCCC;
            border-radius: 2.2rem;
        } 
        input:-moz-placeholder {
            font-size: 1.4rem; color: #999;
        }
        input:-ms-input-placeholder {
            font-size: 1.4rem; color: #999;
        }
        ::-webkit-input-placeholder {
            font-size: 1.4rem; color: #999;
        }
        .btn {
            margin: 2rem auto 0 auto;
            width: 27.1rem; height: 3.6rem;
            line-height: 3.6rem; text-align: center;
            font-size: 1.6rem; color: #fff;
            background: linear-gradient(90deg, #FF98BD 0%, #FF2C79 100%);
            border-radius: 2.2rem;
            opacity: 0.3;
        }
        .btn_act {
            opacity: 1;
        }
        .mid {
            position: relative;
            margin-top: 3.4rem;
            width: 100%; height: 1rem;
            background-color: #fafafa;
        }
        .rule {
            position: relative;
            padding: 4rem 2.4rem;
            .rule_tit {
                position: relative;
                margin-bottom: 2rem;
                height: 2.2rem;
                text-align: center; line-height: 2.2rem;
                font-size: 1.6rem; font-weight: bold; letter-spacing: 2px;
            }
            .rule_tit::after {
                display: block;
                content: '';
                position: absolute;
                bottom: 0; left: 0; right: 0;
                margin: auto;
                width: 8rem; height: 0.6rem;
                border-radius: 0.3rem;
                background-color: #D4F3F3;
                opacity: 0.49;
            }
            p {
                margin-bottom: 0.6rem;
                line-height: 2.2rem;
                font-size: 1.3rem; color: #666;
            }
        }
    }
    .open_dom {
        position: fixed;
        z-index: 100;
    }
</style>