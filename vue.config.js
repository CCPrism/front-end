module.exports = {
    publicPath: './',
    productionSourceMap: false,

    devServer: {
        open: true,
        host: 'localhost',
        port: '8080',
        proxy: {
            '/api': {
                target: 'http://10.144.5.120:8888/api/',
                ws: true,//是否代理websockets
                changeOrigin: true,   // 设置同源  默认false，是否需要改变原始主机头为目标URL
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    },

};