<template>
    <div :class='["mdCustom" ,type!="transparent"?shadeIn:"", type]' v-if='show' ref='custom'>
        <slot v-if='slotShow'></slot>
    </div>
</template>

<script>
    export default {
        name: 'mdCustom',
        props: {
            show: { //显示
                type: Boolean,
                default: () => {
                    return false
                }
            },
            type: { //背景色 grey-灰色背景 transparent-全透明
                type: String,
                default: () => {
                    return 'grey'
                }
            }
        },
        data() {
            return {
                slotShow: true
            }
        },
        methods: {
            /*
                关闭
                @param
                @return
             */
            close() {
                this.slotShow = false
                this.$refs.custom.className += ' shadeOut'
                setTimeout(() => {
                    this.slotShow = true
                    this.$emit('update:show', false)
                }, 300)
            }
        }
    }
</script>

<style scoped lang="scss">
    .mdCustom {
        position: fixed; z-index: 99;
        top: 0; bottom: 0; left: 0; right: 0;
        background-color: rgba(0, 0, 0, 0.65);
    }
    .shadeIn {
        background-color: rgba(0, 0, 0, 0.65);
        animation: shadeIn 0.3s;
    }
    .mdCustom.transparent {
        background-color: transparent;
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
        animation: shadeOut 0.3s;
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
