import OperationTree from './src/OperationTree.vue'
import Vue from 'vue'
;(OperationTree as any).install = (vue: Vue) => {
  Vue.component(OperationTree.name, OperationTree)
}

export default OperationTree
