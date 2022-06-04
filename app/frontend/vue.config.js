module.exports = {
    publicPath: '/',
    outputDir: 'build',
    assetsDir: 'static',
    indexPath: 'index.html',

    chainWebpack: config => {
        config.devServer
            .public('http://localhost:8080')
            .hotOnly(true)
            .headers({ "Access-Control-Allow-Origin": "*" })
            .writeToDisk(filePath => filePath.endsWith('index.html'))
    }
}