<template>
    <div id='routerView'>
        <transition :name='transition'>
            <keep-alive :include='includeRoute'>
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script lang='ts'>
    import routes from '@/router/staticRoute'

    export default {
        data() {
            return {
                includeRoute: ''
            }
        },
        created() {
            this.setChildrenAlive(routes)
            if (this.includeRoute.length > 0) {
                this.includeRoute = this.includeRoute.substr(0, this.includeRoute.length - 1)
            }
        },
        methods: {
            /**
                设置路由缓存
                @param routes 子路由
                @return
             */
            setChildrenAlive(routes: any) {
                for (let i: number = 0; i<routes.length; i++) {
                    const route: any = routes[i]
                    if (route.children && route.children.length > 0) {
                        this.setChildrenAlive(route.children)
                    } else if (route.name && route.meta && route.meta.keepAlive) {
                        this.includeRoute += route.name + ','
                    }
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
#routerView {
    height: 100%; width: 100vw;
}

.trans-left-enter-active {
    position: fixed; z-index: 200;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    animation: transLeft .2s linear forwards;
}
.trans-left-leave-active {
    position: fixed; z-index: 100;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    animation: transOrigin .2s linear forwards;
}
.trans-right-enter-active {
    position: fixed; z-index: 100;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    animation: transOrigin .2s linear forwards;
}
.trans-right-leave-active {
    position: fixed; z-index: 200;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    animation: transRight .2s linear forwards;
}

@keyframes transLeft {
    from {
        transform: translate(100%, 0);
    }
    to {
        transform: translate(0, 0);
    }
}
@keyframes transRight {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translate(100%, 0);
    }
}
@keyframes transOrigin {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translate(0, 0);
    }
}
</style>