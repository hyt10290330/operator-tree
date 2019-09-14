<i18n>
{
  "zh": {
    "division": "添加{0}",
    "name": "{0}名称",
    "namePlaceHolder": "请输入{0}名称",
    "origin": "所属{0}"
  },
  "en": {
    "name": "{0} name",
    "origin": "Belong to {0}",
    "division": "Add {0}",
    "namePlaceHolder": "Please enter a {0} name"
  }
}
</i18n>

<template>
  <yk-modal :submit="submitDivisition" :title="$t('division', [objectTitle])" v-model="visibleData">
    <a-form :form="form" class="yk-operation-tree-division" layout="vertical">
      <a-form-item :colon="false" :label="$t('name', [objectTitle])">
        <a-input
          :placeholder="$t('namePlaceHolder', [objectTitle])"
          maxlength="30"
          v-decorator="[
            'name',
            {
              rules: [{ required: true }, { max: 30 }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        :colon="false"
        :label="$t('origin', [objectTitle])"
        v-if="visibleData && !parentNode"
      >
        <yk-department-select
          :loadTreeData="loadDepartmentTreeData"
          @change="onChangeParent"
          ref="departmentSelect"
          v-decorator="[
            'parentIdStr',
            {
              rules: [{ required: true }],
            },
          ]"
        ></yk-department-select>
      </a-form-item>
    </a-form>
  </yk-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Model } from 'vue-property-decorator'
import _ from 'lodash'

import YkModal from 'components/feedback/modal/Modal.jsx'
import YkDepartmentSelect from 'components/entry/select/DepartmentSelect.vue'

import formConfig from 'pages/index/config/antd/form'

import { getTreeNode, mapTreeNode } from '../_utils/tree'

import {
  OperationTreeNode,
  OperationSelectTreeNode,
  OperationLoadTreeData,
  AddTreeNode,
  transformToTreeSelectNode,
  transformToOperationTreeNode,
} from './OperationTree.vue'

@Component({
  components: {
    YkModal,
    YkDepartmentSelect,
  },
})
export default class OperationTreeDivision extends Vue {
  @Prop({ type: String, required: true })
  objectTitle!: string

  @Prop({ type: Function, required: true })
  loadTreeData!: OperationLoadTreeData

  @Prop({ type: Function, required: true })
  addNode!: AddTreeNode

  @Prop(Object)
  parentNode!: OperationTreeNode | null

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
  selectedNode!: OperationSelectTreeNode

  @Watch('parentNode', { immediate: true })
  parentNodeChanged(): void {
    if (this.parentNode) {
      this.selectedNode = transformToTreeSelectNode(this.parentNode)
    }
  }

  beforeCreate(): void {
    this.form = this.$form.createForm(this, {
      validateMessages: formConfig.validateMessages,
      onValuesChange: (props, values) => {
        if (typeof values.name !== 'undefined') {
          this.name = values.name
        }
      },
    })
  }

  loadDepartmentTreeData(key?: number): Promise<OperationSelectTreeNode[]> {
    return this.loadTreeData(key).then(nodes =>
      nodes.map(node => transformToTreeSelectNode(node))
    )
  }

  onChangeParent(key: string, node: OperationSelectTreeNode): void {
    this.selectedNode = node
  }

  submitDivisition(): Promise<any> {
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

          this.addNode({
            name: this.name,
            node: transformToOperationTreeNode(this.selectedNode),
          })
            .then(node => {
              resolve()

              // 处理数据
              // 1. 将当前treeData回传（可能为空）
              // 2. 将新节点回传
              let treeData: OperationTreeNode[] | null = null

              if (!this.parentNode) {
                treeData = mapTreeNode<
                  OperationSelectTreeNode,
                  OperationTreeNode
                >((this.$refs.departmentSelect as any).treeData, node =>
                  transformToOperationTreeNode(node)
                )
              }

              this.$emit('success', treeData, node)
            })
            .catch(err => reject(err))
        }
      )
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~style/helper';

.yk-operation-tree-division {
  margin-bottom: -24px;

  >>>.yk-department-select {
    width: 100%;
  }
}
</style>
