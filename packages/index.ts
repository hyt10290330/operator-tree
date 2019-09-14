// 导入颜色选择器组件

import OperatorTree from './operator-tree'

// 存储组件列表
const components = [OperatorTree]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install: any = function(Vue) {
  // 判断是否可以安装
  if (install.installed) return
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component))
}

const w: any = window
// 判断是否是直接引入文件
if (typeof w !== 'undefined' && w.Vue) {
  install(w.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  OperatorTree,
}
