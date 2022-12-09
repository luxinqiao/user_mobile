<template>
        <div id='main' :style='"padding-top:"+headHeight+"px"' :class='isIphoneX?"iphoneX_bottom":""'>
            <md-head :backIcon='require("@/assets/img/apps/breath/back_btn.png")' backMode='close'></md-head>
            <div class='top'>
                <video src='http://rightinhome.oss-cn-hangzhou.aliyuncs.com/b80_version/2020/07/05/1597383655724.mp4' class='img_gif' ref='video' loop='loop' poster='http://rightinhome.oss-cn-hangzhou.aliyuncs.com/b80_version/2020/07/05/1597383655724.mp4?x-oss-process=video/snapshot,t_1,f_jpg'></video>
                <div class='top_cover' v-if='isTopShow'>
                    <img src='@/assets/img/apps/breath/openbtn.png' @click='openVideo'/>
                    <div>动作预览</div>
                </div>
            </div>
            <div class='setting'>
                <div class='setting_item set_item_border'>
                    <div class='setting_item_top'>
                        <span class='bold'>5</span>
                        <span class='normal'>分钟</span>
                        <div class='set_time_tag'><span>新手</span>
                        </div>
                    </div>
                    <div class='setting_item_bottom'>
                        <span>课程时长</span>
                        <img src='@/assets/img/apps/breath/set.png'/>
                    </div>
                </div>
                <div class='setting_item set_item_border'>
                    <div class='setting_item_top'>
                        <span class='normal'>吸</span>
                        <span class='bold'>4</span>
                        <span class='normal'>秒</span>
                        <span class='fre_mid'></span>
                        <span class='normal'>呼</span>
                        <span class='bold'>6</span>
                        <span class='normal'>秒</span>
                    </div>
                    <div class='setting_item_bottom'>
                        <span>呼吸频率</span>
                    </div>
                </div>
                <div class='setting_item'>
                    <div class='setting_item_top'>
                        <span class='bold'>30</span>
                        <span class='normal'>次</span>
                    </div>
                    <div class='setting_item_bottom'>
                        <span>动作组</span>
                    </div>
                </div>
            </div>
            <div class='desc_action'>
                <div class='desc'>
                    <div class='desc_action_title'>训练说明</div>
                    <div class='desc_con ' @click='watchMore'>
                        <span class='desc_con_detail' id='desc_con_detail' ref='desc'>{{desc}}</span>
                        <span class='more_btn'>查看更多</span>
                    </div>
                </div>
                <div class='action'>
                    <div class='desc_action_title'>动作要领</div>
                    <div class='action_step'>
                        <div class='action_step_item'>
                            <img src='@/assets/img/apps/breath/t1.png'/>
                            <div>平躺，双腿自然弯曲，全身放松</div>
                            <span>1</span>
                        </div>
                        <div class='action_step_item'>
                            <img src='@/assets/img/apps/breath/t2.png'/>
                            <div>缓慢吸气，腹部微微向上鼓起</div>
                            <span>2</span>
                        </div>
                        <div class='action_step_item'>
                            <img src='@/assets/img/apps/breath/t3.png'/>
                            <div>缓慢呼气，腹部慢慢向下收缩</div>
                            <span>3</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class='way_err'>
                <div class='way'>
                    <div class='desc_action_title'>呼吸方式</div>
                    <div class='way_list'>
                        <div>鼻子均匀吸气</div>
                        <div>嘴巴均匀呼气</div>
                    </div>
                </div>
                <div class='err'>
                    <div class='desc_action_title'>常见错误</div>
                    <div class='err_con'>
                        <div class='err_item'>
                            <img src='@/assets/img/apps/breath/no.png'/>
                            <div>错误：呼气时，快速收腹</div>
                        </div>
                        <div class='err_item'>
                            <img src='@/assets/img/apps/breath/yes.png'/>
                            <div>解决：呼气时，感受腹部均匀向下回落</div>
                        </div>
                        <div class='err_item'>
                            <img src='@/assets/img/apps/breath/no.png'/>
                            <div>错误：呼吸过程中，胸部向外扩张</div>
                        </div>
                        <div class='err_item'>
                            <img src='@/assets/img/apps/breath/yes.png'/>
                            <div>解决：保持身体放松，将所有的意识关注在你的呼吸上，吸气尽量深长，呼气尽量细慢，胸部保持不动</div>
                        </div>
                    </div>
                </div>
            </div>
            <div :class='["open_btn", isIphoneX?"iphoneX_btn":""]'>
                <md-open-app :extinfo='appExtinfo' :canUseWx='canUseWxDom' v-if='browserType != "app"'>
                    <div class='open_btn_con' id='open' ref='open'>
                        <span>前往澜渟App 开启腹式呼吸</span>
                    </div>
                </md-open-app>
                <div class='open_btn_con' v-if='browserType == "app" && appType == "wrightinDoctor"'  @click='jumpWrightin()'>
                    <span>前往澜渟App 开启腹式呼吸</span>
                </div>
            </div>
        </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {mdOpenApp, mdHead} from '@/components'
    import {initConfig as initWxSDKConfig} from '@/utils/weChat'
    import {checkIOSX, getBrowserType, getHeadHeight} from '@/utils/common'
    import {getAppProduct, appFun} from '@/utils/app'

    @Component({
        components: {
            mdOpenApp,mdHead
        }
    })
    export default class appsBreath extends Vue{
        private headHeight: number = getHeadHeight()
        private isTopShow:boolean = true
        private desc:string = '进行腹式呼吸，不仅可以扩大肺活量，改善心肺功能，减少肺部感染，而且能够改善盆腹脏器功能，辅助协调盆底肌肉收缩，缓解产后骨盆和腰部不适、便秘等症状，另外腹式呼吸可以减少腰腹多余赘肉，达到塑形效果。在进行盆底及产康训练前，结合腹式呼吸放松训练，可以放松身体压力，缓解局部肌肉的过度紧张，训练效果更加明显。'

        private canUseWxDom:any = false

        private appExtinfo = {
            type: 'breath',
        }

        private browserType = getBrowserType()
        private appType= getAppProduct()
        private isIphoneX: boolean = checkIOSX()

        mounted() {
            if(getBrowserType() == 'wechat') {
                (async ()=>{
                    this.canUseWxDom = await initWxSDKConfig()
                })()
            } else {
                this.canUseWxDom = false
            }
            this.desc = this.desc.substring(0,Math.floor((this.$refs.desc as HTMLElement).offsetWidth/Math.floor(document.body.clientWidth/375*13))*3-9)+'...'
        }

        watchMore() {
            this.$router.push(`/apps/breathdesc`)
        }

        openVideo() {
            this.isTopShow = false
            ;(this.$refs.video as any).play()
        }

        /*
            打开澜渟App
            @param
            @return
         */
        jumpWrightin() {
            appFun(() => {
                (window as any).jsInterface.jumpToApp()
            }, () => {
                (window as any).webkit.messageHandlers.jumpToApp.postMessage(null)
            })
        }
    }

</script>

<style scoped lang="scss">
    #main {
        position: relative;
        padding: 0 0 6.4rem 0;
        background-color: #FAFAFA;
        /deep/.back {
            img {
                width: 1.6rem; height: 1.6rem;
            }
        }
        >.top {
            position: relative;
            >.img_gif {
                display: block;
                width: 100%; height: 15rem;
                object-fit: fill;
            }
            >.top_cover {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 15rem;
                background-color: rgba(0, 0, 0, 0.5);
                >img {
                    position: absolute;
                    top: 3.7rem; left: 0; right: 0;
                    margin: auto;
                    width: 5.2rem; height: 5.2rem;
                }
                >div {
                    position: absolute;
                    top: 9.2rem; left: 0; right: 0;
                    margin: auto;
                    line-height: 2rem; text-align: center; 
                    font-size: 1.4rem; color: #fff;
                }
            }
        }
        >.setting {
            position: relative;
            display: flex; align-items: center;
            height: 8.1rem;
            background-color: #fff;
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
            box-sizing: border-box;
            >.setting_item {
                position: relative;
                width: 33%;
                >.setting_item_top {
                    position: relative;
                    text-align: center;
                    margin-top: 1.5rem;
                    height: 3rem;
                    >.bold {
                        font-size: 2.2rem;
                    }
                    >.normal {
                        font-size: 1.2rem;
                    }
                    >.set_time_tag {
                        position: absolute;
                        right: 1.4rem; top: -0.6rem;
                        width: 2.8rem; height: 1.6rem;
                        border-radius: 0.2rem;
                        display: flex;
                        align-items: center; justify-content: center;
                        border: 1px solid rgba(73,201,158,0.3);
                        background-color: rgba(73,201,158,0.05);
                        >span {
                            font-size: 1rem; color: #49C99E;
                        }
                    }
                    >.fre_mid {
                        display: inline-block;
                        width: 0.4rem;
                    }
                }
                >.setting_item_bottom {
                    display: flex;
                    align-items: center; justify-content: center;
                    margin-top: 0.3rem;
                    height: 1.7rem;
                    >span {
                        font-size: 1.2rem; color: #999;
                    }
                    >img {
                        margin-left: 0.2rem;
                        width: 1.4rem; height: 1.4rem;
                    }
                }
            }
            >.set_item_border::after {
                display: block;
                content: '';
                position: absolute;
                top: 0; bottom: 0; right: -1px;
                margin: auto;
                width: 1px; height: 3.2rem;
                background-color: #f4f4f4;
            }
        }
        .desc_action_title {
            line-height: 2.1rem;
            font-size: 1.5rem; font-weight: bold;
        }
        >.desc_action {
            position: relative;
            margin-top: 1rem; padding: 1.2rem 0 2rem 1.2rem;
            background-color: #fff;
            >.desc {
                >.desc_con {
                    margin-top: 0.5rem; padding-right: 1.2rem;
                    font-size: 0; text-align: justify;
                    >.desc_con_detail {
                        width: 100%;
                        line-height: 2.2rem;
                        font-size: 1.3rem; color: #666;
                    } 
                    >.more_btn {
                        font-size: 1.3rem; color: #FF2C79;
                    }
                } 
            }
            >.action {
                margin-top: 3rem;
                >.action_step {
                    position: relative;
                    margin-top: 0.8rem;
                    overflow-y: scroll;
                    white-space: nowrap;
                    >.action_step_item {
                        position: relative;
                        display: inline-block;
                        margin-right: 1.2rem;
                        width: 12.6rem;
                        >img {
                            display: block;
                            width: 12.6rem; height:  6.7rem;
                        }
                        >div {
                            position: relative;
                            height: 3.4rem;
                            padding: 0.2rem 0.8rem; margin-bottom: 0.6rem;
                            border-bottom-left-radius: 0.2rem;
                            border-bottom-right-radius: 0.2rem;
                            background-color: #AEAEAE;
                            font-size: 1.1rem; color: #fff; word-break: break-word;white-space: pre-wrap;
                        }
                        >span {
                            display: block;
                            margin: auto;
                            width: 1.6rem; height: 1.6rem;
                            line-height: 1.6rem; text-align: center;
                            border-radius: 0.8rem;
                            font-size: 1.2rem; color: #fff;
                            background-color: #999;
                        }
                    }
                }
                >.action_step::-webkit-scrollbar {
                    display: none;
                }
            }
        }
        >.way_err {
            position: relative;
            margin-top: 1rem; padding: 1.2rem;
            background-color: #fff;
            .way_list {
                margin-top: 1.2rem;
                >div {
                    position: relative;
                    display: inline-block;
                    padding-left: 0.9rem;
                    line-height: 2rem;
                    font-size: 1.4rem;
                }
                >div::before {
                    display: block;
                    content: '';
                    position: absolute;
                    top: 0; bottom: 0; left: 0;
                    margin: auto;
                    width: 0.5rem; height: 0.5rem;
                    border-radius: 50%;
                    background-color: #FF2C79;
                }
                >div:nth-child(1) {
                    margin-right: 4.8rem;
                }
            }
            >.err {
                position: relative;
                margin-top: 2.9rem;
                >.err_con {
                    position: relative;
                    padding: 1.2rem; margin-top: 0.7rem;
                    background-color: #FAFAFA;
                    border-radius: 0.4rem;
                    >.err_item {
                        position: relative;
                        padding-left: 2.2rem; 
                        >img {
                            position: absolute;
                            top: 0.3rem; left: 0;
                            width: 1.4rem; height: 1.6rem;
                        }
                        >div {
                            line-height: 2rem;
                            font-size: 1.4rem;
                        }
                    }
                    .err_item:nth-child(1), .err_item:nth-child(3) {
                        margin-bottom: 1.2rem;
                    }
                    .err_item:nth-child(2) {
                        margin-bottom: 2.5rem;
                    }
                }
            }
        }
    }
    .open_btn {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        padding: 0.7rem 1.2rem 1.6rem 1.2rem;
        height: 5.5rem;
        box-shadow: 0px 0.2rem 0.8rem 0px rgba(102,102,102,0.26);
        background-color: #fff;
        .open_btn_con {
            position: relative;
            width: 100%; height: 4rem;
            text-align: center; line-height: 4rem;
            border-radius: 2rem;
            background-color: #FF2C79;
            >span {
                font-size: 1.6rem; color: #fff;
            }
        }
    }
    .iphoneX_btn {
        height: 6.5rem;
    }
    #main.iphoneX_bottom {
        padding-bottom: 6.5rem;
    }
    
    
</style>