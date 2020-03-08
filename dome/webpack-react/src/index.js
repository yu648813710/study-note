import { test } from './one.js'

// 判断热模块启动
if (module.hot) {
  module.hot.accept();
}

test()
