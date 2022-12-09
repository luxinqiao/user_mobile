<template>
    <div class='mdPicker' v-if='show'>
        <md-popup :show.sync='popupShow' :closeIcon='false' ref='popup'>
            <div class='main'>
                <div class='title'>
                    <button class='cancel' @click='cancel()'>取消</button>
                    <p class='label'>{{title}}</p>
                    <button class='confirm' @click='confirm()'>确定</button>
                </div>
                <div class='content' ref='content'>
                    <div class='content-items' ref='contentItems'>
                        <p class='content-item' v-for='(item, i) in datas' :key='i'>{{item}}</p>
                    </div>
                    <div class='shade-top'></div>
                    <div class='shade-bottom'></div>
                </div>
            </div>
        </md-popup>
    </div>
</template>

<script lang='ts'>
import {Vue, Component, Prop, Watch, Emit} from 'vue-property-decorator'
import {mdPopup} from '../../popup'
import {checkMobile, preventDefault, convertRem, convertPx} from '@/utils/common'

interface iHisMove {
    time: number, y: number
}

@Component({
    components: {
        mdPopup
    }
})

export default class mdPicker extends Vue {
    @Prop({
        default: true
    })
    show!: boolean

    @Prop({
        default: '选择'
    })
    title?: string

    @Prop({
        default: []
    })
    datas!: Array<any>

    @Prop({
        default: ''
    })
    default?: string

    private popupShow: boolean = false
    private active: string = ''
    private inTouch: boolean = false
    private startY: number = 0
    private totalMoveY: number = 0
    private hisMoves: Array<iHisMove> = []

    mounted() {
        if (this.default) {
            this.active = this.default
        } else {
            this.active = this.datas[0]
        }
    }

    /**
        初始化组件
        @param
        @return
     */
    initPicker() {
        this.initDefault()
        this.initMoveEvent()
    }
    /**
        初始化默认参数
        @param
        @return
     */
    initDefault() {
        for (let i:number=0; i<this.datas.length; i++) {
            if (this.datas[i] == this.active) {
                this.totalMoveY = -convertPx((i - 2) * 4.4)
                this.transDistance(this.totalMoveY)
                break
            }
        }
    }
    /**
        初始化移动事件
        @param
        @return
     */
    initMoveEvent() {
        const content: any = this.$refs.content
        if (checkMobile()) {
            content.addEventListener('touchstart', (event: any)=> {
                preventDefault()
                this.transStart(event.targetTouches[0].pageY)
            }, false)
            content.addEventListener('touchmove', (event: any)=> {
                preventDefault()
                this.transMove(event.targetTouches[0].pageY)
            }, false)
            content.addEventListener('touchend', (event: any)=> {
                preventDefault()
                this.transEnd(event.changedTouches[0].pageY)
            }, false)
        } else {
            content.addEventListener('mousedown', (event: any)=> {
                this.transStart(event.y)
            }, false)
            content.addEventListener('mousemove', (event: any)=> {
                this.transMove(event.y)
            }, false)
            content.addEventListener('mouseup', (event: any)=> {
                this.transEnd(event.y)
            }, false)
            content.addEventListener('mouseleave', (event: any)=> {
                this.transEnd(event.y)
            }, false)
        }
    }

    /**
        滑动开始（触摸开始/鼠标摁下）
        @param y 纵向坐标
        @return
     */
    transStart(y: number) {
        this.inTouch = true
        this.startY = y
        this.hisMoves = []
    }
    /**
        滑动进行中（触摸滑动/鼠标滑动）
        @param y 纵向坐标
        @return
     */
    transMove(y: number) {
        if (!this.inTouch) {
            return
        }
        let moveRem: number = convertRem(this.totalMoveY + y - this.startY)
        const maxRem: number = (1 - (this.datas.length - 2)) * 4.4 //负数
        if (moveRem > 8.8) {
            moveRem = 8.8 + (moveRem - 8.8) / 3
        } else if (moveRem < maxRem) {
            moveRem = maxRem + (moveRem - maxRem) / 3
        }
        this.transDistance(convertPx(moveRem))
        this.hisMoves.push({time: new Date().getTime(), y: y})
    }
    /**
        滑动结束（触摸抬起/鼠标抬起）
        @param y 纵向坐标
        @return
     */
    transEnd(y: number) {
        if (!this.inTouch) {
            return
        }
        this.inTouch = false
        if (this.hisMoves.length < 4) {
            return
        }

        const rate = (this.hisMoves[this.hisMoves.length-1].y - this.hisMoves[this.hisMoves.length-4].y) / (this.hisMoves[this.hisMoves.length-1].time - this.hisMoves[this.hisMoves.length-4].time)
        let timeout: number = 300, moveItems: number = Math.round(convertRem(this.totalMoveY+y-this.startY)/4.4)
        const maxItems: number = 1 - (this.datas.length - 2) //负数
        if (rate > 0.3) {
            timeout = Math.round(rate * 1000)
            moveItems += Math.round(rate * 5)
        } else if (rate < -0.3) {
            timeout = -Math.round(rate * 1000)
            moveItems += Math.round(rate * 5)
        }
        if (moveItems > 2) { //到顶了
            timeout = 200
            moveItems = 2
        } else if (moveItems < maxItems) { //到底了
            timeout = 200
            moveItems = maxItems
        }
        this.totalMoveY = convertPx(moveItems * 4.4)
        this.transDistance(this.totalMoveY, timeout)
    }

    /**
        滑动距离
        @param distance 距离
        @param time 动画耗时
        @return
     */
    transDistance(distance: number, time: number = 0) {
        const contentItems: any = this.$refs.contentItems
        contentItems.style.transition = `${time/1000}s ease-out`
        contentItems.style.transform = `translateY(${distance}px)`
    }

    /**
        取消
        @param
        @return
     */
    cancel() {
        (this.$refs.popup as any).close()
    }
    /**
        确定
        @param
        @return
     */
    confirm() {
        const val: string = this.datas[Math.abs(Math.round(convertRem(this.totalMoveY)/4.4) - 2)]
        this.active = val
        this.$emit('update:default', val)
        this.$emit('confirm', val)
        this.cancel()
    }

    @Watch('show')
    onShowChanged(val: boolean, oldVal: boolean) {
        if (!oldVal && val) {
            this.popupShow = true
            setTimeout(()=> {
                this.initPicker()
            }, 1)
        }
    }
    @Watch('popupShow')
    onPopupShowChanged(val: boolean, oldVal: boolean) {
        if (oldVal && !val) {
            this.$emit('update:show', false)
        }
    }
    @Watch('default')
    onDefaultChanged(val: string, oldVal: string) {
        this.active = val
    }
}
</script>

<style scoped lang='scss'>
    .main {
        position: relative;
        height: 22.1rem;
        background-color: #fff;
        overflow: hidden;
    }
    .title {
        position: absolute; z-index: 3;
        top: 0; left: 0; right: 0;
        height: 4.5rem;
        border-bottom: 0.1rem solid #f4f4f4;
        background-color: #fff;
        >.cancel {
            position: absolute; z-index: 2;
            top: 0; left: 1.2rem;
            height: 4.5rem;
            line-height: 4.5rem;
            font-size: 1.6rem;
            color: #666;
        }
        >.label {
            position: absolute; z-index: 1;
            top: 0; left: 0; right: 0;
            text-align: center; height: 4.5rem;
            line-height: 4.5rem;
            font-size: 1.6rem;
            color: #000;
        }
        >.confirm {
            position: absolute; z-index: 2;
            top: 0; right: 1.2rem;
            height: 4.5rem;
            line-height: 4.5rem;
            font-size: 1.6rem;
            color: #FF2C79;
        }
    }
    .content {
        position: absolute; z-index: 2;
        top: 4.5rem; bottom: 0; left: 0; right: 0;
        >.content-items {
            position: absolute; z-index: 1;
            top: 0; left: 0; right: 0;
            >.content-item {
                height: 4.4rem;
                text-align: center; line-height: 4.4rem;
                color: #000;
            }
        }
        >.shade-top {
            position: absolute; z-index: 2;
            top: 0; left: 0; right: 0;
            height: 8.8rem;
            border-bottom: 0.1rem solid #f4f4f4;
            background-color: rgba(255, 255, 255, 0.6);
        }
        >.shade-bottom {
            position: absolute; z-index: 2;
            bottom: 0; left: 0; right: 0;
            height: 4.4rem;
            border-top: 0.1rem solid #f4f4f4;
            background-color: rgba(255, 255, 255, 0.6);
        }
    }
</style>
