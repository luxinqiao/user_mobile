//自适应布局：动态设置rem与px比例
let pxW:number = 375
const resizeFontSize = () => {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / pxW * 10 + 'px'
}
resizeFontSize()
window.addEventListener('resize', resizeFontSize, false)

export default {
    resetPxWidth: (w = 375) => { //重置设计图基准像素宽度（默认375px下，1rem=10px）
        pxW = w
        resizeFontSize()
    }
}
