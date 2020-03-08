

module.exports = (env, argv) => {
  return {
    // 模式
    mode: 'development',
    // 插件设置
    plugins: [
      // 允许创建一个在编译时可以配置的全局常量
      new webpack.DefinePlugin({
        'process.env': {
          'APP_IS': 'false'
        }
      })
    ],
  }
}