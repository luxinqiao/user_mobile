<template>
    <div class='mdConfirm shadeIn' v-if='show' ref='confirm'>
        <div class='confirm' v-if='confirmShow'>
            <div class='content' v-html='content'></div>
            <div class='button'>
                <button class='left' @click='leftFun()' ref='comfirmLeft'>{{leftLabel}}</button>
                <button class='right' @click='rightFun()' ref='comfirmRight'>{{rightLabel}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'mdConfirm',
        props: {
            show: { //显示
                type: Boolean,
                default: () => {
                    return false
                }
            },
            title: { //标题
                type: String,
                default: () => {
                    return '提示'
                }
            },
            content: { //内容
                type: String,
                default: () => {
                    return ''
                }
            },
            leftLabel: { //左按钮文案
                type: String,
                default: () => {
                    return '否'
                }
            },
            rightLabel: { //右按钮文案
                type: String,
                default: () => {
                    return '是'
                }
            }
        },
        data() {
            return {
                confirmShow: true
            }
        },
        methods: {
            /*
                左按钮点击（选择框）
                @param
                @return
             */
            leftFun() {
                this.close()
                this.$emit('bindLeft')
            },
            /*
                右按钮点击（选择框）
                @param
                @return
             */
            rightFun() {
                this.close()
                this.$emit('bindRight')
            },
            /*
                关闭
                @param
                @return
             */
            close() {
                this.confirmShow = false
                this.$refs.confirm.className += ' shadeOut'
                setTimeout(() => {
                    this.confirmShow = true
                    this.$emit('update:show', false)
                }, 300)
            }
        }
    }
</script>

<style scoped lang="scss">
    .mdConfirm {
        position: fixed; z-index: 99;
        top: 0; bottom: 0; left: 0; right: 0;
        background-color: rgba(0, 0, 0, 0.65);
        >.confirm {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            padding-top: 2rem;
            width: 27rem;
            border-radius: 0.8rem;
            background-color: #fff;
            line-height: 2.1rem;
            color: #fff;
            >.content {
                padding: 0 2rem;
                text-align: center; line-height: 2.4rem;
                font-size: 1.6rem;
            }
            >.button {
                margin-top: 2rem;
                height: 5rem;
                border-top: 0.1rem solid #f4f4f4;
                >.left {
                    width: 50%; height: 100%;
                    border-right: 0.1rem solid #f4f4f4; border-radius: 0 0 0 0.8rem;
                    font-size: 1.8rem;
                    background-color: #fff;
                }
                >.right {
                    width: 50%; height: 100%;
                    border-radius: 0 0 0.8rem 0;
                    font-size: 1.8rem;
                    background-color: #fff; color: #FF2C79;
                }
            }
        }
    }
    .shadeIn {
        background-color: rgba(0, 0, 0, 0.65);
        animation: shadeIn 0.3s;
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
