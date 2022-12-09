<template>
    <div class='mdVideo' ref='mdVideo'>
        <video class='video' v-if='videoData.src!=""' :class='coverData.show&&coverData.mode?"hide":""' :src='videoData.src'
               @click='showControl()' playsinline webkit-playsinline ref='video'>
        </video>
        <div class='cover' :class='coverData.mode?"coverMode":""' v-if='coverData.show'>
            <slot></slot>
        </div>
        <img class='loading' v-if='videoData.status=="loading"' :src='require("@/components/video/img/loading.png")'>
        <div class='shade' v-else-if='["pause","end"].includes(videoData.status)'>
            <img :src='require("@/components/video/img/pause.png")' @click='togglePlay()'>
        </div>
        <div class='control' v-if='["pause","end"].includes(videoData.status) || videoData.control'>
            <img class='playBtn' :src='getPlayBtnIcon()' @click='togglePlay()'>
            <span class='currTime'>{{convertTime(videoData.showCurrTime)}}</span>
            <div class='progress' ref='progress'>
                <span class='progress-total'></span>
                <span class='progress-played' :style='"width:"+getPlayedPercent()+"%"'></span>
                <span class='progress-point' :style='"left:"+getPlayedPercent()+"%"'
                      @touchstart.prevent='touchstart($event)' @touchmove.prevent='touchmove($event)' @touchend.prevent='touchend($event)'>
                    <span class='progress-point-circle'></span>
                </span>
            </div>
            <span class='totalTime'>{{convertTime(videoData.totalTime)}}</span>
            <img class='fullScreen' :src='require("@/components/video/img/fullScreen.png")' @click='toggleFullScreen()'>
        </div>
    </div>
</template>

<script>
    import {getAppType} from '@/utils/app'
    import {debounce} from '@/utils/common'

    export default {
        name: 'mdVideo',
        props: {
            //视频链接
            videoSrc: {type: String, default: () => ''},
            //试看时长
            tryTime: {type: Number, default: () => 0}
        },
        data() {
            return {
                appType: getAppType(),
                coverData: {
                    show: false,
                    mode: false
                },
                videoData: {
                    src: '',
                    control: false,
                    status: '', //loading-加载 play-播放 pause-暂停 end-结束
                    currTime: 0, //实际进度时间
                    showCurrTime: 0, //左下角进度时间
                    totalTime: 0,
                    playedPercent: 0,
                    fullScreen: false
                },
                touch: {
                    isMove: false,
                    x: 0,
                    currTime: 0
                }
            }
        },
        mounted() {
            this.videoData.src = this.videoSrc
        },
        methods: {
            /*
                初始化视频事件监听
                @param
                @return
             */
            initListener() {
                const video = this.$refs.video
                if (video) {
                    video.ondurationchange = e => {
                        this.onDurationchange(video.duration)
                    }
                    video.onwaiting = e => {
                        this.onWaiting(e)
                    }
                    video.onplaying = e => {
                        this.onPlaying(e)
                    }
                    video.ontimeupdate = e => {
                        this.onTimeUpdate(e)
                    }
                    video.onended = e => {
                        this.onEnded(e)
                    }
                    //为了解决ios微信，全屏切换时，视频自动暂停,状态不统一
                    video.onpause = e => {
                        this.videoData.status = 'pause'
                        this.showControl()
                    }
                }
            },
            
            /*
                监听视频时长变化（NaN->实际时长）
                @param {Dom} e 视频时长
                @return
             */
            onDurationchange(duration) {
                this.videoData.totalTime = duration
            },

            /*
                监听视频加载中
                @param {Dom} e 视频
                @return
             */
            onWaiting(e) {
                this.loading()
            },

            /*
                监听视频加载完成
                @param {Dom} e 视频
                @return
             */
            onPlaying(e) {
                this.hideLoading()
                this.videoData.status = 'play'
            },

            /*
                监听视频播放进度
                @param {Dom} e 视频
                @return
             */
            onTimeUpdate(e) {
                this.videoData.currTime = e.target.currentTime
                if (!this.touch.isMove) {
                    this.videoData.showCurrTime = e.target.currentTime
                }
                this.$emit('ontimeupdate', e.target.currentTime)
                //试看逻辑
                if (this.tryTime == 0) {
                    return
                }
                if (e.target.currentTime > this.tryTime) {
                    this.$emit('ontryend', e.target.currentTime)
                }
            },

            /*
                监听视频播放结束
                @param {Dom} e 视频
                @return
             */
            onEnded(e) {
                this.end()
                this.$emit('onended', e.target.currentTime)
            },
            
            /**
                显示控制栏
                @param
                @return
             */
            showControl() {
                this.videoData.control = true
                this.debounceControl()
            },
            debounceControl: debounce(function() {
                this.videoData.control = false
            }, 3000),

            /*
                显示封面
                @param type 类型（normal-不置顶，mode-置顶）
                @return
             */
            showCover(type = 'normal') {
                this.coverData.show = true
                this.coverData.mode = type == 'mode'
            },

            /*
                隐藏封面
                @param
                @return
             */
            hideCover() {
                this.coverData.show = false
            },

            /**
                触摸开始事件
                @param {Dom} e 进度条圆钮
                @return
             */
            touchstart(e) {
                this.touch.isMove = true
                this.touch.x = e.targetTouches[0].pageX
                this.touch.currTime = this.videoData.currTime
            },

            /**
                触摸移动事件
                @param {Dom} e 进度条圆钮
                @return
             */
            touchmove(e) {
                this.touch.isMove = true
                const moveX = e.targetTouches[0].pageX - this.touch.x
                this.videoData.showCurrTime = this.touch.currTime + moveX / this.$refs.progress.clientWidth * this.videoData.totalTime
                if (this.videoData.showCurrTime > this.videoData.totalTime) {
                    this.videoData.showCurrTime = this.videoData.totalTime
                } else if (this.videoData.showCurrTime < 0) {
                    this.videoData.showCurrTime = 0
                }
                this.showControl()
            },

            /**
                触摸离开事件
                @param {Dom} e 进度条圆钮
                @return
             */
            touchend(e) {
                this.touch.isMove = false
                this.$refs.video.currentTime = this.videoData.showCurrTime
            },

            /**
                切换播放/暂停
                @param
                @return
             */
            togglePlay() {
                if (this.videoData.status == 'play') {
                    this.pause()
                } else {
                    this.play()
                }
            },

            /*
                加载中。。
                @param
                @return
             */
            loading() {
                this.videoData.status = 'loading'
            },

            /*
                隐藏加载中
                @param
                @return
             */
            hideLoading() {
                if (this.videoData.status == 'loading') {
                    this.videoData.status = ''
                }
            },

            /*
                播放
                @param
                @return
             */
            play() {
                this.$nextTick(() => {
                    this.hideCover()
                    this.$refs.video && this.$refs.video.play()
                    this.videoData.status = 'play'
                    this.showControl()
                })
            },

            /*
                暂停
                @param
                @return
             */
            pause() {
                this.$nextTick(() => {
                    this.$refs.video.pause()
                    this.videoData.status = 'pause'
                    this.showControl()
                })
            },

            /*
                结束
                @param
                @return
             */
            end() {
                this.$nextTick(() => {
                    this.$refs.video.pause()
                    this.videoData.status = 'end'
                    this.showControl()
                })
            },

            /*
                重新开始
                @param
                @return
             */
            restart() {
                this.$refs.video.currentTime = 0
            },
            
            /**
                切换全屏/退出全屏
                @param
                @return
             */
            toggleFullScreen() {
                if (this.videoData.fullScreen) {
                    this.exitFullscreen()
                } else {
                    this.enterFullscreen()
                }
            },

            /**
                进入全屏
                @param
                @return
             */
            enterFullscreen() {
                if (this.videoData.fullScreen) {
                    return
                }
                const video = this.$refs.video, mdVideo = this.$refs.mdVideo
                this.videoData.fullScreen = true
                if (this.appType == 'ios') {
                    video.webkitEnterFullscreen()
                } else {
                    if (mdVideo.requestFullscreen) {
                        mdVideo.requestFullscreen()
                    } else if (mdVideo.mozRequestFullScreen) {
                        mdVideo.mozRequestFullScreen()
                    } else if (mdVideo.webkitRequestFullscreen) {
                        mdVideo.webkitRequestFullscreen()
                    } else if (mdVideo.msRequestFullscreen) {
                        mdVideo.msRequestFullscreen()
                    }
                }
            },

            /**
                退出全屏
                @param
                @return
             */
            exitFullscreen() {
                if (!this.videoData.fullScreen) {
                    return
                }
                const video = this.$refs.video
                this.videoData.fullScreen = false
                if (this.appType == 'ios') {
                    video.webkitExitFullscreen()
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen()
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen()
                    }
                }
            },

            /**
                获取播放/暂停图标
                @param
                @return 播放/暂停图标
             */
            getPlayBtnIcon() {
                if (['play','loading'].includes(this.videoData.status)) {
                    return require('@/components/video/img/play-bottom.png')
                } else if (['pause','end'].includes(this.videoData.status)){
                    return require('@/components/video/img/pause-bottom.png')
                }
                return require('@/components/video/img/pause-bottom.png')
            },

            /**
                获取已播放进度百分比
                @param
                @return 已播放进度百分比
             */
            getPlayedPercent() {
                if (this.lastTime == undefined) {
                    this.lastTime = 0
                }
                if (['pause', 'end'].includes(this.videoData.status)) {
                    return this.videoData.showCurrTime / this.videoData.totalTime * 100
                }
                if (Math.abs(this.videoData.showCurrTime - this.lastTime) > 0.9) { //1s左右更新一次
                    this.lastTime = this.videoData.showCurrTime
                }
                return this.videoData.showCurrTime / this.videoData.totalTime * 100
            },

            /**
                秒转换成hh:mm:ss
                @param seconds 秒
                @return hh:mm:ss
             */
            convertTime(seconds) {
                if (isNaN(seconds)) {
                    return ''
                }
                const hh = Math.floor(seconds / 60 / 60) % 24
                const mm = Math.floor(seconds / 60) % 60
                const ss = Math.floor(seconds % 60)
                let result = ''
                if (hh >= 10) {
                    result += hh + ':'
                } else if (hh > 0) {
                    result += '0' + hh + ':'
                }
                if (mm >= 10) {
                    result += mm + ':'
                } else {
                    result += '0' + mm + ':'
                }
                if (ss >= 10) {
                    result += ss
                } else {
                    result += '0' + ss
                }
                return result
            }
        },
        watch:{
            videoSrc(val) {
                this.videoData.src = val
            },
            'videoData.src': {
                handler(newVal, oldVal) {
                    this.$nextTick(() => {
                        this.initListener()
                    })
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style scoped lang='scss'>
    .mdVideo {
        position: relative;
        width: 100%; height: 100%;
        >.video {
            position: absolute; z-index: 1;
            top: 0; bottom: 0; left: 0;
            margin: auto;
            width: 100%; height: 100%;
            background-color: #000;
        }
        >.video.hide {
            height: 0;
        }
        >.cover {
            position: absolute; z-index: 2;
            top: 0; left: 0;
            width: 100%; height: 100%;
        }
        >.cover.coverMode {
            z-index: 5;
        }
        >.loading {
            position: absolute; z-index: 3;
            top: 0; bottom: 0; left: 0; right: 0;
            margin: auto;
            width: 33px; height: 33px;
            animation: rotation 1s linear infinite;
        }
        >.shade {
            position: absolute; z-index: 3;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            >img {
                position: absolute;
                top: 0; bottom: 0; left: 0; right: 0;
                margin: auto;
                width: 40px; height: 40px;
            }
        }
        >.control {
            position: absolute; z-index: 4;
            bottom: 0; left: 0;
            width: 100%; height: 40px;
            >.playBtn {
                position: absolute;
                left: 16px; bottom: 12px;
                width: 16px; height: 18px;
            }
            >.currTime {
                position: absolute;
                left: 47px; bottom: 14px;
                height: 14px;
                line-height: 14px;
                font-size: 11px;
                color: #fff;
            }
            >.progress {
                position: absolute;
                bottom: 11px; left: 85px; right: 88px;
                margin: auto;
                height: 20px;
                >.progress-total {
                    position: absolute; z-index: 1;
                    top: 0; bottom: 0; left: 0; right: 0;
                    margin: auto;
                    height: 2px;
                    border-radius: 1px;
                    background-color: rgba(255, 255, 255, 0.39);
                }
                >.progress-played {
                    position: absolute; z-index: 2;
                    top: 0; bottom: 0; left: 0;
                    margin: auto;
                    width: 0; height: 2px;
                    border-radius: 1px;
                    background-color: #ff2c79;
                }
                >.progress-point {
                    position: absolute; z-index: 3;
                    top: 0; left: 0;
                    width: 20px; height: 20px;
                    border-radius: 10px;
                    transform: translateX(-10px);
                    >.progress-point-circle {
                        position: absolute;
                        top: 0; bottom: 0; left: 0; right: 0;
                        margin: auto;
                        width: 10px; height: 10px;
                        border-radius: 10px;
                        background-color: #ff2c79;
                    }
                }
            }
            >.totalTime {
                position: absolute;
                right: 49px; bottom: 14px;
                height: 14px;
                line-height: 14px;
                font-size: 10px;
                color: #fff;
            }
            >.fullScreen {
                position: absolute;
                right: 15px; bottom: 12px;
                width: 18px; height: 17px;
            }
        }
    }
    @keyframes rotation{
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
