<template>
    <div id='main' :style='"padding-top:"+headHeight+"px"'>
        <md-head backMode='custom' :backFun='back'></md-head>

        <div class='logo_title'>
            <img src='@/assets/img/sys/login/index/logo.png' class='logo'/>
            <p class='title'>欢迎来到澜渟 · 极致学院</p>
        </div>

        <div class='con'>
            <div class='input_con input_con_phone'>
                <p class='input_con_tit'>手机号</p>
                <div class='input_con_box'>
                    <input type='tel' placeholder='请输入手机号' v-model='phone' @input='inputPhone()'>
                    <img src='@/assets/img/sys/login/phoneLogin/clear.png' class='btn_clear' @click='clearInput("phone")' v-if='phone.length>0'>
                </div>
            </div>
            <div class='input_con input_con_code'>
                <p class='input_con_tit'>验证码</p>
                <div class='input_con_box'>
                    <input type='tel' placeholder='请输入验证码' v-model='code' @input='inputCode'>
                    <img src='@/assets/img/sys/login/phoneLogin/clear.png' class='btn_clear' @click='clearInput("code")' v-if='code.length>0'>
                    <span class='btn_get'  @click='getCode()' v-if='showSendBtn'>{{btnText}}</span>
                </div>
            </div>

            <div :class='["btn", {"btn_unuse":(!showSendBtn || code.length != 6) }]' @click='login'>登录</div>
        </div>

         <p class='desc' v-show='bottomShow'>未注册账号将自动注册并登录，登录即代表您已同意<span @click='goUserAgree()'>《用户协议》</span></p>

         <md-toast :show.sync='toastShow' :content='tip'></md-toast>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, } from 'vue-property-decorator'
    import {mdToast, mdHead} from '@/components'
    import {isEmpty, trimStr, getParameter, getHeadHeight} from '@/utils/common'
    import {validPhone} from '@/utils/reg'

    @Component({
        components: {
            mdToast,mdHead
        }
    })
    export default class phoneLoginIndex extends Vue {
        private headHeight: number = getHeadHeight()
        private phone:string = ''
        private code:string = ''
        private toastShow:boolean = false
        private tip:string = ''
        private btnText:string =  "获取验证码"
        private showSendBtn:boolean = false
        private screenHeight = document.body.clientHeight
        private bottomShow:boolean = true

        mounted() {
            //解决键盘弹出时，底部信息被顶上遮挡按钮
            window.onresize = () => {
                return (() => {
                    if (this.screenHeight > document.body.clientHeight) {
                        this.bottomShow = false
                    } else {
                        this.bottomShow = true
                    }
                })()
            }
        }

        back() {
            if (getParameter('from') === 'wechatLogin') {
                history.go(-3)
            } else if (getParameter('from') == 'phoneLogin'){
                history.go(-2)
            } else {
                history.go(-1)
            }
        }

        /**
            输入手机号
            @param
            @return
        */
        inputPhone() {
            this.phone = trimStr(this.phone.replace(/[^\d| ]/g, ''))
            if (this.phone.length>11) {
                this.phone = this.phone.substring(0, 11)
            }
            this.showSendBtn = validPhone(this.phone)
        }

        /**
            清空输入框
            @param {string} type 类型
            @return
        */
        clearInput(type:string) {
            if(type == 'phone') {
                this.phone = ''
            }
            if(type == 'code') {
                this.code = ''
            }
        }

        /**
            输入验证码
            @param
            @return
        */
        inputCode() {
            this.code = this.code.replace(/[^\d]/g,'')
            if (this.code.length > 6) {
                this.code = this.code.slice(0, 6)
            }
        }
        /**
            获取验证码
            @param
            @return
        */
        getCode() {
            if (!this.checkPhone()) {
                return
            }
            this.$axios.post(`${this.$request.common}/v1/commonservice/alysms`, {
                msg_type: 1,
                phone: trimStr(this.phone.split(' ').join(''))
            }).then((res: any) => {
                if (res.code == 200) {
                    this.toastShow = true
                    this.tip = '验证码已发送'
                    let second = 60
                    this.btnText =  `重发(${second})s`
                    let countdownFnc = setInterval(() => {
                        if (--second === 0) {
                            clearInterval(countdownFnc)
                            this.btnText =  '获取验证码'
                        } else {
                            this.btnText =  `重发(${second})s`
                        }
                    }, 1000)
                } else {
                    this.tip = res.msg
                    this.toastShow = true
                }
            })
        }

        /** 
         * 登录
        */
        login() {
            if (!this.checkPhone()) {
                return
            }
            if (isEmpty(this.code)) {
                this.tip = '请输入验证码'
                this.toastShow = true
                return
            } 
            if (!isEmpty(sessionStorage.md_wechat_unionid) && !isEmpty(sessionStorage.md_wechat_nickname) && !isEmpty(sessionStorage.md_wechat_headimgurl)) {
                this.$axios.post(`${this.$request.lesson}/v2/wechat/bind`, {
                    phone: this.phone,
                    code: this.code,
                    unionid: sessionStorage.md_wechat_unionid,
                    nickname: sessionStorage.md_wechat_nickname,
                    headimgurl: sessionStorage.md_wechat_headimgurl,
                    type: '1'
                }).then((res: any) => {
                    if (res.code == 200) {
                        localStorage.md_token = res.data.token
                        this.toastShow = true
                        this.tip = '登录成功'
                        setTimeout(() => {
                            this.back()
                        }, 2000)
                    } else {
                        this.tip = res.msg
                        this.toastShow = true
                    }
                })
            } else {
                this.$axios.post(`${this.$request.rih}/API/V1/LogForToken/validIdenfifyCodeByTelForLogin`, {
                    telNumber: this.phone,
                    identifyCode: this.code,
                }).then((res: any) => {
                    if (res.code == 200) {
                        localStorage.md_token = res.data.Token
                        this.toastShow = true
                        this.tip = '登录成功'
                        setTimeout(() => {
                            this.back()
                        }, 2000)
                    } else {
                        this.tip = res.msg
                        this.toastShow = true
                    }
                })
            }
        }

        /** 
         * 用户协议
        */
        goUserAgree() {
            window.location.href = `${this.$request.web}/#/personCenter/protocol`//用户
        }

        /**
            校验-手机号
            @param
            @return {Boolean} 是否校验通过
        */
        checkPhone() {
            if (trimStr(this.phone) === '') {
                this.toastShow = true
                this.tip = '请输入手机号码'
                return false
            }
            if (!validPhone(this.phone)) {
                this.toastShow = true
                this.tip = '请输入正确的手机号码'
                return false
            }
            return true
        }
    }
</script>


<style lang='scss' scoped>
    #main {
        position: relative;
        padding: 0  0 0 1.6rem;
        width: 100vw; height: 100vh;
        background-color: #fff;
        >.logo_title {
            position: relative;
            margin-bottom: 2.5rem; padding-top: 4.8rem;
            display: flex;
            align-items: center;
            >.logo {
                margin-right: 0.5rem;
                width: 2.6rem; height: 3.4rem;
            }
            >.title {
                font-size: 2.3rem; color: #333;
            }
        }
        >.con {
            position: relative;
            padding-right: 1.6rem;
            >.input_con {
                position: relative;
                width: 100%;
                padding: 3.2rem 0 0.8rem 0;
                border-bottom: 1px solid #F4F4F4;
                >.input_con_tit {
                    margin-bottom: 1rem;
                    line-height: 1.8rem;
                    font-size: 1.3rem;
                }
                >.input_con_box {
                    position: relative;
                    width: 100%;
                    >input:-ms-input-placeholder {
                        color: #999; font-size: 1.6rem;
                    }
                    >input::-webkit-input-placeholder {
                        color: #999; font-size: 1.6rem;
                    }
                    >input {
                        line-height: 2.2rem;
                        color: #333; font-size: 1.6rem;
                    }
                    >.btn_clear {
                        position: absolute;
                        right: -1.2rem; bottom: 0; top: 0;
                        margin: auto;
                        padding: 1.2rem;
                        width: 1.4rem; height: 1.4rem;
                        box-sizing: content-box;
                    }
                }
            }
            >.input_con_code {
                >.input_con_box {
                    .btn_clear {
                        right: 7.2rem; bottom: 0; top: 0;
                        margin: auto;
                    }
                    .btn_get {
                        position: absolute;
                        right: 0; bottom: 0; top: 0;
                        margin: auto;
                        line-height: 2rem;
                        font-size: 1.4rem; color: #FF2C79;
                    }
                }
            }
            >.btn {
                position: relative;
                margin: 3.9rem auto 0 auto;
                width: 100%; height: 4.7rem;
                border-radius: 2.4rem;
                line-height: 4.7rem; text-align: center;
                font-size: 1.6rem; color: #fff;
                background-color: #FF2C79;
            }
            >.btn_unuse {
                background-color: rgba(255, 44, 121, 0.3);
            }
        }
        >.desc {
            position: fixed;
            bottom: 2.4rem; left: 0; right: 0;
            margin: auto;
            height: 1.7rem;
            line-height: 1.7rem; text-align: center;
            font-size: 1.2rem; color: #999;
            >span {
                font-size: 1.2rem; color: #7694CF;
            }
        }
    }
</style>