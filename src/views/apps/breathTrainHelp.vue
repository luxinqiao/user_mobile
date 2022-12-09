<!--
    文件描述：弹窗-训练帮助
    创建人：赵志银
    创建时间：2021.12.01
 -->
<template>
    <div id='main' ref='main'>
        <div class='title'>训练帮助</div>
        <img src='http://rightinhome.oss-cn-hangzhou.aliyuncs.com/b80_version/2020/07/01/1597026527027.gif' class='top_img'>
        <div class='action'>
            <div class='action_title'>动作要领</div>
            <div class='action_step'>
                <div class='action_step_item'>
                    <img src='@/assets/img/apps/breathTrainHelp/t1.png'>
                    <p>平躺，双腿自然弯曲，全身放松</p>
                    <span>1</span>
                </div>
                <div class='action_step_item'>
                    <img src='@/assets/img/apps/breathTrainHelp/t2.png'>
                    <p>缓慢吸气，腹部微微向上鼓起</p>
                    <span>2</span>
                </div>
                <div class='action_step_item'>
                    <img src='@/assets/img/apps/breathTrainHelp/t3.png'>
                    <p>缓慢呼气，腹部慢慢向下收缩</p>
                    <span>3</span>
                </div>
            </div>
        </div>
        <div class='mid'></div>
        <div class='way'>
            <div class='way_title'>呼吸方式</div>
            <div class='way_content'>
                <p>鼻子均匀吸气</p>
                <p>嘴巴均匀呼气</p>
            </div>
        </div>
        <div class='error'>
            <div class='error_title'>常见错误</div>
            <div class='error_cont'>
                <div class='error_item'>
                    <img src='@/assets/img/apps/breathTrainHelp/no.png'>
                    <p>错误：呼气时，快速收腹</p>
                </div>
                <div class='error_item'>
                    <img src='@/assets/img/apps/breathTrainHelp/yes.png'>
                    <p>解决：呼气时，感受腹部均匀向下回落</p>
                </div>
                <div class='error_item'>
                    <img src='@/assets/img/apps/breathTrainHelp/no.png'>
                    <p>错误：呼吸过程中，胸部向外扩张</p>
                </div>
                <div class='error_item'>
                    <img src='@/assets/img/apps/breathTrainHelp/yes.png'>
                    <p>解决：保持身体放松，将所有的意识关注在你的呼吸上，吸气尽量深长，呼气尽量细慢，胸部保持不动</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    @Component({})
    export default class appsBreathTrainHelp extends Vue {
    }
</script>

<style lang='scss' scoped>
    ::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }
    #main {
        position: relative;
        height: 100vh;
        border-top-left-radius: 0.7rem;
        border-top-right-radius: 0.7rem;
        background-color: #fff;

        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        padding-top: 5rem;
        .title {
            position: fixed;
            top: 0; left: 0;
            height: 5rem; width: 100%;
            line-height: 5rem; text-align: center;
            font-size: 1.6rem; font-weight: bold;
            background-color: #fff;
            z-index: 4;
        }
        .top_img {
            display: block;
            width: 100%; height: auto;
        }
        .action {
            position: relative;
            padding: 1.8rem 0 2.1rem 0;
            width: 100%; 
            .action_title {
                padding-left: 1.2rem;
                height: 2.1rem;
                line-height: 2.1rem;
                font-size: 1.5rem; font-weight: bold;
            }
            .action_step {
                position: relative;
                margin-top: 0.8rem;
                width: 100%;
                font-size: 0;
                display: flex;
                overflow-x: auto;
                .action_step_item {
                    display: inline-block;
                    margin-left: 1.2rem;
                    width: 12.6rem;
                    img {
                        display: block;
                        width: 100%; height: auto;
                    }
                    p {
                        padding: 0.2rem 0.8rem;
                        width: 12.6rem; height: 3.4rem;
                        line-height: 1.5rem;
                        font-size: 1.1rem; color: #fff; word-break: break-word !important;
                        border-bottom-left-radius: 0.2rem;
                        border-bottom-right-radius: 0.2rem;
                        background-color: #ADADAD;
                    }
                    span {
                        display: block;
                        margin: 0.7rem auto 0 auto;
                        width: 1.6rem; height: 1.6rem;
                        line-height: 1.6rem; text-align: center;
                        font-size: 1.2rem; color: #fff;
                        border-radius: 0.8rem;
                        background-color: #999;
                        font-family: 'PingFangSC-Medium', 'PingFang SC';
                    }
                }
            }
        }
        .mid {
            height: 1rem; width: 100%;
            background-color: #fafafa;
        }
        .way {
            position: relative;
            padding: 1.2rem 0 2.9rem 1.2rem;
            .way_title {
                height: 2.1rem;
                line-height: 2.1rem;
                font-size: 1.5rem; font-weight: bold;
            }
            .way_content {
                margin-top: 1.2rem;
                display: flex;
                align-items: center;
                height: 2rem;
                p {
                    position: relative;
                    padding-left: 0.7rem;
                    font-size: 1.4rem;
                }
                p::before {
                    display: inline-block;
                    content: '';
                    position: absolute;
                    top: 0; left: 0; bottom: 0;
                    margin: auto;
                    width: 0.5rem; height: 0.5rem;
                    border-radius: 0.25rem;
                    background-color: #FF2C79;
                }
                p:nth-of-type(2) {
                    margin-left: 4.8rem;
                }
            }
        }
        .error {
            position: relative;
            padding: 0 1.2rem 1.3rem 1.2rem;
            .error_title {
                height: 2.1rem;
                line-height: 2.1rem;
                font-size: 1.5rem; font-weight: bold;
            }
            .error_cont {
                position: relative;
                margin-top: 0.7rem; padding: 1.2rem;
                border-radius: 8px;
                background-color: #fafafa;
                .error_item {
                    position: relative;
                    img {
                        position: absolute;
                        top: 0.2rem; left: 0;
                        width: 1.4rem; height: 1.5rem;
                    }
                    p {
                        padding-left: 2.1rem;
                        line-height: 2rem;
                        font-size: 1.4rem;
                    }
                }
                .error_item:nth-of-type(1),.error_item:nth-of-type(3) {
                    margin-bottom: 1.2rem;
                }
                .error_item:nth-of-type(2) {
                    margin-bottom: 2.5rem;
                }
            }
        }
    }
</style>