<template>
    <div class='mdPopup shadeIn' v-if='show' ref='menu' @click='close()'>
        <div :class='getClass()' ref='content' @click.stop=''>
            <slot></slot>
            <button class='btn-close' v-if='closeIcon' @click='close()'>
                <img :src='require("../img/close.png")'>
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue, Component, Prop} from 'vue-property-decorator'

@Component
export default class mdPopup extends Vue {
    @Prop({default: false}) show?: Boolean
    @Prop({default: true}) closeIcon?: Boolean
    @Prop({default: 'up'}) direction?: String
    
    /*
        获取class
        @param
        @return {String} 样式class
     */
    getClass() {
        if (this.direction == 'up') {
            return 'content bottom bottom-transUp'
        } else if (this.direction == 'down') {
            return 'content top top-transDown'
        }
        return 'content up transUp'
    }
    /*
        关闭
        @param
        @return
     */
    close() {
        if (this.direction == 'up') {
            (this.$refs.content as Element).className += ' bottom-transDown'
        } else if (this.direction == 'down') {
            (this.$refs.content as Element).className += ' top-transUp'
        }
        (this.$refs.menu as Element).className += ' shadeOut'
        setTimeout(() => {
            this.$emit('update:show', false)
        }, 400)
    }
}
</script>

<style scoped lang='scss'>
    .mdPopup {
        position: fixed; z-index: 99;
        top: 0; bottom: 0; left: 0; right: 0;
        background-color: rgba(0, 0, 0, 0.65);
        >.content {
            position: absolute;
            left: 0; right: 0;
            >.btn-close {
                position: absolute;
                top: 0; right: 0;
                width: 3.6rem; height: 4.7rem;
                >img {
                    position: absolute;
                    top: 0; bottom: 0; left: 0; right: 0;
                    margin: auto;
                    width: 1.4rem; height: 1.5rem;
                }
            }
        }
        >.content.top {
            top: 0;
        }
        >.content.bottom {
            bottom: 0;
        }
    }
    .top-transDown {
        animation: top-transDown 0.5s;
    }
    @keyframes top-transDown {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }
    .top-transUp {
        animation: top-transUp 0.5s;
    }
    @keyframes top-transUp {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-100%);
        }
    }
    .bottom-transUp {
        animation: bottom-transUp 0.5s;
    }
    @keyframes bottom-transUp {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }
    .bottom-transDown {
        animation: bottom-transDown 0.5s;
    }
    @keyframes bottom-transDown {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(100%);
        }
    }
    .shadeIn {
        background-color: rgba(0, 0, 0, 0.65);
        animation: shadeIn 0.5s;
    }
    @keyframes shadeIn {
        from {
            background-color: rgba(0, 0, 0, 0);
        }
        to {
            background-color: rgba(0, 0, 0, 0.65);
        }
    }
    .shadeOut {
        background-color: rgba(0, 0, 0, 0);
        animation: shadeOut 0.5s;
    }
    @keyframes shadeOut {
        from {
            background-color: rgba(0, 0, 0, 0.65);
        }
        to {
            background-color: rgba(0, 0, 0, 0);
        }
    }
</style>
