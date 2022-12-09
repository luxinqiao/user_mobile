<template>
    <div :class='"mdToast "+type' v-if='show'>
        <p class='content'>{{content}}</p>
    </div>
</template>

<script>
    export default {
        name: 'mdToast',
        props: {
            show: { //显示
                type: Boolean,
                default: () => {
                    return false
                }
            },
            content: { //内容
                type: String,
                default: () => {
                    return ''
                }
            },
            type: {
                type: String,
                default: () => {
                    return ''
                }
            },
            time: { //显示时长ms
                type: Number,
                default: () => {
                    return 2000
                }
            }
        },
        watch: {
            show(newVal, oldVal) {
                if (!oldVal && newVal) {
                    setTimeout(() => {
                        this.$emit('update:show', false)
                    }, this.time)
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .mdToast {
        position: fixed; z-index: 99;
        top: 0; bottom: 0; left: 0; right: 0;
        display: flex;
        justify-content: center; align-items: center;
        >.content {
            padding: 0.8rem 1.6rem;
            max-width: 80%;
            line-height: 2.1rem;
            border-radius: 0.4rem;
            background-color: rgba(0, 0, 0, 0.8); color: #fff;
        }
    }
</style>
