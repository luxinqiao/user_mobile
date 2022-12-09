<!--
    文件描述：下载澜渟
    创建人：卢信桥
    创建时间：2021-12-01
-->
<template>
    <div id='main'>
        <div class='banner'>
            <img :src='require("@/assets/img/apps/wrightin/u1.png")'>
            <img :src='require("@/assets/img/apps/wrightin/u2.png")'>
            <img :src='require("@/assets/img/apps/wrightin/u3.png")'>
            <img :src='require("@/assets/img/apps/wrightin/u4.png")'>
            <img :src='require("@/assets/img/apps/wrightin/u5.png")'>
            <img :src='require("@/assets/img/apps/wrightin/u6.png")'>
        </div>
        <div class='btn' @click='download()'>
            <div class='btn-button'>下载澜渟App</div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {getBrowserType} from '@/utils/common'
    import {getAppType} from '@/utils/app'
    import {weichatGuideDialog, downloadApp} from '@/utils/downloadApp'

    @Component({})
    export default class appsWrightin extends Vue {
        private browserType = getBrowserType()
        private appType = getAppType()

        mounted() {
            if (this.browserType == 'wechat' && this.appType == 'android') {
                weichatGuideDialog()
            }
        }

        download() {
            downloadApp()
        }
    }

</script>

<style scoped lang="scss">
    .banner {
        position: relative;
        padding-bottom: 10rem;
        >img {
            display: block;
            width: 100%; height: auto;
        }
    }
    .btn {
        position: fixed;
        bottom: 2.4rem; left: 0; right: 0;
        margin: auto;
        display: flex; flex-direction: row;
        justify-content: center; align-items: center;
        width: 34.3rem; height: 4.7rem;
        line-height: 4.2rem; text-align: center;
        font-size: 1.8rem; color: #fff;
        background-color: #FF2C79;
        border-radius: 4.7rem;
        >.btn-button {
            display: flex; flex-direction: column;
            margin: auto;
            height: 1.8rem;
            line-height: 1.8rem; 
            font-size: 1.8rem; color: #fff;
        }
    }
</style>