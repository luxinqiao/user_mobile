<!-- 课程详情 -->
<template>
<div id='main' :class='data.is_authed=="0"?(isIphoneX?"hasBtnIphoneX":"hasBtn"):""' :style='"padding-top:"+headHeight+"px"'>
    <md-head backMode='close'></md-head>
    <div id='download'>
        <img :src='require("@/assets/img/college/spec/detail/logo.png")'>
        <div class='msg'>
            <p>澜渟App</p>
            <p>听课体验更流畅</p>
        </div>
        <md-open-app class='download-box' domId='download-btn' :canUseWx='appOpen.canUse' :extinfo='appOpen.param'>
            <div class='download-btn'>打开App</div>
        </md-open-app>
    </div>
    <div id='banner'>
        <div class='banner-content' ref='bannerContent'>
            <md-video :videoSrc='banner.videoSrc' :tryTime='banner.tryTime'
                    @ontimeupdate='onVideoTimeUpdate' @onended='onVideoEnded' @ontryend='onTryEnd' ref='mdVideo'>
                <img class='banner-cover' :src='data.cover'>
                <div class='banner-shade preview' v-if='data.is_preview=="1"' @click='playCourse()'>
                    <p class='time'>{{data.release_time}}</p>
                    <p class='text'>正式上线</p>
                </div>
                <div class='banner-shade tryEnd' v-if='banner.coverShade=="tryEnd"'>
                    <p class='text'>试看已结束</p>
                    <div class='reWatch' @click='reWatch()'>
                        <img :src='require("@/assets/img/college/spec/detail/rewatch.png")'>
                        <span>重播</span>
                    </div>
                    <div class='buy' @click='buy()'>立即购买</div>
                </div>
                <div class='banner-shade buy' v-if='banner.coverShade=="buy"' @click='playCourse()'>
                    <p class='text'>请先购买课程</p>
                </div>
            </md-video>
            <div class='banner-virtual-shade' v-if='banner.virtualShade' @click='playCourse()'></div>
        </div>
    </div>
    <div id='info'>
        <div class='info-title'>
            <img class='info-title-logo' :src='require("@/assets/img/college/course/detail/info-logo.png")'>
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
        <div class='info-pay' v-if='data.is_pay=="1"'>已购买</div>
        <div class='info-pay' v-else-if='data.is_exchange=="1"'>已兑换</div>
    </div>
    <div id='coupon' v-if='getCouponShow()' @click='coupon.popupShow=true'>
        <div class='coupon-title'>优惠券</div>
        <div class='coupon-list'>
            <span class='coupon-item' v-for='(item,i) in coupon.datas' :key='i'>{{func.priceTransitionYuan(item.amount)}}元优惠券</span>
        </div>
        <div class='coupon-get'>
            <span>领券</span>
            <img :src='require("@/assets/img/college/spec/detail/arrow-right.png")'>
        </div>
    </div>
    <div class='gap height-1'></div>
    <div id='tabHead'>
        <div class='tabHead-content' ref='tabHead'>
            <div :class='tab=="detail"?"tabHead-content-item active":"tabHead-content-item"' @click='tab="detail"'>
                <span class='text'>详情</span>
                <span class='bottomLine'></span>
            </div>
            <div :class='tab=="comment"?"tabHead-content-item active":"tabHead-content-item"' @click='tab="comment"'>
                <span class='text'>评论</span>
                <span class='bottomLine'></span>
                <span class='mark'>{{comment.num != "0" ? comment.num : ""}}</span>
            </div>
        </div>
    </div>
    <div id='tabContent'>
        <div id='detail' v-show='tab=="detail"' v-html='data.rich_detail'></div>
        <div id='comment' v-if='tab=="comment"'>
            <div class='commnet-nodata' v-if='comment.num=="0"'>
                <img :src='require("@/assets/img/college/spec/detail/nodata.png")'>
                <p>还没有评论哦</p>
            </div>
            <div class='comment-content' v-if='comment.num!="0"'>
                <div class='comment-item' v-for='(pItem, pI) in comment.datas' :key='pI'>
                    <img class='avatar' :src='pItem.avatar'>
                    <p class='nick'>{{pItem.nickname}}</p>
                    <p class='time'>{{pItem.time}}</p>
                    <p class='content'>{{pItem.content}}</p>
                    <div class='answer-box' v-if='pItem.reply_count>0'>
                        <md-open-app :domId='"comment-reply"+pI' :canUseWx='appOpen.canUse' :extinfo='appOpen.param'>
                            <div class='answer'>
                                <p class='answer-item text_ellipsis2' v-for='(sonItem, sonI) in pItem.reply_data' :key='sonI'>
                                    <span class='blue'>{{sonItem.nickname}}</span>
                                    <span v-if='sonItem.reply_nickname!=""'> 回复 </span>
                                    <span class='blue' v-if='sonItem.reply_nickname!=""'>{{sonItem.reply_nickname}}</span>
                                    <span>：{{sonItem.text}}</span>
                                </p>
                                <p class='answer-more' v-if='pItem.reply_count>3'>查看全部回复></p>
                            </div>
                        </md-open-app>
                    </div>
                    <p class='bottomLine'></p>
                </div>
                <div class='comment-nomore' v-if='comment.loading'>加载中...</div>
                <div class='comment-nomore' v-if='comment.lastPage'>-没有更多内容-</div>
            </div>
        </div>
    </div>
    <div id='btn' v-if='data.is_authed=="0"' :class='isIphoneX?"iphoneX_btn":""'>
        <div class='btn-try' v-if='data.is_preview=="0"&&data.free_duration!="0"' @click='tryWatch()'>
            <span class='text'>试看</span>
            <span class='arrow'></span>
            <span class='split'></span>
        </div>
        <div class='btn-buy' @click='buy()'>
            <div>
                <span class='price'>购买：￥{{func.priceTransition(data.price)}}</span>
                <span class='oldPrice' v-if='data.original_price!="0"'>{{func.priceTransition(data.original_price)}}</span>
            </div>
        </div>
    </div>

    <md-popup id='mdPopup' ref='mdPopup' :show.sync='coupon.popupShow' :closeIcon='false'>
        <div id='couponPopup'>
            <div class='couponPopup-item' v-for='(item,i) in coupon.datas' :key='i'>
                <img class='couponPopup-bg' :src='getCouponPopupIcon(item.common_type)'>
                <div class='couponPopup-moneyBox'>
                    <div class='couponPopup-moneyMark'>￥</div>
                    <div class='couponPopup-money'>{{func.priceTransitionYuan(item.amount)}}</div>
                </div>
                <div class='couponPopup-dismiss' v-if='item.type=="1"'>满{{item.full_value}}元可用</div>
                <div class='couponPopup-name'>{{item.name}}</div>
                <div class='couponPopup-time'>有效时间：{{item.begin_date}}至{{item.end_date}}</div>
                <img class='couponPopup-btn' :src='getCouponPopupBtnIcon(item.is_get, item.common_type)' @click='receiveCoupon(item)'>
            </div>
            <div class='couponPopup-confirm' @click='$refs.mdPopup.close()'>
                <div class='btn'>确定</div>
            </div>
        </div>
    </md-popup>
    <md-toast ref='mdToast' :show.sync='toast.show' :content='toast.content'></md-toast>
    <md-custom :show.sync='customShow' id='load' type='transparent'>
        <img :src='require("@/assets/img/common/load.gif")'>
    </md-custom>

    <div id='offShelf' v-if='offShelf.show' :style='"top:"+offShelf.top+"px"'>
        <img :src='require("@/assets/img/college/spec/detail/off-shelf.png")' :style='"margin-top:"+offShelf.contentTop+"px"'>
        <p>该内容已下架</p>
    </div>
    <div id='appJump' v-if='browserType=="app"&&func.getAppProduct()=="wrightinDoctor"' :style='"top:"+headHeight+"px"' @click='jumpWrightinDoctor()'>
        <div :class='["appJump-btn" ,isIphoneX?"iphoneX_btn":""]'>
            <div class='appJump-btn-text'>打开澜渟App学习</div>
        </div>
    </div>
</div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator'
    import {mdPopup, mdVideo, mdToast, mdHead, mdOpenApp, mdCustom} from '@/components'
    import {getToken, getBrowserType, priceTransition, priceTransitionYuan, convertRem, getHeadHeight, convertPx, limit, isEmpty, checkIOSX} from '@/utils/common'
    import {getAppProduct, appFun} from '@/utils/app'
    import {checkTokenEmpty, checkToken} from '@/utils/mdLogin'
    import {initConfig as initWxSdkConfig} from '@/utils/weChat'

    @Component({
        components: {
            mdPopup, mdVideo, mdToast, mdHead, mdOpenApp, mdCustom
        }
    })

    export default class collegeCourseDetail extends Vue {
        private func: object = {
            priceTransition,
            priceTransitionYuan,
            getAppProduct
        }
        private browserType = getBrowserType()
        private headHeight: number = getHeadHeight()
        private param: any = {
            lesson_code: this.$route.query.lesson_code
        }
        private data: any = {}
        private dataLoaded: boolean = false
        private banner: any = {
            coverShade: '',
            virtualShade: true,
            videoSrc: '',
            tryTime: 0
        }
        private descArrow: string = ''
        private coupon: any = {
            datas: [],
            loaded: false,
            popupShow: false
        }
        private videoTime: number = 0
        private tab: string = 'detail'
        private comment: any = {
            datas: [],
            num: '',
            pageNo: 1,
            loading: false,
            lastPage: false
        }
        private toast: any = {
            show: false,
            content: ''
        }
        private appOpen: any = {
            canUse: false,
            param: {
                type: this.$route.query.type,
                code: this.$route.query.lesson_code
            }
        }
        private offShelf: any = {
            show: false,
            top: 0,
            contentTop: 0
        }
        private isIphoneX: boolean = checkIOSX()
        private customShow: boolean = true

        mounted() {
            this.initOpenApp()
        }

        activated() {
            this.initData()
            this.initCoupon()
            this.initComment()
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
            初始化数据
            @param
            @return
         */
        initData() {
            this.$axios.post(`${this.$request.live}/v2/source/lesson`, {
                lesson_code: this.param.lesson_code
            }).then((res: any) => {
                this.dataLoaded = true
                this.customShow = false
                if (res.code == 200) {
                    this.data = res.data
                    this.initDescArrow()
                    this.initScrollListener()
                    this.initVideo()
                } else if (res.code == 214) {
                    this.initOffShelf()
                }
            })
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
                where_code: this.param.lesson_code,
                for_where: '2' //课程
            }).then((res: any) => {
                this.coupon.loaded = true
                if (res.code == 200) {
                    this.coupon.datas = res.data
                    this.initScrollListener()
                }
            })
        }

        /*
            初始化滚动条监听（banner+tab头部滚动固定）
            @param
            @return
         */
        initScrollListener() {
            if (!this.dataLoaded) {
                return
            }
            if (!this.coupon.loaded) {
                return
            }
            this.$nextTick(() => {
                const bannerContentEl = this.$refs.bannerContent as any
                const originMdVideoTop = getHeadHeight() + convertPx(5.2)
                const tabHeadEl = this.$refs.tabHead as any
                const originTabHeadTop = tabHeadEl.getBoundingClientRect().top + this.getScrollTop()
                window.onscroll = (e: any) => {
                    //banner+tab头固定顶部
                    const scrollTop = this.getScrollTop()
                    if (scrollTop >= originMdVideoTop - this.headHeight) {
                        bannerContentEl.style = `position:fixed;z-index:98;top:${this.headHeight}px;left:0;right:0;`
                    } else {
                        bannerContentEl.style = null
                    }
                    if (scrollTop >= originTabHeadTop - this.headHeight - convertPx(21)) {
                        tabHeadEl.style = `position:fixed;z-index:98;top:${this.headHeight+convertPx(21)-1}px;left:0;right:0;`
                    } else {
                        tabHeadEl.style = null
                    }
                    //评论触底分页
                    if (this.tab == 'comment' && !this.comment.lastPage) {
                        const totalH = document.documentElement.scrollHeight //实际内容高度
                        const viewH = document.documentElement.clientHeight //可视窗口高度
                        if (scrollTop >= totalH - viewH - 50) {
                            this.initMoreComment()
                        }
                    }
                }
            })
        }

        /*
            初始化评论
            @param success 成功回调
            @return
         */
        initComment(success?: Function) {
            this.comment.loading = true
            this.$axios.post(`${this.$request.live}/v2/comment/records`, {
                code: this.param.lesson_code,
                page: this.comment.pageNo
            }).then((res: any) => {
                this.comment.loading = false
                if (res.code == 200) {
                    this.comment.lastPage = res.data.is_last_page == "1"
                    this.comment.datas = this.comment.datas.concat(res.data.content)
                    this.comment.num = res.data.total_count
                    success && success()
                }
            })
        }
        
        /*
            初始化更多评论
            @param code 优惠券编码
            @return
         */
        initMoreComment: Function = limit(function(cancelLimit: Function) {
            this.comment.pageNo++
            this.initComment(function() {
                cancelLimit()
            })
        })

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
            初始化专栏下架缺省
            @param
            @return
         */
        initVideo() {
            this.$axios.post(`${this.$request.live}/v1/vod/common`, {
                chap_code: this.data.list[0].code //课程下第1个章节code
            }).then((res: any) => {
                if (res.code == 200) {
                    this.banner.videoSrc = res.data.fileinfo.FileURL
                    this.banner.tryTime = parseInt(this.data.free_duration)
                }
                (this.$refs.mdVideo as any).showCover('normal')
                this.initVideoCover()
            })
        }

        /*
            初始化视频封面
            @param
            @return
         */
        initVideoCover() {
            if (this.data.is_preview == '1') { //预告
                return
            }
            if (this.data.free_duration != "0") { //试看
                (this.$refs.mdVideo as any).pause()
                return
            }
            if (this.data.is_authed == '0') { //（锁）未授权
                return
            }
            (this.$refs.mdVideo as any).pause()
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
            this.initScrollListener()
        }

        /*
            领取优惠券
            @param item 优惠券
            @return
         */
        receiveCoupon(item: any) {
            if (checkTokenEmpty()) {
                return
            }
            if (item.is_get == '1') {
                return
            }
            this.$axios.post(`${this.$request.live}/v1/coupon/get`, {
                coupon_code: item.code,
                channel: '1' //渠道：0-app 1-网页分享
            }).then((res: any) => {
                if (res.code == 200) {
                    item.is_get = '1'
                }
            })
        }

        /*
            购买
            @param
            @return
         */
        buy() {
            checkToken(()=>{
                let url: string = `${this.$request.pay}/#/user/college/product`
                url += `?type=2&token=${getToken()}&code=${this.param.lesson_code}&price=${this.data.price}&detail_url=${encodeURIComponent(window.location.href)}`
                if (!isEmpty(localStorage.md_wechat_openid)) {
                    url += '&openid='+localStorage.md_wechat_openid
                }
                window.location.href = url
            })
        }

        /*
            试看
            @param
            @return
         */
        tryWatch() {
            if (checkTokenEmpty()) {
                return
            }
            (this.$refs.mdVideo as any).restart()
            this.playVideo()
        }

        /*
            重播
            @param
            @return
         */
        reWatch() {
            (this.$refs.mdVideo as any).restart()
            this.playVideo()
        }

        /**
            播放课程
            @param
            @return
         */
        playCourse() {
            //预告 -> 登录 -> 试看课程 -> 锁（购买）-> 正常（播放课程）
            if (this.data.is_preview == '1') { //预告
                this.toast.content = `该课程预计${this.data.release_time}发布`
                this.toast.show = true
                return
            }
            if (checkTokenEmpty()) { //校验登录
                return
            }
            if (this.data.free_duration != "0") { //试看
                this.banner.virtualShade = false
                this.playVideo()
                return
            }
            if (this.data.is_authed == '0') { //（锁）未授权
                this.toast.content = '请先购买课程'
                this.toast.show = true
                this.banner.coverShade = 'buy'
                ;(this.$refs.mdVideo as any).showCover('mode')
                return
            }
            this.banner.virtualShade = false
            this.playVideo()
        }

        /*
            播放视频
            @param
            @return
         */
        playVideo() {
            this.banner.coverShade = ''
            this.videoTime = 0
            ;(this.$refs.mdVideo as any).play()
            this.addLearn()
        }

        /*
            增加学习记录
            @param
            @return
         */
        addLearn: Function = limit(function(cancelLimit: Function) {
            this.$axios.post(`${this.$request.live}/v2/learn/add`, {
                source_code: this.param.lesson_code,
                source_type: '0', //0-课程,1-专栏,2-直播
                rote_code: 1,
                rote_time: this.videoTime,
                chap_code: '',
                isTourist: true
            }).then((res: any) => {
                cancelLimit()
            })
        })

        /*
            监听播放器-播放进度变更
            @param time 播放时长（单位秒）
            @return
         */
        onVideoTimeUpdate(time: number) {
            this.videoTime = time
        }

        /*
            监听播放器-试看结束
            @param time 播放时长（单位秒）
            @return
         */
        onTryEnd(time: number) {
            if (this.data.is_authed == 1) {
                return
            }
            this.addLearn()
            this.banner.coverShade = 'tryEnd'
            ;(this.$refs.mdVideo as any).showCover('mode')
            ;(this.$refs.mdVideo as any).exitFullscreen()
            ;(this.$refs.mdVideo as any).end()
        }

        /*
            监听播放器-播放结束
            @param time 结束时长（单位秒）
            @return
          */
        onVideoEnded(time: number) {
            this.addLearn()
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
        
        /*
            获取滚动条距顶距离
            @param
            @return 滚动条距顶距离
         */
        getScrollTop() {
            return document.documentElement.scrollTop || document.body.scrollTop
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
            获取优惠券图标
            @param common_type 优惠券类型（0-通用 1-专用）
            @return 优惠券图标
         */
        getCouponPopupIcon(common_type: string) {
            if (common_type == '0') {
                return require('@/assets/img/college/spec/detail/coupon-common.png')
            }
            return require('@/assets/img/college/spec/detail/coupon-spec.png')
        }

        /*
            获取优惠券按钮图标
            @param common_type 优惠券类型（0-通用 1-专用）
            @param is_get 是否领用（0-未领用 1-已领用）
            @return 优惠券按钮图标
         */
        getCouponPopupBtnIcon(is_get: string, common_type: string) {
            if (is_get == '1') {
                return require('@/assets/img/college/spec/detail/coupon-hasget.png')
            }
            if (common_type == '0') {
                return require('@/assets/img/college/spec/detail/coupon-common-get.png')
            }
            return require('@/assets/img/college/spec/detail/coupon-spec-get.png')
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
            height: 21rem;
            background-color: #f4f4f4;
            >.banner-content {
                position: relative;
                height: 21rem;
                >.mdVideo {
                    position: relative;
                    height: 21rem;
                }
                .banner-cover {
                    position: absolute; z-index: 1;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    object-fit: cover;
                }
                .banner-shade {
                    position: absolute; z-index: 2;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    overflow: hidden;
                }
                .banner-shade.preview {
                    >.time {
                        margin-top: 7.2rem;
                        height: 2.8rem;
                        text-align:center; line-height: 2.8rem;
                        font-size: 2rem;
                        color: #fff;
                    }
                    >.text {
                        margin-top: 1.8rem;
                        text-align:center;
                        height: 2rem;
                        line-height: 2rem;
                        letter-spacing: 0.1rem;
                        color: #fff;
                    }
                }
                .banner-shade.tryEnd {
                    >.text {
                        margin-top: 6.4rem;
                        height: 2rem;
                        text-align: center; line-height: 2rem;
                        color: #e3e3e3;
                    }
                    >.reWatch {
                        position: absolute;
                        top: 11.6rem; left: 7.6rem;
                        width: 10rem; height: 3rem;
                        border: 1px solid #e3e3e3; border-radius: 3rem;
                        display: flex; align-items: center; justify-content: center;
                        >img {
                            display: block;
                            width: 1.3rem; height: 1.5rem;
                        }
                        >span {
                            margin-left: 1rem;
                            line-height: normal;
                            font-size: 1.3rem;
                            color: #e3e3e3;
                        }
                    }
                    >.buy {
                        position: absolute;
                        top: 11.6rem; right: 7.6rem;
                        width: 10rem; height: 3rem;
                        display: flex; align-items: center; justify-content: center;
                        border-radius: 3rem;
                        font-size: 1.3rem;
                        background-color: #FF2C79; color: #e3e3e3;
                    }
                }
                .banner-shade.buy {
                    >.text {
                        position: absolute;
                        top: 0; bottom: 0; left: 0; right: 0;
                        margin: auto;
                        height: 2rem;
                        text-align: center; line-height: 2rem;
                        color: #fff;
                    }
                }
                >.banner-virtual-shade {
                    position: absolute; z-index: 9;
                    top: 0; bottom: 0; left: 0; right: 0;
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
                >.info-study-num {
                    font-size: 1.2rem;
                    color: #666;
                }
                >.info-study-unit {
                    font-size: 1.2rem;
                    color: #999;
                }
            }
            >.info-pay {
                position: absolute;
                bottom: 1.2rem; right: 1.2rem;
                height: 1.7rem;
                line-height: 1.7rem;
                font-size: 1.2rem;
                color: #ff2c79;
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
                    background: url(../../../assets/img/college/spec/detail/coupon.png) no-repeat 0 0;
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
        #tabHead {
            height: 4.5rem;
            background-color: #fff;
            >.tabHead-content {
                display: flex;
                height: 4.5rem;
                border-bottom: 1px solid #f4f4f4;
                background-color: #fff;
                >.tabHead-content-item {
                    flex: 1;
                    position: relative;
                    >.text {
                        position: absolute;
                        top: 1.6rem; left: 0; right: 0;
                        height: 2.1rem;
                        text-align: center; line-height: 2.1rem;
                        font-size: 1.5rem;
                        color: #999;
                    }
                    >.bottomLine {
                        position: absolute;
                        bottom: 0.4rem; left: 0; right: 0;
                        margin: auto;
                        width: 1.4rem; height: 0.2rem;
                        border-radius: 0.2rem;
                    }
                    >.mark {
                        position: absolute;
                        top: 1.8rem; left: 11.2rem;
                        height: 1.2rem;
                        line-height: 1.2rem;
                        font-size: 1.2rem;
                        color: #999;
                    }
                }
                >.tabHead-content-item.active {
                    >.text {
                        font-weight: bold;
                        color: #333;
                    }
                    >.bottomLine {
                        background-color: #333;
                    }
                    >.mark {
                        font-weight: bold;
                        color: #333;
                    }
                }
            }
        }
        #tabContent {
            background-color: #FFF;
            >#detail {
                margin: 0 1.2rem; padding: 1.2rem 0 2.4rem 0;
                ::v-deep >img {
                    display: block;
                    width: 100%;
                }
            }
            >#comment {
                >.commnet-nodata {
                    padding-top: 7rem;
                    height: 28.3rem;
                    >img {
                        display: block;
                        margin: auto;
                        width: 15rem; height: 10.9rem;
                    }
                    >p {
                        margin-top: 1.6rem;
                        height: 2rem;
                        text-align: center; line-height: 2rem;
                        color: #666;
                    }
                }
                >.comment-content {
                    >.comment-item {
                        position: relative;
                        padding: 2rem 0 1.6rem 0;
                        >.avatar {
                            position: absolute;
                            top: 2rem; left: 1.2rem;
                            width: 3rem; height: 3rem;
                            border-radius: 3rem;
                        }
                        >.nick {
                            margin-left: 5rem;
                            height: 2rem;
                            line-height: 2rem;
                            color: #666;
                        }
                        >.time {
                            margin-left: 5rem;
                            height: 1.4rem;
                            line-height: 1.4rem;
                            font-size: 1rem;
                            color: #999;
                        }
                        >.content {
                            margin: 0.8rem 0 0 5rem;
                            width: 31.3rem;
                            line-height: 2rem;
                        }
                        .answer-box {
                            position: relative;
                            margin: 0.8rem 0 0 4.8rem; 
                            width: 31.5rem;
                            border-radius: 0.2rem;
                            background-color: #f6f6f6;
                            .answer{
                                position: relative;
                                padding: 0.6rem 0.4rem 0.8rem 0.8rem;
                                >.answer-item {
                                    margin-top: 0.4rem;
                                    >span {
                                        font-size: 1.3rem;
                                        color: #666;
                                    }
                                    >.blue {
                                        color: #5A7CAB;
                                    }
                                }
                                >.answer-item:nth-child(1) {
                                    margin-top: 0;
                                }
                                >.answer-more {
                                    margin-top: 0.4rem;
                                    font-size: 1.3rem;
                                    color: #5A7CAB;
                                }
                            }
                        }
                        >.bottomLine {
                            position: absolute;
                            bottom: 0; left: 5rem; right: 0;
                            height: 1px;
                            background-color: #EFEFEF;
                        }
                    }
                    >.comment-nomore {
                        padding-top: 1.6rem;
                        height: 6rem;
                        text-align: center; line-height: 1.7rem;
                        font-size: 1.2rem;
                        color: #999;
                    }
                }
            }
        }
        #btn {
            display: flex;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            height: 5.5rem;
            border-top: 0.5px solid #f4f4f4;
            background-color: #FFF;
            >.btn-try {
                position: relative;
                width: 10.7rem; height: 5.5rem;
                >.text {
                    position: absolute;
                    top: 0; bottom: 0; left: 2.4rem;
                    margin: auto;
                    height: 2.2rem;
                    line-height: 2.2rem;
                    font-size: 1.6rem;
                    color: #ff2c79;
                }
                >.arrow {
                    position: absolute;
                    top: 0.1rem; bottom: 0; left: 6.4rem;
                    margin: auto;
                    width: 0; height: 0;
                    border-top: 0.53rem solid transparent; border-bottom: 0.53rem solid transparent; border-left: 0.7rem solid #ff2c79;
                }
                >.split {
                    position: absolute;
                    top: 0; bottom: 0; right: 1.2rem;
                    margin: auto;
                    width: 0.1rem; height: 2.6rem;
                    background-color: #f4f4f4;
                }
            }
            >.btn-buy {
                flex: 1;
                height: 5.5rem;
                >div {
                    display: flex;
                    justify-content: center; align-items: center;
                    margin: 1rem 1.2rem 0 1.2rem;
                    height: 3.8rem;
                    border-radius: 2rem;
                    background-color: #ff2c79;
                    >.price {
                        line-height: normal;
                        font-size: 1.4rem;
                        color: #fff;
                    }
                    >.oldPrice {
                        margin-left: 0.3rem;
                        line-height: normal;
                        font-size: 1.2rem;
                        text-decoration: line-through;
                        color: #fff;
                    }
                }
            }
        }
        #btn.iphoneX_btn {
            height: 6.5rem;
        }
        #couponPopup {
            position: relative;
            padding: 2rem 1.2rem 7.5rem 1.2rem;
            max-height: 53.4rem;
            border-top-left-radius: 0.7rem; border-top-right-radius: 0.7rem;
            overflow: auto;
            background-color: #FFF;
            >.couponPopup-item {
                position: relative;
                margin-top: 1.6rem;
                width: 35.4rem; height: 8.1rem;
                >.couponPopup-bg {
                    position: absolute; z-index: 1;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                }
                >.couponPopup-moneyBox {
                    position: absolute; z-index: 2;
                    top: 0; bottom: 0; left: 0; 
                    margin: auto;
                    height: 5rem; width: 9.2rem;
                    line-height: 5rem; text-align: center;
                    display: flex; align-items: baseline; justify-content: center;
                    >.couponPopup-moneyMark {
                        font-size: 1.2rem;
                        color: #FFF;
                    }
                    >.couponPopup-money {
                        font-size: 3.6rem;
                        color: #FFF;
                    }
                }
                >.couponPopup-dismiss {
                    position: absolute; z-index: 2;
                    top: 5.9rem; left: 2.3rem;
                    font-size: 1rem;
                    color: #FFF;
                }
                >.couponPopup-name {
                    position: absolute; z-index: 2;
                    top: 1.7rem; left: 11.6rem;
                }
                >.couponPopup-time {
                    position: absolute; z-index: 2;
                    top: 4.8rem; left: 11.6rem;
                    font-size: 1rem;
                    color: #999;
                }
                >.couponPopup-btn {
                    position: absolute; z-index: 2;
                    top: 1.6rem; right: 1.6rem;
                    width: 5rem; height: 5rem;
                }
            }
            >.couponPopup-item:nth-child(1) {
                margin-top: 0;
            }
            >.couponPopup-confirm {
                position: fixed; z-index: 99;
                bottom: 0; left: 0; right: 0;
                padding-top: 0.8rem;
                height: 5.5rem;
                box-shadow: 0 0.2rem 0.8rem 0 rgba(102, 102, 102, 0.26);
                background-color: #FFF;
                >.btn {
                    margin: auto;
                    width: 35.1rem; height: 4rem;
                    text-align: center; line-height: 4rem;
                    border-radius: 2.5rem;
                    font-size: 1.6rem;
                    background-color: #ff2c79; color: #FFF;
                }
            }
        }
        #offShelf {
            position: absolute; z-index: 99;
            bottom: 0; left: 0; right: 0;
            background: #fff;
            >img {
                display: block;
                margin: auto;
                width: 14.9rem; height:10.9rem;
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
