module.exports = {
    devServer: {
        proxy: {
            '/api' : {
                target: "http://simplebbs.iterator-traits.com",
                ws: true,
                changeOrigin: true
            },
            '/assumeRole' : {
                target: "http://47.98.37.155:12306",
                ws: true,
                changeOrigin: true
            }
        }
    }
}