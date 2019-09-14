import { getClass, getStyle } from '../../_utils/props-util' // TS有alias，js未配置

import { Modal } from 'ant-design-vue'

const locales = {
  zh: {
    retry: '重试',
  },
  en: {
    retry: 'Retry',
  },
}

export default {
  props: {
    ...window.antd.Modal.props,
    submit: {
      type: Function,
    },
    cancel: {
      type: Function,
    },
  },
  model: {
    prop: 'visible',
    event: 'change',
  },
  inject: {
    localeData: { default: () => ({}) },
  },
  data() {
    return {
      locale: this.localeData.antLocale.locale.split('-')[0],
      overrideProps: {
        visible: this.visible,
        maskClosable: false,
        confirmLoading: this.confirmLoading,
        okText: this.okText,
      },
    }
  },
  watch: {
    visible(val) {
      this.overrideProps.visible = val
    },
    confirmLoading(val) {
      this.overrideProps.confirmLoading = val
    },
    okText(val) {
      this.overrideProps.okText = val
    },
  },
  render() {
    const listeners = {
      ...this.$listeners,
    }

    if (this.submit) {
      listeners.ok = e => {
        const result = this.submit()
        this.overrideProps.confirmLoading = true

        result
          .then(() => {
            this.overrideProps.visible = false
            this.overrideProps.confirmLoading = false
            this.$emit('change', false)
          })
          .catch(() => {
            this.overrideProps.confirmLoading = false
            this.overrideProps.okText = locales[this.locale].retry
          })
      }
    }

    if (this.cancel) {
      listeners.cancel = e => {
        const cancel = this.cancel()
        cancel
          .then(() => {
            this.overrideProps.visible = false
            this.$emit('cancel', false)
          })
          .catch(() => {})
      }
    }

    const props = {
      props: {
        ...this.$props,
        ...this.overrideProps,
      },
      on: listeners,
      class: getClass(this),
      style: getStyle(this),
    }

    return (
      <div>
        <Modal {...props}>{this.$slots.default}</Modal>
      </div>
    )
  },
}
