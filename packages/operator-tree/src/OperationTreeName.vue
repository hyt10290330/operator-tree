<i18n>
{
  "zh": {
    "title": "修改名称",
    "name": "{0}名称",
    "namePlaceHolder": "请输入{0}名称"
  },
  "en": {
    "name": "{0} name",
    "title": "Modify name",
    "namePlaceHolder": "Please enter a {0} name"
  }
}
</i18n>

<template>
  <yk-modal
    :submit="submitData"
    :title="$t('title')"
    v-model="visibleData"
  >
    <a-form
      :form="form"
      class="yk-operation-tree-name"
      layout="vertical"
    >
      <a-form-item
        :colon="false"
        :label="$t('name', [objectTitle])"
      >
        <a-input
          :placeholder="$t('namePlaceHolder', [objectTitle])"
          maxlength="30"
          v-decorator="[
            'name',
            {
              initialValue: name,
              rules: [{ required: true }, { max: 30 }],
            },
          ]"
        />
      </a-form-item>
    </a-form>
  </yk-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Model } from 'vue-property-decorator'

import YkModal from 'components/feedback/modal/Modal.jsx'
import { OperationTreeNode, UpdateTreeNode } from './OperationTree.vue'

import { getCommonValidateMessages } from '../../_utils/validate'

@Component({
  components: {
    YkModal,
  },
})
export default class OperationTreeName extends Vue {
  @Prop({ type: String, required: true })
  objectTitle!: string

  @Prop({ type: Function, required: true })
  updateNodeName!: UpdateTreeNode

  @Prop({ type: Object, required: true })
  originNode!: OperationTreeNode

  @Model('change', { type: Boolean, default: false })
  visible!: boolean

  visibleData: boolean = false
  @Watch('visible', { immediate: true })
  visibleChanged(val: boolean): void {
    this.visibleData = val
  }

  @Watch('visibleData')
  visibleDataChanged(): void {
    this.$emit('change', this.visibleData)
  }

  form!: any
  name = ''
  @Watch('originNode', { immediate: true })
  originNodeChanged(val: OperationTreeNode): void {
    if (val) {
      this.name = val.title
    } else {
      this.name = ''
    }
  }

  beforeCreate(): void {
    this.form = this.$form.createForm(this, {
      validateMessages: getCommonValidateMessages(),
      onValuesChange: (props, values) => {
        if (typeof values.name !== 'undefined') {
          this.name = values.name
        }
      },
    })
  }

  submitData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.form.validateFieldsAndScroll(
        {
          force: true,
        },
        (err: any, values: any) => {
          if (err) {
            reject(err)
            return
          }

          this.updateNodeName({
            ...this.originNode,
            title: this.name,
          })
            .then(node => {
              resolve()

              this.$emit('success', node)
            })
            .catch(err => reject(err))
        }
      )
    })
  }
}
</script>

<style lang="stylus" scoped></style>
