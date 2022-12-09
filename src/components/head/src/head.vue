<template>
    <div class='mdHead' :class='background' :style='getHeadStyle()' v-if='show'>
        <div class='head-content'>
            <div class='back' v-if='backIcon!="none"' @click='goBack'>
                <img :src='backImg'>
            </div>
            <div class='title text_ellipsis'>{{title}}</div>
            <div class='action'>
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import {Vue, Component, Prop , Emit} from 'vue-property-decorator'
import {closeWindow as closeAppWindow} from '@/utils/app'
import {getBrowserType, getHeadHeight, getHeadPaddingTop} from '@/utils/common'

@Component
export default class mdHead extends Vue {
    //返回按钮图标：none-无, backWhite-白色返回, backBlack-黑色返回, closeBlack-黑色关闭, require图片-自定义传入
    @Prop({default: 'backBlack'}) backIcon?: string

    //返回模式：back-返回, close-关闭, custom-自定义
    @Prop({default: 'back'}) backMode?: string

    //返回函数（backMode=custom时必传）
    @Prop({default: ()=>{}}) backFun?: Function

    //背景色：white-白色, red-#ff2c79, transparent-透明
    @Prop({default: 'white'}) background?: string

    //浏览器类型
    private browserType: string = getBrowserType()
    //显示
    private show: boolean = false
    //返回图标
    private backImg: any = null
    //标题
    private title: string = ''

    mounted() {
        if (this.browserType == "app" || this.browserType == "browser") {
            this.show = true
        } else if (this.browserType == "wechat") {
            this.show = false
        }
        this.title = document.title
        if (this.backIcon == 'backWhite') {
            this.backImg = require('../img/back_white.png')
        } else if (this.backIcon == 'backBlack') {
            this.backImg = require('../img/back_black.png')
        } else if (this.backIcon == 'closeBlack') {
            
        } else {
            this.backImg = this.backIcon
        }
    }

    /**
        获取头部样式
        @param
        @return 头部样式
     */
    getHeadStyle() {
        return `height:${getHeadHeight()}px; padding-top:${getHeadPaddingTop()}px;`
    }

    /**
        返回
        @param
        @return
     */
    goBack() {
        if (this.backMode == 'back') {
            this.$router.back()
        } else if (this.backMode == 'close') {
            if (this.browserType == 'app') {
                closeAppWindow()
            } else {
                this.$router.back()
            }
        } else if (this.backMode == 'custom') {
            typeof(this.backFun) == 'function' ? this.backFun() : ''
        }
    }
}
</script>

<style lang='scss' scoped>
    .mdHead {
        position: fixed; z-index: 98;
        top: 0; left: 0;
        width: 100%;
        >.head-content {
            position: relative;
            height: 4.4rem;
            >.back {
                position: absolute; z-index: 2;
                top: 0; left: 0;
                width: 4.4rem; height: 4.4rem;
                >img {
                    position: absolute;
                    top: 1.5rem; left: 1.2rem;
                    width: 0.9rem; height: 1.5rem;
                }
            }
            >.title {
                margin: auto;
                width: 21.6rem; height: 4.4rem;
                text-align: center; line-height: 4.4rem;
                font-size: 1.8rem; font-weight: bold;
            }
        }
    }
    .mdHead.white {
        background-color: #fff;
    }
    .mdHead.red {
        background-color: #ff2c79;
    }
    .mdHead.transparent {
        background-color: transparent;
    }
</style>