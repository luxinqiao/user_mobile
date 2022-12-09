<!--
    文件描述：快速上手
    创建人：赵志银
    创建时间：2021.11.29
 -->
<template>
    <div id='main' ref='main' >
        <md-head v-if='browserType != "app"'></md-head>

        <div class='content_box'>
            <div class='open' ref='open' v-if='browserType != "app"'>
                <img src='@/assets/img/apps/kegelQuickStart01/logo.png'>
                <div class='msg'>
                    <p>澜渟</p>
                    <p>盆底肌修复 免费凯格尔运动</p>
                </div>
                <md-open-app  domId='download_btn' :canUseWx='canUse' class='download'>
                    <div>下载APP</div>
                </md-open-app>
            </div>
            <div class='top' ref='top'>
                <img class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/top.png')">
            </div>
            <div class='middle'>
                <div class='list listone'>
                    <img class='title quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/title1.png')">
                    <p class='content'>盆底肌是指像弹簧床一样承托和支撑膀胱、子宫、直肠等盆腔脏器的盆底底部肌肉，具有控制排尿排便，托起器官、维持阴道紧缩度和增进性快感等功能。</p>
                    <div class='imgbox'>
                        <img @click='previewImg(0)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/1-1.gif')">
                        <img @click='previewImg(1)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/1-2.png')">
                    </div>
                </div>

                <div class='list listtwo'>
                    <img class='title quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/title2.png')">
                    <div class='imgbox'>
                        <img @click='previewImg(2)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/2-1.png')">
                        <img @click='previewImg(3)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/2-2.png')">
                    </div>
                    <p class='content'><span>注意</span>：日常生活中，不要刻意进行中断小便动作，养成这种不好的习惯或者在膀胱充盈的时候进行凯格尔运动，反而会削弱盆底肌的力量，甚至导致尿路感染。</p>
                </div>

                <div class='list listthree'>
                    <img class='title quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/title3.png')">
                    <div class='swiper'>
                        <van-swipe :auto='0' ref='vantswipe'>
                            <van-swipe-item @click='previewImg(4)'>
                                <img @click='previewImg(4)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/banner1.png')">
                            </van-swipe-item>
                            <van-swipe-item @click='previewImg(5)'>
                                <img class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/banner2.png')">
                            </van-swipe-item>
                            <van-swipe-item @click='previewImg(6)'>
                                <img class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/banner3.png')">
                            </van-swipe-item>
                            <van-swipe-item @click='previewImg(6)'>
                                <img @click='previewImg(7)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/banner4.png')">
                            </van-swipe-item>
                        </van-swipe>
                    </div>
                    <div class='titbox'>
                        <p class='titcon'>
                            <span>判断球体是否合适的方法</span>
                        </p>
                    </div>
                    <p class='content'>选择某一号球，放入阴道后，进行站立，行走，跳跃，如果球不掉，即该球号为目前合适的球号。如果感觉需要屁股紧夹着、不敢说话，说明该球号太重了，不合适，建议换上一号球进行测试。</p>
                    <div class='titbox'>
                        <p class='titcon titcontwo'>
                            <span>何时更换下一号球</span>
                        </p>
                    </div>
                    <p class='content'>当下蹲、上下台阶、跳跃的时候均可以保持住球不掉的话就可以尝试更换下一号球了。</p>
                </div>

                <div class='list listfour'>
                    <img class='title quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/title4.png')">
                    <p class='content'>根据自身情况或咨询医生的前提下，正确的选择合适的训练课程，完成科学的训练。</p>
                    <img @click='previewImg(8)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/4-1.png')">
                    <p class='content con'><span>适应练习课程</span>：新用户，跟随语音提示，进行收缩放松盆底肌肉。</p>
                    <p class='content con'><span>慢肌训练类课程</span>：跟随语音提示，保持盆底肌收紧状态，直至放松，休息片刻继续锻炼。</p>
                    <p class='content con'><span>快肌训练类课程</span>：跟随语音提示，快速收缩和放松盆底肌，休息片刻继续锻炼。</p>
                    <p class='content con'><span>混合肌训练类课程</span>：跟随语音提示，混合慢肌和快肌训练，达到完美协调。</p>
                    <p class='content con'><span>行走训练类课程</span>：跟随语音提示，在行走的过程中，收缩和放松盆底肌。</p>
                    <p class='content con'><span>台阶训练类课程</span>：跟随语音提示，在上下台阶的过程中，收缩和放松盆底肌。</p>
                    <p class='content con'><span>下蹲课程</span>：跟随语音提示，在下蹲时收缩盆底肌，起身时放松盆底肌。</p>
                </div>

                <div class='list listfive'>
                    <img class='title quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/title5.png')">
                    <p class='content'>根据美国国立卫生研究院（NIH）的数据，每天坚持做凯格尔运动，最快会在<span>4-6周</span>后感觉到效果。坚持训练一段时间后，可以到医院进行复查，检验训练的效果。</p>
                    <div class='imgbox'>
                        <img @click='previewImg(9)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/5-1.png')">
                        <img @click='previewImg(10)' class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/5-2.png')">
                    </div>
                    <p class='content'>使用澜渟您可以体验到最科学的锻炼方法，我们建议您每天锻炼<span>15-20分钟</span>，请勿过量训练。</p>
                    <div class='ask'>
                        <span>如还有疑问请点击</span>
                        <md-open-app domId='ask_btn' :canUseWx='canUse' v-if='browserType != "app"' class='ask_btn'>
                            <img  class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/ask.png')"><span>训练顾问</span>
                        </md-open-app>
                        <div class='ask_btn' @click='goAsk' v-else><img  class='quick_img' :src="require('@/assets/img/apps/kegelQuickStart01/ask.png')"><span>训练顾问</span></div>
                    </div>
                    <div class='tel'>
                        <span>或拨打电话咨询</span><a href='tel:400-133-5668'>400-133-5668</a>
                    </div>
                </div>

            </div>
            
            <md-open-app domId='train_btn' :canUseWx='canUse' v-if='browserType != "app"' class='btn'>
                <div>适应练习</div>
            </md-open-app>
            <div class='btn' v-else>
                <div @click='goTrain'>适应练习</div>
            </div>
        </div>

        <div class='image_preview' @touchstart.stop='handleStart($event)' @touchend.stop='handleEnd($event)' @touchmove.stop='handleMove($event)'>
            <van-image-preview
                v-model='isShowPreview'
                :images='preImgArr'
                :start-position='startIndex'
                @close='onClose()'
                @change='changeImg'
            >
            </van-image-preview>
        </div>
        <md-popup id='mdPopup' ref='mdPopup' :show.sync='isPop' :closeIcon='false'>
            <div class='download_img'>
                <div @click.stop='downloadImage'>保存图片/动图</div>
                <div class='cancle_btn' @click.stop='closePop'>取消</div>
            </div>
        </md-popup>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, } from 'vue-property-decorator'
    import {ImagePreview, Swipe, SwipeItem} from 'vant'
    import 'vant/lib/image-preview/style'
    import 'vant/lib/swipe/style'
    import 'vant/lib/swipe-item/style'
    Vue.use(ImagePreview)
    Vue.use(Swipe)
    Vue.use(SwipeItem)

    import {mdPopup, mdHead, mdOpenApp} from '@/components'
    import {isEmpty, getBrowserType, getHeadHeight} from '@/utils/common'
    import {askConsultant, goTrain, downloadImg} from '@/utils/app'
    import {initConfig as initWxSdkConfig} from '@/utils/weChat'

    @Component({
        components: {
            mdPopup,mdHead, mdOpenApp
        }
    })
    export default class appsKegelQuickStart01 extends Vue {
        private canUse:any = false
        private isShowPreview:boolean=  false
        private startIndex = 0
        private curIndex = 0
        private isFirst = false
        private browserType = getBrowserType()
        private isPop = false
        private longClick = 0
        private timeOutEvent:any = null
        private downloadImgSrc = ''
        private preImgArr = [
                    require('@/assets/img/apps/kegelQuickStart01/1-1.gif'),
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/db62ab8993fe75fa835c1123a8d368f3.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/bcffe6308141594d2f3d2b3947e7dee0.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/fb5faa32dc8f70d8f0414050a304ac45.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/f36732014aacc7abecc18bcf04d84dd8.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/5b158f6b84f285eef3446cbce1ad4931.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/5ea52c15906d3e5cc98d757c783b2294.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/7dc2139e5eaee425b0374dd2272c151a.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/3c628d94ea50df6e2a175c70a663be98.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/1419dec3cae4a61c3989774359b1fc7e.png',
                    'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/8cc2c674c54da73b15d4937819b90f19.png',
                ]
        private headHeight = getBrowserType() == 'app' ? 0 : getHeadHeight()
        mounted() {
            if(this.browserType == 'wechat') {
                (async () => {
                    const canUse = await initWxSdkConfig()
                    this.canUse = canUse
                })()
                ;(this.$refs.open as any).style.top = '0'
                ;(this.$refs.main as any).style.paddingTop = '0'
            } else if(this.browserType == 'app') {
                ;(this.$refs.main as any).style.paddingTop = '0'
                ;(this.$refs.top as any).style.paddingTop = '0'
            }
        }
        /**
         * 预览-实时监听
         * @param {number} index 下标
         * @return
        */
        changeImg(index: number){
            this.isFirst = false
            if(this.isPop) {
                this.isPop = false
            }
            if(index == 0) {
                this.downloadImgSrc = 'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/92ad4a88e8f87d0b4fb9be6365603a51.gif'
            } else {
                this.downloadImgSrc = this.preImgArr[index]
            }
            this.curIndex = index
        }
        /**
         * 开始预览
         * @param {number} index 下标
         * @return
        */
        previewImg(index: number){
            this.isFirst = true
            if(this.isPop) {
                this.isPop = false
            }
            if(index == 0) {
                this.downloadImgSrc = 'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/07/08/92ad4a88e8f87d0b4fb9be6365603a51.gif'
            } else {
                this.downloadImgSrc = this.preImgArr[index]
            }
            this.startIndex = index
            this.isShowPreview = true
        }
        /**
         * 关闭预览
         * @param 
         * @return
        */
        onClose() {
            this.isShowPreview = false 
            this.closePop()
            this.downloadImgSrc = ''
        }
        /**
         * 触摸开始
         * @param {dom} e 触摸事件
         * @return
        */
        handleStart(e:any) {
            this.longClick = 0
            this.timeOutEvent = setTimeout(()=> {
                if(this.browserType == 'app') {
                    this.longClick = 1
                    this.showPop()
                }
            }, 500)
        }
        /**
         * 触摸移动（如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按 ）
         * @param {dom} e 触摸事件
         * @return
        */
        handleMove(e: any) {
            e.preventDefault()
            clearTimeout(this.timeOutEvent)
            this.timeOutEvent = 0
        }
        /**
         * 触摸结束（手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件 ）
         * @param {dom} e 触摸事件
         * @return
        */
        handleEnd(e: any) {
            clearTimeout(this.timeOutEvent)
            return false
        }

        /**
         * 显示弹出层
         * @param 
         * @return
        */
        showPop() {
            this.isPop = true
        }
        /**
         * 关闭弹出层
         * @param 
         * @return
        */
        closePop() {
            this.isPop = false
        }
        /**
         * 下载图片
         * @param 
         * @return
        */
        downloadImage() {
            if(this.browserType == 'app') {
                this.isPop = false
                downloadImg(this.downloadImgSrc)
            } else {
                if(!isEmpty(this.downloadImgSrc)) {
                    var a:any = document.createElement('a')
                    a.download = (new Date()).getTime()
                    a.href = this.downloadImgSrc
                    a.click()
                }
                this.isPop = false
            }
        }
        /**
         * 跳转-去训练
         * @param 
         * @return
        */
        goTrain() {
            goTrain()
        }
        /**
         * 跳转-训练顾问
         * @param 
         * @return
        */
        goAsk() {
            askConsultant()
        }
    }
</script>
<style lang='scss' scoped>
    #main {
        position: relative;
        padding-top: 4.4rem;
        .share {
            position: absolute;
            top: 0; right: 0;
            width: 1rem; height: 1rem;
        }
        .content_box {
            position: relative;
            z-index: 0;
            background-color: #fff;
        }
        .open {
            position: fixed;
            top: 4.4rem; left: 0;
            width: 100%; height: 5.2rem;
            background-color: #FFF5F9;
            z-index: 1;
            >img {
                position: absolute;
                top: 0.7rem; left: 1.2rem;
                width:3.4rem; height: 3.6rem;
            }
            >.msg {
                margin-left: 5.4rem; padding-top: 0.5rem;
                >p:nth-child(1) {
                    height: 2.2rem;
                    line-height: 2.2rem;
                    font-size: 1.5rem; color: #FF2C79;
                }
                >p:nth-child(2) {
                    height: 1.8rem;
                    line-height: 1.8rem;
                    font-size: 1.3rem; color: #C79AAD;
                }
            }
            >.download {
                position: absolute;
                top: 1rem; right: 1.2rem;
                width: 7.4rem; height:2.8rem;
                line-height: 2.8rem; text-align: center;
                border-radius: 1.5rem;
                background-color: #FF2C79;
                div {
                    font-size: 1.2rem; color: #fff;
                }
            }
        }
        .top {
            padding-top: 5.2rem;
            >img,div {
                width: 100%; height: 9rem;
            }
        }
        .middle {
            position: relative;
            padding: 1.2rem;
            >.list {
                padding-bottom: 3rem;
                >.title {
                    display: block;
                    padding-top: 1.7rem;
                    height: 2.7rem; width: auto;
                    box-sizing: content-box;
                }
                >.content {
                    font-size: 1.4rem; line-height: 2.4rem;
                    >span {
                        color: #FF2C79;
                    }
                }
                .imgbox {
                    display: flex;
                    justify-content: space-between;
                    >img:nth-child(1) {
                        width: 16.9rem; height: 9rem;
                    }
                    >img:nth-child(2) {
                        width: 17.1rem; height: 9rem;
                    }
                }
            }
            >.listone {
                >.content {
                    margin: 0.2rem 0 0.8rem 0;
                }
            }
            >.listtwo {
                >.content {
                    margin-top: 0.8rem;
                    color: #666;
                }
                >.imgbox {
                    margin-top: 0.6rem;
                    >img:nth-child(1) {
                        width: 17rem; height: 16.6rem;
                    }
                    >img:nth-child(2) {
                        width: 17rem; height: 16.6rem;
                    }
                }
            }
            >.listthree {
                >.title {
                    margin-bottom: 0.6rem;
                }
                >.swiper {
                    margin-bottom: 2.2rem;
                    height: 16rem; width: 100%;
                    img {
                        width: 100%; height: 16rem;
                    }
                }
                >.titbox {
                    text-align: center;
                    >.titcon {
                        position: relative;
                        display: inline-block;
                        margin: 0 auto 1.2rem 0;
                        height: 2.1rem;
                        >span {
                            font-size: 1.5rem;
                            padding: 0 0.6rem;
                        }
                    }
                    >.titcon::after {
                        display: block;
                        content: '';
                        height: 1.2rem; width: 100%;
                        position: absolute;
                        bottom: 0; left: 0;
                        background:rgba(255,44,121,0.23);
                    }
                    >.titcontwo {
                        margin-top: 2.8rem;
                    }
                }
            }
            .listfour {
                >p:nth-child(2) {
                    margin: 0.5rem 0 0.8rem 0;
                }
                >img {
                    width: 100%; height: auto;
                }
                >.con {
                    position: relative;
                    padding-left: 1.2rem; margin-bottom: 1.6rem;
                }
                >.con::before {
                    display: inline-block;
                    content: '';
                    position: absolute;
                    top: 1rem; left: 0;
                    width: 0.5rem; height: 0.5rem;
                    border-radius: 0.25rem;
                    background-color: #FF2C79;
                }
                >p:last-child {
                    margin-bottom: 0;
                }
            }
            .listfive {
                >p:nth-of-type(1) {
                    margin: 0.5rem 0 0.9rem 0;
                }
                >p:nth-of-type(2) {
                    margin: 1.6rem 0 2.9rem 0;
                }
                >.ask {
                    margin-bottom: 1.1rem;
                    height: 3rem;
                    text-align: center; line-height: 3rem;
                    >span {
                        vertical-align: middle;
                        font-size: 1.3rem;
                    }
                    .ask_btn {
                        display: inline-flex;
                        align-items: center;
                        margin-left: 0.7rem;
                        vertical-align: middle;
                        width: 9.8rem; height: 3rem;
                        background-color: #FF2C79;
                        border-radius: 1.5rem;
                        img {
                            display: block;
                            margin: 0 0.5rem 0 1.1rem;
                            width: 1.7rem; height: 1.8rem;
                        }
                        span {
                            font-size: 1.3rem; color: #fff;
                        }
                    }
                }
                >.tel {
                    padding-bottom: 5.9rem;
                    height: 2.4rem;
                    text-align: center; line-height: 2.4rem;
                    >span {
                        vertical-align: middle;
                        font-size: 1.3rem;
                    }
                    >a {
                        margin-left: 0.5rem;
                        vertical-align: middle;
                        font-size: 1.3rem; color: #7694CF;
                        text-decoration: none;
                    }
                }
            }
        }
        .btn {
            position: fixed;
            bottom: 0; left: 0;
            padding: 0 1.2rem;
            width: 100%; height: 5.5rem;
            box-shadow:0px 4px 16px 0px rgba(102,102,102,0.26);
            background-color: #fff;
            >div {
                position: absolute;
                top: 0; left: 0; bottom: 0; right: 0;
                margin: auto;
                width: 35.1rem; height: 4rem;
                line-height: 4rem; text-align: center;
                font-size: 1.6rem; color: #fff;
                border-radius: 2rem;
                background-color: #FF2C79;
            }
        }
        .download_img {
            background-color: #F6F6F6;
            >div {
                height: 5.1rem; width: 100%;
                line-height: 5.1rem; text-align: center;
                font-size: 1.8rem;
                background-color: #fff;
            }
            >.cancle_btn {
                margin-top: 0.6rem;
                height: 4.8rem; width: 100%;
                line-height: 4.8rem; text-align: center;
                background-color: #fff;
            }
        }
        .image_preview {
            z-index: 2;
            /deep/ .van-image-preview__overlay {
                background-color: rgba(0,0,0,1) !important;
            }
            >>>.van-overlay {
                z-index: 2 !important;
                background-color: rgba(0,0,0,1) !important;
            }
        }
    }
    /deep/ .van-swipe__indicator {
        background: #FBD0E0 !important;
        opacity: 1;
    }
    /deep/ .van-swipe__indicator--active {
        background: #FF2C79 !important;
    }
    /deep/ .mdPopup {
        z-index: 2002 !important;
    }
</style>