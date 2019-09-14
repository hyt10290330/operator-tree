import DepartmentSelect from './src/department-select.vue'

import Vue from 'vue'
// eslint-disable-next-line
;(DepartmentSelect as any).install = (vue: Vue) => {
  Vue.component(DepartmentSelect.name, DepartmentSelect)
}

export default DepartmentSelect
