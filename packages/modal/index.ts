import Modal from './src/modal.jsx'
import Vue from 'vue'
// eslint-disable-next-line
;(Modal as any).install = (vue: Vue) => {
  Vue.component(Modal.name, Modal)
}

export default Modal
