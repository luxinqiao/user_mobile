declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

declare interface Window {
    jsInterface: any,
    webkit: any
}

declare module '@/utils/md5.js'
