import DepartmentSelect from './src/department-select.vue'

import Vue from 'vue'
;(DepartmentSelect as any).install = (vue: Vue) => {
  Vue.component(DepartmentSelect.name, DepartmentSelect)
}

export default DepartmentSelect
