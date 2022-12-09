<!--
    文件描述：弹窗
    创建人：赵志银
    创建时间：2021.12.01
 -->
<template>
    <div id='main' ref='main'>
        <div class='tab' ref='tab'>
            <div :class='["tablist", index==0?"act":""]' @click='checkTab(0)'>
                <p>识别盆底肌</p>
                <span></span>
            </div>
            <div :class='["tablist", index==1?"act":""]' @click='checkTab(1)'>
                <p>如何训练</p>
                <span></span>
            </div>
            <div :class='["tablist", index==2?"act":""]' @click='checkTab(2)'>
                <p>常见问题</p>
                <span></span>
            </div>
        </div>

        <div class='content' ref='content'>
            <van-swipe :autoplay='0' @change='onChange' ref='swiper' :initial-swipe='2' :show-indicators='false'>
                <van-swipe-item>
                    <div class='watch list' ref='watch'>
                        <div class='msg'>女性</div>
                        <div class='imgbox'>
                            <img src='@/assets/img/apps/kegelTrainGuide/know1.gif'>
                        </div>
                        <img src='@/assets/img/apps/kegelTrainGuide/know2.png'>
                        <div class='normal'>盆底肌是指像弹簧床一样承托和支撑膀胱、子宫、直肠等盆腔脏器的盆底底部肌肉，具有控制排尿排便，托起器官、维持阴道紧缩度和增进性快感等功能。</div>
                    </div>
                </van-swipe-item>
                <van-swipe-item>
                    <div class='how list' ref='how'>
                        <div class='msg'>
                            <div class='tit'>适应练习课程</div>
                            <div class='normal intro'>新用户，跟随语音提示，进行收缩放松盆底肌肉。</div>
                        </div>
                        <div class='msg'>
                            <div class='tit'>慢肌训练类课程</div>
                            <div class='normal intro'>跟随语音提示，保持盆底肌收紧状态，直至放松，休息片刻继续锻炼。</div>
                        </div>
                        <div class='msg'>
                            <div class='tit'>快肌训练类课程</div>
                            <div class='normal intro'>跟随语音提示，快速收缩和放松盆底肌，休息片刻继续锻炼。</div>
                        </div>
                        <div class='msg'>
                            <div class='tit'>混合肌训练类课程</div>
                            <div class='normal intro'>跟随语音提示，混合慢肌和快肌训练，达到完美协调。</div>
                        </div>
                        <div class='msg'>
                            <div class='tit'>行走训练类课程</div>
                            <div class='normal intro'>跟随语音提示，在行走的过程中，收缩和放松盆底肌。</div>
                        </div>
                        <div class='msg'>
                            <div class='tit'>台阶训练类课程</div>
                            <div class='normal intro'>跟随语音提示，在上下台阶的过程中，收缩和放松盆底肌。</div>
                        </div>
                        <div class='msg'>
                            <div class='tit'>下蹲训练课程</div>
                            <div class='normal intro'>跟随语音提示，在下蹲时收缩盆底肌，起身时放松盆底肌。</div>
                        </div>
                        
                </div>
                </van-swipe-item>
                <van-swipe-item>
                    <div class='ask list' ref='ask'>
                        <div>
                            <div class='asklist' v-for='(item,index) of dataArr' :key='index'>
                                <div class='question'>
                                    <img src='@/assets/img/apps/kegelTrainGuide/question.png'>
                                    <p class='tit'>{{item.title}}</p>
                                </div>
                                <div class='answer'>
                                    <img src='@/assets/img/apps/kegelTrainGuide/answer.png'>
                                    <div class='ans'>
                                        <div v-for='(ite,ind) of item.answer' :key='ind'>
                                            <p v-if='ite.type == 0'>{{ite.value}}</p>
                                            <img v-if='ite.type == 1' :src='ite.value' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </van-swipe-item>
            </van-swipe>
        </div>
    </div>
</template>

<script lang="ts">
    import { getBrowserType, getCookie, isEmpty} from '@/utils/common'
    import { Component, Vue, } from 'vue-property-decorator'
    import { Swipe, SwipeItem } from 'vant'
    import 'vant/lib/swipe/style'
    import 'vant/lib/swipe-item/style'
    Vue.use(Swipe).use(SwipeItem)

    @Component
    export default class appsKegelTrainGuide extends Vue {
        private browserType =  getBrowserType()
        private index = 2
        private dataArr = []
        private  minConHeight = 0
        mounted() {
            this.initData()
            this.minConHeight = window.innerHeight - (this.$refs.tab as HTMLElement).offsetHeight
        }
        /**
         * 初始化数据
         * @param
         * @return
         */
        initData() {
            var headerArr = getCookie('app_header').split('|')
            this.$axios.post(`${this.$request.know}/v1/faq/top10`, {
                device: 2,
                target_app: 0
            },{
                headers:{
                    REQUESTCLIENT: !isEmpty(headerArr[0])? headerArr[0] : '1',
                    REQUESTAPP: !isEmpty(headerArr[1])? headerArr[1] : '1',
                    VERSIONFORAPP: !isEmpty(headerArr[2])? headerArr[2] : '4'
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    this.dataArr = res.data.list
                }
            })
        }
        /**
         * 切换tab
         * @param {number} index tab下标
         * @return
         */
        checkTab(index:number) {
            this.index = index
            ;(this.$refs.swiper as any).swipeTo(index)
            if ((this.$refs.content as HTMLElement).scrollTop>0) {
                (this.$refs.content as HTMLElement).scrollTop = 0
            }
            let swipe = document.getElementsByClassName('van-swipe__track') as HTMLCollectionOf<HTMLElement>
            if (this.index == 0) {
                if (this.minConHeight>(this.$refs.watch  as HTMLElement).offsetHeight) {
                    swipe[0].style.height = this.minConHeight+'px'
                } else {
                    swipe[0].style.height = (this.$refs.watch as HTMLElement).offsetHeight+'px'
                }
            } else if (this.index == 1) {
                if (this.minConHeight > (this.$refs.how as HTMLElement).offsetHeight) {
                    swipe[0].style.height = this.minConHeight+'px'
                } else {
                    swipe[0].style.height = (this.$refs.how as HTMLElement).offsetHeight+'px'
                }
            } else if (this.index == 2) {
                if (this.minConHeight > (this.$refs.ask as HTMLElement).offsetHeight) {
                    swipe[0].style.height = this.minConHeight+'px'
                } else {
                    swipe[0].style.height = (this.$refs.ask as HTMLElement).offsetHeight+'px'
                }
            }
        }
        /**
         * 实时监听swiper
         * @param {number} index swiper下标
         * @return
         */
        onChange(index:number) {
            this.index = index
            if ((this.$refs.content as HTMLElement).scrollTop > 0) {
                (this.$refs.content as HTMLElement).scrollTop = 0
            }
            let swipe = document.getElementsByClassName('van-swipe__track') as HTMLCollectionOf<HTMLElement>
            if (this.index == 0) {
                if (this.minConHeight > (this.$refs.watch as HTMLElement).offsetHeight) {
                    swipe[0].style.height = this.minConHeight+'px'
                } else {
                    swipe[0].style.height = (this.$refs.watch as HTMLElement).offsetHeight+'px'
                }
            } else if (this.index == 1) {
                if (this.minConHeight > (this.$refs.how as HTMLElement).offsetHeight) {
                    swipe[0].style.height = this.minConHeight+'px'
                } else {
                    swipe[0].style.height = (this.$refs.how as HTMLElement).offsetHeight+'px'
                }
            } else if (this.index == 2) {
                if (this.minConHeight > (this.$refs.ask as HTMLElement).offsetHeight) {
                    swipe[0].style.height = this.minConHeight+'px'
                } else {
                    swipe[0].style.height = (this.$refs.ask as HTMLElement).offsetHeight+'px'
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    ::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }
    #main {
        position: relative;
        padding-top: 5.2rem;
        height: 100vh;
        border-top-left-radius: 0.7rem;
        border-top-right-radius: 0.7rem;
        background-color: #fff;

        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        overflow-x: hidden;
        overflow-y: auto;
        .tab {
            position: fixed;
            top: 0; left: 0;
            height: 5.2rem; width: 100%;
            border-bottom: 1px solid #F4F4F4;
            display: flex;
            align-items: center;
            background-color: #fff;
            z-index: 1;
            .tablist {
                position: relative;
                p {
                    height: 2.1rem; line-height: 2.1rem;
                    font-size: 1.5rem;
                    color: #666;
                }
            }
            img {
                position: absolute;
                top: 0; right: 0; bottom: 0;
                margin: auto; padding: 1.5rem 1.2rem;
                width: 1.4rem; height: 1.5rem;
                box-sizing: content-box;
            }
            div:nth-of-type(1) {
                margin-left: 1.2rem;
            }
            div:nth-of-type(2) {
                margin: 0 2.8rem;
            }
            .act {
                p {
                    color: #FF2C79;
                }
                span {
                    position: absolute;
                    bottom: -0.6rem; left: 0; right: 0;
                    margin: auto;
                    width: 1.8rem; height: 0.2rem;
                    background-color: #FF2C79;
                }
            }
        }
        .content {
            position: relative;
            .van-swipe-item {
                background-color: #fff;
            }
            .list {
                padding: 1.5rem 1.2rem 0 1.2rem;
                .msg {
                    position: relative;
                    padding-left: 1.1rem;
                    line-height: 2rem;
                    font-size: 1.4rem; color: #666;
                }
                .msg::before {
                    display: inline-block;
                    content: '';
                    position: absolute;
                    top: 0.7rem; left: 0;
                    width: 0.5rem; height: 0.5rem;
                    border-radius: 0.25rem;
                    background-color: #FF2C79;
                }
                .normal {
                    line-height: 2.4rem;
                    font-size: 1.4rem;
                }
                .tit {
                    line-height: 2.1rem;
                    color: #333;
                    font-size: 1.5rem;
                }
                .intro {
                    margin-top: 0.4rem;
                    line-height: 1.8rem;
                    font-size: 1.3rem; color: #999;
                }
            }
            .watch {
                .imgbox {
                    position: relative;
                    width: 100%; height: 13rem;
                    margin-top: 0.6rem;
                    background-color: #fafafa;
                    img {
                        position: absolute;
                        top: 0; left: 0 ;bottom: 0; right: 0;
                        margin: auto;
                        width: auto; height: 11.2rem;
                    }
                }
                >img {
                    margin: 1.6rem 0 0.8rem 0;
                    width: 100%; height: auto;
                }
            }
            .how {
                .msg {
                    padding-bottom: 2.5rem;
                }
                .tit {
                    font-weight: bold;
                }
            }
            .ask {
                padding-right: 0;
                .asklist {
                    margin-bottom: 1.2rem;
                }
                .question,.answer {
                    position: relative;
                    padding-left: 2.5rem;
                    >img:nth-of-type(1) {
                        position: absolute;
                        top: 0.3rem; left: 0;
                        width: 1.8rem; height: 1.9rem;
                    }
                    .tit {
                        padding-right: 1.2rem;
                        font-weight: bold;
                    }
                    .ans {
                        margin-top: 1.3rem; padding: 0 1.2rem 1.3rem 0;
                        border-bottom: 1px solid #f4f4f4;
                        p {
                            line-height: 2.2rem;
                            font-size: 1.4rem ; color: #666; word-break: break-word;
                        }
                        img {
                            display: block;
                            margin-top: 0.7rem;
                            width: 100%; height: auto;
                        }
                        >div:nth-child(1) {
                            >img:nth-child(1) {
                                margin-top: 0;
                            }
                        }
                    }
                }
            }
        }
    }

    .move {
        transition: all 0.3s ease;
    }
</style>