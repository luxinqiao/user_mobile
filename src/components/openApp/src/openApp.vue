<template>
    <div class='mdOpenApp' :ref='"box"+domId' @click='callback()'>
        <slot></slot>
        <div v-if='canUseWx' class='add_con' :id='"app_box"+domId'></div>
        <div class='add_con' @click='open' v-if='!canUseWx'></div>
    </div>
</template>

<script lang='ts'>
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import {openAppNormal} from '@/utils/openApp'
import {getBrowserType, isEmpty} from '@/utils/common'
import {getAppType} from '@/utils/app'

@Component
export default class mdOpenApp extends Vue {

    @Prop() extinfo?:any  //打开app传的参数{type:-类型（2/3/11-college）}

    @Prop({default: false}) canUseWx?:any  //是否可以使用wx-open-launch-app 

    @Prop({default: 'app_btn'}) domId?:any  //待添加元素的id

    private browserType:string = getBrowserType()
    private openAppNormalUrl:string = ''

    mounted() {
        if(this.canUseWx) {
            this.$nextTick(()=>{
                this.initAPPDom()
            })
        }
        this.initUrl()
    }

    @Watch('canUseWx')
    getcanUseWxStatus(value:any) {
        this.$nextTick(()=>{
            if(value) {
                this.initAPPDom()
            }
        })
    }

    /** 
     * 可以使用wx-open-launch-app 的前提下，添加元素
    */
    initAPPDom() {
        let box = document.getElementById(`app_box${this.domId}`) as HTMLElement
        if(box.querySelector(`#${this.domId}`)) {
            return 
        }
        let script = document.createElement('script')
        script.type = 'text/wxtag-template'
        script.text = `<style scoped>
            .open_btn{
                position: relative;
                width:${(this.$refs["box"+this.domId] as HTMLElement).offsetWidth}px; height: ${(this.$refs["box"+this.domId] as HTMLElement).offsetHeight}px;
                opacity: 0;
            }
        </style>
        <div class='open_btn'></div>`
        box.innerHTML = `
            <wx-open-launch-app 
                id='${this.domId}' 
                style='position:absolute; top: 0; left:0;width:${(this.$refs["box"+this.domId] as HTMLElement).offsetWidth}px; height: ${(this.$refs["box"+this.domId] as HTMLElement).offsetHeight}px;'
                appid='wx0964356f5aed5205'
                extinfo='${JSON.stringify(this.extinfo)}'>
                    ${script.outerHTML}
            </wx-open-launch-app>
        `
        let btn = document.getElementById(this.domId) as HTMLElement
        btn.addEventListener('click', (e:any)=> {
            this.$emit('callbackFn')
        })
        btn.addEventListener('launch', (e:any)=> { 
            this.$emit('callbackFn',true)
        })
        btn.addEventListener('error', (e:any)=> {
            this.$emit('callbackFn',false)
            openAppNormal('user',this.openAppNormalUrl)
        })
    }

    /** 
     * 初始化打开app的链接，即lanting://或者lantingdoctor://后携带的路径参数
     * LT09-视频课程 LT10-专栏  LT11-音频直播 LT12-音频课程    LT13-视频直播
    */
    initUrl() {
        if (!this.extinfo) {
            return
        }
        if (this.extinfo.type == 'LT09' || this.extinfo.type == 'LT10' || this.extinfo.type == 'LT11' || this.extinfo.type == 'LT12' || this.extinfo.type == 'LT13') {
            this.openAppNormalUrl =  `college?code=${this.extinfo.code}&type=${this.extinfo.type}`
        } else if (this.extinfo.type == 'breath') {
            if(getAppType() == 'ios') {
                this.openAppNormalUrl =  `breath`
            } else {
                this.openAppNormalUrl =  `college?type=breath`
            }
        }
    }

    /** 
     * 一点击元素就回调
    */
    callback() {
        this.$emit('callbackFn')
    }

    open() {
        openAppNormal('user', this.openAppNormalUrl)
    }

}
</script>

<style scoped lang='scss'>
    .mdOpenApp {
        position: relative;
        width: 100%;
    }
    .add_con {
        position:absolute; 
        top: 0; left:0; 
        width:100%; height: 100%;
    }
</style>