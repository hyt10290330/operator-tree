import Icon from './src/icon.vue'
import Vue from 'vue'
;(Icon as any).install = (vue: Vue) => {
  Vue.component(Icon.name, Icon)
}

export default Icon
