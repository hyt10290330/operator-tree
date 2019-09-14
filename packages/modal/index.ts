import Modal from './src/modal.jsx'
import Vue from 'vue'
;(Modal as any).install = (vue: Vue) => {
  Vue.component(Modal.name, Modal)
}

export default Modal
