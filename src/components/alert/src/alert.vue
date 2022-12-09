<template>
    <div class='mdAlert shadeIn' v-if='show' ref='alert'>
        <div class='alert' v-if='alertShow'>
            <div class='title' v-if='title'>{{title}}</div>
            <div class='content'>
                <span>{{content}}</span>
            </div>
            <div class='button'>
                <button class='confirm' @click='confirmFun()' ref='alertBtn'>{{confirmLabel}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'mdAlert',
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
            confirmLabel: { //按钮文案
                type: String,
                default: () => {
                    return '确定'
                }
            }
        },
        data() {
            return {
                alertShow: true
            }
        },
        methods: {
            /*
                确认（警告框）
                @param
                @return
             */
            confirmFun() {
                this.close()
                this.$emit('bindConfirm')
            },
            /*
                关闭
                @param
                @return
             */
            close() {
                this.alertShow = false
                this.$refs.alert.className += ' shadeOut'
                setTimeout(() => {
                    this.alertShow = true
                    this.$emit('update:show', false)
                }, 300)
            }
        }
    }
</script>

<style scoped lang="scss">
    .mdAlert {
        position: fixed; z-index: 99;
        top: 0; bottom: 0; left: 0; right: 0;
        background-color: rgba(0, 0, 0, 0.65);
        >.alert {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            padding-top: 2rem;
            width: 27rem;
            line-height: 2.1rem;
            border-radius: 0.8rem;
            background-color: #fff; color: #fff;
            >.title {
                margin-bottom: 0.9rem;
                height: 1.8rem;
                text-align: center; line-height: 1.8rem;
                font-size: 1.8rem;
            }
            >.content {
                padding: 0 2rem;
                text-align: center;
                >span {
                    display: inline-block;
                    text-align: left; line-height: 2.3rem;
                    font-size: 1.5rem;
                    color: #999;
                }
            }
            >.button {
                margin-top: 2rem;
                height: 5rem;
                border-top: 0.1rem solid #f4f4f4;
                >.confirm {
                    width: 100%; height: 5rem;
                    line-height: 5rem;
                    border-radius: 0 0 0.8rem 0.8rem;
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
