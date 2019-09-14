import StatusContainer from './src/status-container.vue'
import Vue from 'vue'
;(StatusContainer as any).install = (vue: Vue) => {
  Vue.component(StatusContainer.name, StatusContainer)
}

export default StatusContainer
