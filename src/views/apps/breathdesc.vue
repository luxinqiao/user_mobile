<template>
    <div id='main' :style='"padding-top:"+headHeight+"px"'>
        <md-head :backIcon='require("@/assets/img/apps/breath/back_btn.png")'></md-head>
        <div class='item'>
            <div class='item_tit'>训练目标</div>
            <div class='item_con'>进行腹式呼吸，不仅可以扩大肺活量，改善心肺功能，减少肺部感染，而且能够改善盆腹脏器功能，辅助协调盆底肌肉收缩，缓解产后骨盆和腰部不适、便秘等症状，另外腹式呼吸可以减少腰腹多余赘肉，达到塑形效果。在进行盆底及产康训练前，结合腹式呼吸放松训练，可以放松身体压力，缓解局部肌肉的过度紧张，训练效果更加明显。</div>
        </div>
        <div class='item'>
            <div class='item_tit'>训练频次</div>
            <div class='item_con'>早晚均可练习，可以每天练习</div>
        </div>
        <div class='item'>
            <div class='item_tit'>禁忌</div>
            <div class='item_con item_con_spec'>心脏病：心动过缓、房室传导阻滞的患者等</div>
            <div class='item_con item_con_spec'>部分肺部疾病患者</div>
            <div class='item_con item_con_spec'>剖宫产伤口未愈合或其他原因不适宜放置阴道探头者</div>
            <div class='item_con item_con_spec'>训练时可导致病情恶化的其他临床情况患者</div>
        </div>
        <div class='item'>
            <div class='item_tit'>注意事项</div>
            <div class='item_con item_con_spec'>训练前不建议吃太多东西，避免饱腹状态，以免训练中出现腹部不适</div>
            <div class='item_con item_con_spec'>训练过程中，避免憋气或过分减慢呼吸频率</div>
            <div class='item_con item_con_spec'>呼吸节律要慢，避免过快用力</div>
            <div class='item_con item_con_spec'>如果训练中有疲劳或不适，请停止训练并咨询专业人士意见。建议您每天锻炼10-30分钟，请勿过量训练</div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {mdHead} from '@/components'
    import {getHeadHeight} from '@/utils/common'


    @Component({
        components: {
            mdHead
        }
    })
    export default class appsBreathdesc extends Vue{
        private headHeight: number = getHeadHeight()
    }

</script>
<style scoped lang="scss">
    #main {
        position: relative;
        padding: 0 1.2rem 0 1.2rem;
        /deep/.back {
            img {
                width: 1.6rem; height: 1.6rem;
            }
        }
        >.item:first-child {
            padding-top: 0.9rem;
        }
        >.item {
            margin-bottom: 2.4rem;
            >.item_tit {
                margin-bottom: 0.4rem;
                line-height: 2.1rem;
                font-size: 1.5rem; font-weight: bold;
            }
            >.item_con {
                position: relative;
                line-height: 2rem; text-align: justify;
                font-size: 1.3rem; color: #666;
            }
            >.item_con_spec {
                padding-left: 1.1rem; margin-bottom: 0.8rem;
            }
            >.item_con_spec::before {
                display: block;
                content: '';
                position: absolute;
                top: 0.8rem; left: 0;
                width: 0.5rem; height: 0.5rem;
                border-radius: 50%;
                background-color: #FF2C79;
            }
        }
        >.item:last-child {
            padding-bottom: 1.6rem; margin-bottom: 0;
        }
    }
</style>