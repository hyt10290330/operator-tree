import OperationTree from './src/OperationTree.vue'
import Vue from 'vue'
// eslint-disable-next-line
;(<any>OperationTree).install = (vue: Vue) => {
  Vue.component(OperationTree.name, OperationTree)
}
// eslint-disable-next-line
export default OperationTree
