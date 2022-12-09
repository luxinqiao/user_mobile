<template>
    <div id='index'>
        <router-view></router-view>
    </div>
</template>

<script lang='ts'>
import {Component, Vue, Watch} from 'vue-property-decorator'
import {Mutation} from 'vuex-class'
import {getCookie} from '@/utils/common'
import routerView from './views/sys/routerView/index.vue'

@Component({
    components: {
        routerView
    }
})

export default class walletUnCount extends Vue {
    @Mutation('SET_SKIN') mutationSkin: any

    mounted() {
        //初始化设置
        getCookie('skin') == 'dark' ? this.mutationSkin('dark') : ''
        //设置皮肤--开放供app调用(white-白色,dark-黑暗)
        ;(window as any).setSkin = (skin: string) => {
            this.mutationSkin(skin)
        }
    }
}
</script>

<style lang='scss'>
    @import '@/assets/css/common.scss';
</style>

<style lang='scss' scoped>
    #index {
        height: 100%;
    }
</style>