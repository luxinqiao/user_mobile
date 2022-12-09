const timeStamp = new Date().getTime()
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require("path")

module.exports = {
    // 公共路径
    publicPath: '/',
    // 相对于打包路径index.html的路径
    indexPath: 'index.html',
    // 'dist', 生产环境构建文件的目录
    outputDir: 'dist',
    // 相对于outputDir的静态资源(js、css、img、fonts)目录
    assetsDir: 'static',
    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    lintOnSave: false,
    // 是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: true,
    // 生产环境的 source map
    productionSourceMap: true,
    // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    parallel: require("os").cpus().length > 1,
    // 向 PWA 插件传递选项。
    pwa: {},
    chainWebpack: config => {},
    configureWebpack: {
	    output: {
            filename: `static/js/[name].${timeStamp}.js`,
            chunkFilename: `static/js/[name].${timeStamp}.js`,
		},
        plugins: [
            // 复制到自定义静态源
            new CopyWebpackPlugin([{from: path.join(__dirname, 'config/WBxIU4v7xt.txt'),to: 'college/live'}]),
            new CopyWebpackPlugin([{from: path.join(__dirname, 'config/VtpA4vgUW9.txt')}]),
            new CopyWebpackPlugin([{from: path.join(__dirname, 'config/VtpA4vgUW9.txt'),to: 'apps'}]),
        ]
    },
    css: {
        extract: {
            filename:`static/css/[name].${timeStamp}.css`,
            chunkFilename:`static/css/[name].${timeStamp}.css`,
        }
    },
    devServer: {
        overlay: { // 让浏览器 overlay 同时显示警告和错误
            warnings: true,
            errors: true
        },
        host: "0.0.0.0",
        port: 8081,
        https: false,
        open: false,
        hotOnly: true,
        proxy: null
    }
}