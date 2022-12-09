<template>
<div id='main'>
    <p></p>
    <p>亲爱的用户，您访问的页面不存在</p>
</div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    }
}
</script>

<style lang="scss" scoped>
#main {
    width: 100%;
    padding-top: 60px;
    >p:nth-child(1) {
        width: 150px; height: 150px;
        margin: 0 auto;
        background: url('../../../assets/img/sys/error/404.png') no-repeat center center;
        background-size: 100% 100%;
    }
    >p:nth-child(2) {
        margin-top: 10px;
        font-size: 20px;
        text-align: center;
    }
}
</style>
