<template>
    <div class='mdDatetime' v-if='show'>
        <md-popup :show.sync='popupShow' :closeIcon='false' ref='popup'>
            <div class='main'>
                <div class='title'>
                    <button class='cancel' @click='cancel()'>取消</button>
                    <p class='label'>{{title}}</p>
                    <button class='confirm' @click='confirm()'>确定</button>
                </div>
                <div class='content'>
                    <div class='content-column' ref='contentYear' :hidden='data.year.length==0'>
                        <div class='content-items' ref='contentYearDatas'>
                            <p class='content-item' v-for='(item, i) in data.year' :key='i'>{{item}}年</p>
                        </div>
                        <div class='shade-top'></div>
                        <div class='shade-bottom'></div>
                    </div>
                    <div class='content-column' ref='contentMonth' :hidden='data.month.length==0'>
                        <div class='content-items' ref='contentMonthDatas'>
                            <p class='content-item' v-for='(item, i) in data.month' :key='i'>{{item}}月</p>
                        </div>
                        <div class='shade-top'></div>
                        <div class='shade-bottom'></div>
                    </div>
                </div>
            </div>
        </md-popup>
    </div>
</template>

<script lang='ts'>
import {Vue, Component, Prop, Watch, Emit} from 'vue-property-decorator'
import {mdPopup} from '../../popup'
import {checkMobile, preventDefault, getPropValue, convertRem, convertPx} from '@/utils/common'

interface iData {
    year: Array<number>,
    month: Array<number>
}
interface iActive {
    year: number | undefined,
    month: number | undefined
}
interface iTotalMoveY {
    year: number,
    month: number
}
interface iHisMove {
    year: Array<iHisMoveItem>,
    month: Array<iHisMoveItem>
}
interface iHisMoveItem {
    time: number,
    y: number
}

@Component({
    components: {
        mdPopup
    }
})

export default class mdDatetime extends Vue {
    @Prop({
        default: true
    })
    show!: boolean

    @Prop({
        default: '选择日期'
    })
    title?: string

    @Prop({
        default: 'year' //year/month/year-month
    })
    type?: string

    @Prop({
        default: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
    })
    start?: string

    @Prop({
        default: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
    })
    end?: string

    @Prop({
        default: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
    })
    default?: string

    private popupShow: boolean = false
    private data: iData = {
        year: [],
        month: []
    }
    private active: iActive = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    }
    private inTouch: boolean = false
    private startY: number = 0
    private totalMoveY: iTotalMoveY = {
        year: 0,
        month: 0
    }
    private hisMove: iHisMove = {
        year: [],
        month: []
    }

    /**
        初始化Datatime
        @param
        @return
     */
    initDatetime() {
        if (this.type == 'year') {
            this.initYear()
        } else if (this.type == 'year-month') {
            this.initYear()
            this.initMonth()
            ;(this.$refs.contentYearDatas as Element).classList.add('pl5')
            ;(this.$refs.contentMonthDatas as Element).classList.add('pr5')
        }
        this.initMoveEvent()
    }

    /**
        初始化年
        @param
        @return
     */
    initYear() {
        this.data.year = []
        //初始化年数据
        const startYear: number = this.format(this.start as string, 'year')
        const endYear: number = this.format(this.end as string, 'year')
        for (let i:number=startYear; i<=endYear; i++) {
            this.data.year.push(i)
        }
        //初始化年选中滑动
        for (let i:number=0; i<this.data.year.length; i++) {
            if (this.data.year[i] == this.active.year) {
                this.totalMoveY.year = -convertPx((i - 2) * 4.4)
                this.transDistance('year', this.totalMoveY.year)
                break
            }
        }
    }

    /**
        初始化月
        @param
        @return
     */
    initMonth() {
        if (this.type != 'year-month') {
            return
        }
        this.data.month = []
        //初始化月数据
        const startYear: number = this.format(this.start as string, 'year'),
              startMonth: number = this.format(this.start as string, 'month'),
              endYear: number = this.format(this.end as string, 'year'),
              endMonth: number = this.format(this.end as string, 'month')
        let startNo = 1, endNo = 12
        const activeYear: number = this.active.year as number
        if (startYear == endYear) {
            startNo = startMonth, endNo = endMonth
        } else if (activeYear == startYear) {
            startNo = startMonth, endNo = 12
        } else if (activeYear > startYear && activeYear < endYear) {
            startNo = 1, endNo = 12
        } else if (activeYear == endYear) {
            startNo = 1, endNo = endMonth
        }
        for (let i:number=startNo; i<=endNo; i++) {
            this.data.month.push(i)
        }
        //初始化月选中滑动
        if (this.data.month[0] > (this.active.month as number)) {
            this.active.month = this.data.month[0]
            this.totalMoveY.month = -convertPx(-2 * 4.4)
            this.transDistance('month', this.totalMoveY.month)
        } else if (this.data.month[this.data.month.length - 1] < (this.active.month as number)) {
            this.active.month = this.data.month[this.data.month.length - 1]
            this.totalMoveY.month = -convertPx((this.data.month.length - 3) * 4.4)
            this.transDistance('month', this.totalMoveY.month)
        } else {
            for (let i:number=0; i<this.data.month.length; i++) {
                if (this.data.month[i] == this.active.month) {
                    this.totalMoveY.month = -convertPx((i - 2) * 4.4)
                    this.transDistance('month', this.totalMoveY.month)
                    break
                }
            }
        }
    }

    /**
        格式化日期
        @param date 日期
        @param type 类型(year|string)
        @return 年|月
     */
    format(date: number|string, type: string) {
        const no: number = type == 'year' ? 0 : 1
        if (typeof(date) == 'string') {
            return parseInt(date.split('-')[no])
        } else if (typeof(date) == 'number') {
            return parseInt(date.toString().split('-')[no])
        }
        return 0
    }
    
    /**
        初始化移动事件
        @param
        @return
     */
    initMoveEvent() {
        const contentYear: any = this.$refs.contentYear
        const contentMonth: any = this.$refs.contentMonth
        if (checkMobile()) {
            contentYear.addEventListener('touchstart', (event: any)=> {
                preventDefault()
                this.transStart(event.targetTouches[0].pageY)
            }, false)
            contentYear.addEventListener('touchmove', (event: any)=> {
                preventDefault()
                this.transMove(event.targetTouches[0].pageY, 'year')
            }, false)
            contentYear.addEventListener('touchend', (event: any)=> {
                preventDefault()
                this.transEnd(event.changedTouches[0].pageY, 'year')
            }, false)

            contentMonth.addEventListener('touchstart', (event: any)=> {
                preventDefault()
                this.transStart(event.targetTouches[0].pageY)
            }, false)
            contentMonth.addEventListener('touchmove', (event: any)=> {
                preventDefault()
                this.transMove(event.targetTouches[0].pageY, 'month')
            }, false)
            contentMonth.addEventListener('touchend', (event: any)=> {
                preventDefault()
                this.transEnd(event.changedTouches[0].pageY, 'month')
            }, false)
        } else {
            contentYear.addEventListener('mousedown', (event: any)=> {
                this.transStart(event.y)
            }, false)
            contentYear.addEventListener('mousemove', (event: any)=> {
                this.transMove(event.y, 'year')
            }, false)
            contentYear.addEventListener('mouseup', (event: any)=> {
                this.transEnd(event.y, 'year')
            }, false)
            contentYear.addEventListener('mouseleave', (event: any)=> {
                this.transEnd(event.y, 'year')
            }, false)

            contentMonth.addEventListener('mousedown', (event: any)=> {
                this.transStart(event.y)
            }, false)
            contentMonth.addEventListener('mousemove', (event: any)=> {
                this.transMove(event.y, 'month')
            }, false)
            contentMonth.addEventListener('mouseup', (event: any)=> {
                this.transEnd(event.y, 'month')
            }, false)
            contentMonth.addEventListener('mouseleave', (event: any)=> {
                this.transEnd(event.y, 'month')
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
        this.hisMove.year = []
        this.hisMove.month = []
    }
    /**
        滑动进行中（触摸滑动/鼠标滑动）
        @param y 纵向坐标
        @return
     */
    transMove(y: number, type: string) {
        if (!this.inTouch) {
            return
        }
        let moveRem: number = convertRem(getPropValue(this.totalMoveY, type as any) + y - this.startY)
        let maxRem: number = (1 - (getPropValue(this.data, type as any).length - 2)) * 4.4 //负数
        if (moveRem > 8.8) {
            moveRem = 8.8 + (moveRem - 8.8) / 3
        } else if (moveRem < maxRem) {
            moveRem = maxRem + (moveRem - maxRem) / 3
        }
        this.transDistance(type, convertPx(moveRem))
        getPropValue(this.hisMove, type as any).push({time: new Date().getTime(), y: y})
    }
    /**
        滑动结束（触摸抬起/鼠标抬起）
        @param y 纵向坐标
        @param type 类型(year/month)
        @return
     */
    transEnd(y: number, type: string) {
        if (!this.inTouch) {
            return
        }
        this.inTouch = false
        if (getPropValue(this.hisMove, type as any).length < 4) {
            return
        }
        const hisMoveData: Array<iHisMoveItem> =  getPropValue(this.hisMove, type as any)
        let rate: number = (hisMoveData[hisMoveData.length-1].y - hisMoveData[hisMoveData.length-4].y) / (hisMoveData[hisMoveData.length-1].time - hisMoveData[hisMoveData.length-4].time)
        let timeout: number = 300,
            moveItems: number = Math.round(convertRem(getPropValue(this.totalMoveY, type as any) + y - this.startY) / 4.4)
        const maxItems: number = 1 - (getPropValue(this.data, type as any).length - 2) //负数
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
        const movePx: number = convertPx(moveItems * 4.4)
        if (type == 'year') {
            this.totalMoveY.year = movePx
        } else if (type == 'month') {
            this.totalMoveY.month = movePx
        }
        this.transDistance(type, movePx, timeout)
        //年、月change
        setTimeout(() => {
            if (type == 'year') {
                this.active.year = this.data.year[Math.abs(moveItems - 2)]
                this.initMonth()
            } else if (type == 'month') {
                this.active.month = this.data.month[Math.abs(moveItems - 2)]
            }
        }, timeout)
    }

    /**
        滑动距离
        @param distance 距离
        @param time 动画耗时
        @return
     */
    transDistance(type: string, distance: number, time: number=0) {
        let contentDatas: any
        if (type == 'year') {
            contentDatas = this.$refs.contentYearDatas
        } else if (type == 'month') {
            contentDatas = this.$refs.contentMonthDatas
        }
        contentDatas.style.transition = `${time/1000}s ease-out`
        contentDatas.style.transform = `translateY(${distance}px)`
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
        let val: string = (this.active.year as number).toString()
        if (this.active.month) {
            val += '-' + this.active.month.toString()
        }
        this.$emit('update:default', val)
        this.$emit('confirm', {
            year: this.active.year,
            month: this.active.month
        })
        this.cancel()
    }

    @Watch('show')
    onShowChanged(val: boolean, oldVal: boolean) {
        if (!oldVal && val) {
            this.popupShow = true
            setTimeout(()=> {
                this.initDatetime()
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
    onDefaultYearChanged(val: number, oldVal: number) {
        this.active.year = this.format(val, 'year')
        this.active.month = this.format(val, 'month')
    }
}
</script>

<style scoped lang='scss'>
    .main {
        position: relative;
        height: 26.4rem;
        background-color: #fff;
        overflow: hidden;
    }
    .title {
        position: absolute; z-index: 3;
        top: 0; left: 0; right: 0;
        height: 4.4rem;
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
        display: flex;
        top: 4.4rem; bottom: 0; left: 0; right: 0;
        >.content-column {
            position: relative;
            flex: 1;
            >.content-items {
                >.content-item {
                    height: 4.4rem;
                    text-align: center; line-height: 4.4rem;
                    color: #000;
                }
            }
            >.content-items.pl5 {
                padding-left: 5.8rem;
            }
            >.content-items.pr5 {
                padding-right: 5.8rem;
            }
            >.shade-top {
                position: absolute; z-index: 2;
                top: 0; left: 0; right: 0;
                height: 8.8rem;
                background-color: rgba(255, 255, 255, 0.6);
                border-bottom: 0.1rem solid #f4f4f4;
            }
            >.shade-bottom {
                position: absolute; z-index: 2;
                bottom: 0; left: 0; right: 0;
                height: 8.8rem;
                border-top: 0.1rem solid #f4f4f4;
                background-color: rgba(255, 255, 255, 0.6);
            }
        }
    }
</style>
