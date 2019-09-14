<i18n>
{
  "zh": {
    "selectPlaceholder": "请选择"
  },
  "en": {
    "selectPlaceholder": "Please choose"
  }
}
</i18n>

<template>
  <a-tree-select
    :disabled="disabled"
    :dropdownStyle="{
      maxHeight: '400px',
      overflowY: 'auto',
    }"
    :loadData="loadData"
    :placeholder="$t('selectPlaceholder')"
    :treeData="treeData"
    :treeExpandedKeys="treeExpandedKeys"
    :value="data"
    @select="onSelectTreeNode"
    @treeExpand="onTreeExpand"
    class="yk-department-select"
    dropdownClassName="scrollbar"
    treeNodeLabelProp="label"
  ></a-tree-select>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from 'vue-property-decorator'

import { getTreeNode, walkTreeNode } from '../../_utils/tree'
import { getTitle } from '../../_utils/treeselect'

export interface TreeSelectNode {
  id: number
  value: string
  label: string
  isLeaf?: boolean
}

export interface NormalizedSelectTreeNode extends TreeSelectNode {
  children?: NormalizedSelectTreeNode[]
  key: string
  title?: any
  // 记录原始title，因为TreeSelect内部会覆盖这个title
  originalTitle?: any
}

export type LoadTreeDataSimple = (id?: number) => Promise<TreeSelectNode[]>

@Component
export default class DepartmentSelect extends Vue {
  @Model('change', { type: String })
  value!: string

  @Prop({ type: Function, required: true })
  loadTreeData!: LoadTreeDataSimple

  @Prop({ type: Boolean, default: false })
  disabled!: boolean

  treeData: NormalizedSelectTreeNode[] = []
  treeExpandedKeys: string[] = []

  data = this.value || ''
  @Watch('value')
  valueChanged(val: string): void {
    this.data = val
  }

  created(): void {
    this.loadTreeData()
      .then(treeNodes => {
        this.treeData = treeNodes.map(node => this.normalizeTreeNode(node))

        // 默认展开第一级
        this.treeExpandedKeys = [this.treeData[0].key]
      })
      .catch(() => {})
  }

  loadData(treeNode: any): Promise<any> {
    const key = treeNode.eventKey
    const node = this.getTreeNode(this.treeData, key)

    if (!node) {
      return Promise.resolve()
    }

    return this.loadTreeData(node.id)
      .then(treeNodes => {
        node.children = treeNodes.map(node => this.normalizeTreeNode(node))

        this.treeData = [...this.treeData]
      })
      .catch(() => {})
  }

  private normalizeTreeNode(node: TreeSelectNode): NormalizedSelectTreeNode {
    const title = getTitle('folder-open', 'folder', node, (key: string) =>
      this.treeExpandedKeys.includes(key)
    )

    return {
      ...node,
      key: node.value,
      originalTitle: title,
      title,
    }
  }

  private getTreeNode(
    nodes: NormalizedSelectTreeNode[],
    key: string
  ): NormalizedSelectTreeNode | null {
    return getTreeNode<NormalizedSelectTreeNode>(nodes, key)
  }

  private walkTreeNode(
    nodes: NormalizedSelectTreeNode[],
    callback: (node: NormalizedSelectTreeNode) => void
  ) {
    walkTreeNode<NormalizedSelectTreeNode>(nodes, callback)
  }

  onSelectTreeNode(value: string) {
    this.data = value
    this.$emit('change', value, this.getTreeNode(this.treeData, value))
  }

  onTreeExpand(expandedKeys: string[]) {
    this.treeExpandedKeys = expandedKeys
    this.walkTreeNode(this.treeData, node => {
      node.title = node.originalTitle
    })

    // 让title重新渲染
    this.treeData = [...this.treeData]
  }
}
</script>

<style lang="stylus" scoped>
@import '~style/helper'

.yk-department-select
  width 224px
  height 30px
</style>
