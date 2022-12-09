<template>
    <div id='main' v-if='pageShow' :style='"padding-top:"+headHeight+"px"'>
        <img src='@/assets/img/sys/login/index/logo.png' class='logo'/>
        
        <p class='title'>欢迎来到澜渟 · 极致学院</p>

        <div class='btn btn_wechat' @click='weChatLogin'>微信一键登录</div>

        <p class='desc'>未注册账号将自动注册并登录，登录即代表您已同意<span @click='goUserAgree'>《用户协议》</span></p>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {mdHead} from '@/components'
    import {isEmpty, getParameter, getBrowserType, setWechatRole, urlChange, getToken, getHeadHeight} from '@/utils/common'
    import {redirect} from '@/utils/weChat'

    @Component({
        components: {
            mdHead
        }
    })
    export default class loginIndex extends Vue{
        private headHeight: number = getHeadHeight()
        private pageShow:boolean = true

        mounted() {
            if(getBrowserType() == 'wechat' && !isEmpty(getParameter('unionid'))) {
                setWechatRole(urlChange(window.location.href))
                if (isEmpty(getParameter('token')) || isEmpty(getToken())) {
                    this.pageShow = false
                    this.$router.push(`/login/phoneLogin?from=wechatLogin`)
                } else {
                    this.pageShow = false
                    history.go(-2)
                }
            }
            // 解决部分手机在一键登陆后，获取token成功后，返回详情页失效
            if(!isEmpty(getToken())) {
                this.pageShow = false
                window.location.replace(sessionStorage.md_history_url)
            }
        }
        /** 
         * 一键登录
        */
        weChatLogin() {
            if (isEmpty(getToken()) && !isEmpty(sessionStorage.md_wechat_unionid) && !isEmpty(sessionStorage.md_wechat_nickname) && !isEmpty(sessionStorage.md_wechat_headimgurl) && !isEmpty(localStorage.md_wechat_openid)) {
                this.$router.push(`/login/phoneLogin?from=phoneLogin`)
                return
            }
            redirect()
        }

        /** 
         * 手机号登录
        */
        phoneLogin() {
            this.$router.push('/login/phoneLogin?from=phoneLogin')
        }

        /** 
         * 用户协议
        */
        goUserAgree() {
            window.location.href = `${this.$request.web}/#/personCenter/protocol`//用户
        }
    }
</script>


<style lang='scss' scoped>
    #main {
        position: relative;
        width: 100vw; height: 100vh;
        background-color: #fff;
        >.logo {
            display: block;
            margin: 0 auto; padding-top: 9.2rem;
            width: 3.2rem; height: 4.6rem;
            box-sizing: content-box;
        }
        >.title {
            margin: 1.4rem;
            height: 3rem;
            font-size: 2.2rem; color: #333;
            text-align: center; line-height: 3rem; font-weight: bold;
        }
        >.btn {
            position: relative;
            margin: auto 1.6rem;
            width: 34.3rem; height: 4.7rem;
            border-radius: 2.4rem; border: 1px solid #FF2C79;
            line-height: 4.7rem; text-align: center;
            font-size: 1.6rem;
        }
        >.btn_wechat {
            margin: 6.8rem auto 0 auto;
            color: #fff;
            background-color: #FF2C79;
            box-shadow: 0 0.3rem 1.2rem 0 rgba(239, 94, 143, 0.28);
        }
        >.btn_phone {
            margin: 2rem auto 0 auto;
            color: #EF5E8F;
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