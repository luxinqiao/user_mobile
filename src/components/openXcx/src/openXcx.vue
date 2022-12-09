<template>
    <div class='mdOpenXcx' :ref='"xcx_box"+domId' @click='callback()'>
        <slot></slot>
        <div v-if='canUseWx' class='add_con'  :id='"xcx_btn_box"+domId'></div>
        <div class='add_con' @click='openApp()' v-if='!canUseWx'></div>
        <md-confirm :show.sync='confirmShow' content='“澜渟LIVE”小程序打开失败，是否打开澜渟App？' @bindRight='confirmFn()'></md-confirm>
    </div>
</template>

<script lang='ts'>
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import {mdConfirm} from '@/components'
import {openAppNormal} from '@/utils/openApp'
import {getBrowserType, paramToLink} from '@/utils/common'

@Component({
    components:{
        mdConfirm
    }
})
export default class mdOpenXcx extends Vue {
    @Prop({default:'pages/pkgHome/liveList/list'}) xcxPath?:string  //小程序页面url
    @Prop({default:'live',type: String}) xcxType!:string  //小程序类型 live、meeting、mall、kegel

    @Prop({default: false}) canUseWx?:any   //是否可以使用wx-open-launch-weapp

    @Prop({default: 'xcx_btn'}) domId?:any  //添加元素啊ID

    @Prop() extinfo?:any  //打开app传的参数

    private browserType:string = getBrowserType()
    private confirmShow: boolean = false
    private openAppNormalUrl:string = ''

    private xcxIdArray:any = {
        'live': 'gh_85c443630529',
        'meeting': 'gh_30be4143a4cb',
        'mall': 'gh_220147c3582a',
        'kegel': 'gh_73d209cfccb1'
    }


    mounted() {
        if(this.canUseWx) {
            this.initXcxDom()
        }
        this.initNormalUrl()
    }

    @Watch('canUseWx')
    getcanUseWxStatus(value:any) {
        this.$nextTick(()=>{
            if(value) {
                this.initXcxDom()
            }
        })

    }

    /** 
     * 可以使用wx-open-launch-weapp 的前提下，添加元素
    */
    initXcxDom() {
        let box = document.getElementById(`xcx_btn_box${this.domId}`) as HTMLElement
        if(box.querySelector(`#${this.domId}`)) {
            return 
        }
        let script = document.createElement('script')
        script.type = 'text/wxtag-template'
        script.text = `<style scoped>
            .open_btn{
                position: relative;
                width:${(this.$refs["xcx_box"+this.domId] as HTMLElement).offsetWidth}px; height: ${(this.$refs["xcx_box"+this.domId] as HTMLElement).offsetHeight}px;
                opacity: 0;
            }
        </style>
        <div class='open_btn'></div>`
        box.innerHTML = `
            <wx-open-launch-weapp
                id='${this.domId}' 
                style='position:absolute; top: 0; left:0;width:${(this.$refs["xcx_box"+this.domId] as HTMLElement).offsetWidth}px; height: ${(this.$refs["xcx_box"+this.domId] as HTMLElement).offsetHeight}px;'
                username='${this.xcxIdArray[this.xcxType]}'
                path='${this.xcxPath}'>
                    ${script.outerHTML}
            </wx-open-launch-weapp>
        `
        let btn = document.getElementById(this.domId) as HTMLElement
        btn.addEventListener('launch', (e:any)=> { 
            this.$emit('callbackFn',true)
        })
        btn.addEventListener('error', (e:any)=> {
            this.$emit('callbackFn',false)
            //如果小程序打开失败，出现提示框
            this.confirmShow = true
        })
    }

    /** 
     * 一点击元素就回调
    */
    callback() {
        this.$emit('callbackFn')
    }

    /** 
     * 如果是微信
    */
    openApp() {
        if(this.browserType == 'wechat') {
            this.confirmShow = true
        } else {
            openAppNormal('user',this.openAppNormalUrl)
        }
    }

    /**
     * 提示：“澜渟LIVE”小程序打开失败，是否打开澜渟App/澜渟医生App？ 弹窗，点击确认
     */
    confirmFn() {
        openAppNormal('user',this.openAppNormalUrl)
    }

    //初始化打开app链接参数
    initNormalUrl() {
        if (this.extinfo.type == '11') {
            this.openAppNormalUrl =  `college?code=${this.extinfo.code}&type=${this.extinfo.type}`
        }
    }

}
</script>

<style scoped lang='scss'>
    .mdOpenXcx {
        position: relative;
        width: 100%;
    }
    .add_con {
        position:absolute; 
        top: 0; left:0; 
        width:100%; height: 100%;
    }
</style>