<i18n>
{
  "zh": {
    "moveTitle": "移动{0}",
    "moveDesc": "将所选的{0}移动到指定{1}"
  },
  "en": {
    "moveDesc": "Move selected {0} to the specified {1}",
    "moveTitle": "Move {0}"
  }
}
</i18n>

<template>
  <yk-modal
    :bodyStyle="{ 'overflow-x': 'auto' }"
    :okButtonProps="okButtonProps"
    :submit="submitMove"
    :title="$t('moveTitle', [objectTitle])"
    v-model="visibleData"
  >
    <div class="yk-operation-tree-move">
      <yk-header
        :title="$t('moveDesc', [objectTitle, targetTitle])"
        size="small"
      />
      <a-tree
        :autoExpandParent="autoExpandParent"
        :defaultExpandAll="true"
        :expandedKeys="expandedKeys"
        :icon="treeIcon"
        :loadData="loadData"
        :selectedKeys.sync="selectedKeys"
        :showIcon="true"
        :treeData="treeData"
        @expand="onExpandTreeNode"
      ></a-tree>
    </div>
  </yk-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Model } from 'vue-property-decorator'
import _ from 'lodash'

import YkModal from 'components/feedback/modal/Modal.jsx'
import YkHeader from 'components/layout/header/Header.vue'

import formConfig from 'pages/index/config/antd/form'

import {
  getIcon,
  getLoadData,
  getTreeNode,
  mapTreeNode,
} from 'components/_utils/tree'

import {
  OperationLoadTreeData,
  MoveTreeNode,
  OperationTreeNode,
} from './OperationTree.vue'

export type ExcludeMoveTreeNode = (node: OperationTreeNode) => boolean

@Component({
  components: {
    YkModal,
    YkHeader,
  },
})
export default class OperationTreeMove extends Vue {
  @Prop({ type: String, required: true })
  objectTitle!: string

  @Prop({ type: String, required: true })
  targetTitle!: string

  @Prop({ type: Function, required: true })
  loadTreeData!: OperationLoadTreeData

  @Prop({ required: true })
  originNode!: any

  @Prop({ type: Function, required: true })
  moveNode!: MoveTreeNode<any>

  @Prop(Function)
  exclude!: ExcludeMoveTreeNode

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

  treeData: OperationTreeNode[] = []
  treeIcon = getIcon('folder', 'folder', 'folder-open')
  expandedKeys: string[] = []
  autoExpandParent = false
  selectedKeys: string[] = []
  loadData(treeNode: any) {
    return getLoadData<OperationTreeNode>(this, node => {
      // 实现节点过滤，不允许操作的节点
      const p = node ? this.loadTreeData(node.id) : this.loadTreeData()
      if (!this.exclude) {
        return p
      }

      return p.then(nodes => nodes.filter(node => !this.exclude(node)))
    })(treeNode)
  }

  get okButtonProps(): any {
    return {
      props: {
        disabled: this.selectedKeys.length === 0,
      },
    }
  }

  created(): void {
    this.loadTreeData()
      .then((nodes: OperationTreeNode[]) => {
        this.treeData = nodes
        if (nodes.length) {
          this.expandedKeys = [nodes[0].key]
          this.autoExpandParent = true
        }
      })
      .catch(() => {})
  }

  onExpandTreeNode(expandedKeys: string[]): void {
    this.expandedKeys = expandedKeys
    this.autoExpandParent = false
  }

  submitMove(): Promise<void> {
    // 处理数据
    // 1. 将当前treeData回传
    // 2. 将选择节点回传
    console.log('submitMove')
    const targetParentNode = getTreeNode<OperationTreeNode>(
      this.treeData,
      this.selectedKeys[0]
    ) as OperationTreeNode

    return this.moveNode({
      origin: this.originNode,
      target: targetParentNode,
    }).then(node => {
      this.$emit('success', _.cloneDeep(this.treeData), node)
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~style/helper'

.yk-operation-tree-move
  min-height 200px

  >>>.ant-tree
    margin-top 12px
</style>
