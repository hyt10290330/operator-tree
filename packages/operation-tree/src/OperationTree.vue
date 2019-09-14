<i18n>
{
  "zh": {
    "division": "添加{0}",
    "subdivision": "添加子{0}",
    "modify": "修改名称",
    "move": "移动{0}",
    "delete": "删除",
    "deleteTitle": "确认要删除{0}吗？",
    "deleteContent": "删除将无法恢复，请仔细确认."
  },
  "en": {
    "move": "Move {0}",
    "modify": "Modify name",
    "delete": "Delete",
    "division": "Add {0}",
    "subdivision": "Add child {0}",
    "deleteTitle": "Are you sure you want to delete {0}?",
    "deleteContent": "The deletion will not be restored, please confirm it carefully."
  }
}
</i18n>

<template>
  <div class="operation-tree">
    <div class="tree-header">
      <div :title="$t('division', [objectTitle])" @click="onDivision" class="tree-header-add">
        <icon class="icon" type="icon-folder-add" />
      </div>
      <search-input @search="onSearch" style="flex: 1" v-model="searchKeyword"></search-input>
    </div>
    <div class="tree-body scrollbar">
      <a-tree
        :autoExpandParent="autoExpandParent"
        :defaultExpandAll="true"
        :expandedKeys="expandedKeys"
        :icon="treeIcon"
        :loadData="loadData"
        :loadedKeys="loadedKeys"
        :selectedKeys="selectedKeys"
        :showIcon="true"
        :treeData="treeData"
        @expand="onExpandTreeNode"
        @load="onTreeDataLoaded"
        @select="onSelectTreeNode"
        v-show="!searchKeyword"
      >
        <template #title="{ key, title }">
          <span :title="title">{{ title }}</span>
          <a-dropdown
            :trigger="['click']"
            @click.stop.native
            @visibleChange="onDropdownToggle($event, key)"
            class="tree-dropdown"
          >
            <a class="ant-dropdown-link" href="javascript:;">
              <icon type="icon-gengduo" />
            </a>
            <a-menu @click="onClickMenu($event, key)" slot="overlay">
              <a-menu-item key="subdivision">
                <a href="javascript:;">{{ $t('subdivision', [objectTitle]) }}</a>
              </a-menu-item>
              <a-menu-item key="modify" v-if="allowUpdateRootName || !isRootNode(key)">
                <a href="javascript:;">{{ $t('modify') }}</a>
              </a-menu-item>
              <a-menu-item key="move" v-if="!isRootNode(key)">
                <a href="
                javascript:;">{{ $t('move', [objectTitle]) }}</a>
              </a-menu-item>
              <a-menu-item key="delete" v-if="!isRootNode(key)">
                <a href="
                javascript:;">{{ $t('delete') }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-tree>
      <operation-tree-search-result
        :keyword="confirmedSearchKeyword"
        :searchNode="searchNode"
        @select="onSelectResult"
        v-if="confirmedSearchKeyword"
      ></operation-tree-search-result>
    </div>
    <operation-tree-division
      :addNode="addNode"
      :loadTreeData="loadTreeData"
      :objectTitle="objectTitle"
      :parentNode="operationNode"
      @success="onDivisionSuccess"
      v-if="divisionVisible"
      v-model="divisionVisible"
    ></operation-tree-division>
    <operation-tree-move
      :exclude="moveExcludeNode"
      :loadTreeData="loadTreeData"
      :moveNode="moveNode"
      :objectTitle="objectTitle"
      :originNode="operationNode"
      :targetTitle="objectTitle"
      @success="onMoveSuccess"
      v-if="moveVisible"
      v-model="moveVisible"
    ></operation-tree-move>
    <operation-tree-name
      :objectTitle="objectTitle"
      :originNode="operationNode"
      :updateNodeName="updateNodeName"
      @success="onNameSuccess"
      v-if="nameVisible"
      v-model="nameVisible"
    ></operation-tree-name>
  </div>
</template>

<script lang="tsx">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { TreeNode } from 'ant-design-vue/types/tree-node'

import Icon from '../../icon'
import SearchInput from '../../search-input'
import Modal from '../../modal'
import { NormalizedSelectTreeNode } from '../../department-select/src/department-select.vue'

import OperationTreeDivision from './OperationTreeDivision.vue'
import OperationTreeMove, { ExcludeMoveTreeNode } from './OperationTreeMove.vue'
import OperationTreeName from './OperationTreeName.vue'
import OperationTreeSearchResult from './OperationTreeSearchResult.vue'

import {
  getIcon,
  getLoadData,
  getTreeNode,
  walkTreeNode,
  removeTreeNode,
  mergeTree,
} from '../../_utils/tree'

export interface OperationTreeNode extends Partial<TreeNode> {
  id: number
  key: string
  title: string
  parentId: number | null
  children?: OperationTreeNode[]
}

export interface OperationSelectTreeNode extends NormalizedSelectTreeNode {
  parentId: number | null
}

export type OperationLoadTreeData = (
  id?: number
) => Promise<OperationTreeNode[]>

export interface AddForm {
  name: string
  node: OperationTreeNode
}

export type AddTreeNode = (data: AddForm) => Promise<OperationTreeNode>

export interface MoveForm<T> {
  origin: T
  target: OperationTreeNode
}

export type MoveTreeNode<T> = (data: MoveForm<T>) => Promise<T>

export type DeleteTreeNode = (node: OperationTreeNode) => Promise<void>

export type UpdateTreeNode = (node: OperationTreeNode) => Promise<void>

export interface OperationTreeSearchResultItem
  extends Pick<OperationTreeNode, 'id' | 'key' | 'title'> {
  parentTitle: string
}

export type SearchNode = (
  keyword: string
) => Promise<OperationTreeSearchResultItem[]>

export function transformToTreeSelectNode(
  node: OperationTreeNode
): OperationSelectTreeNode {
  return {
    id: node.id,
    key: node.key,
    value: node.key,
    label: node.title,
    isLeaf: node.isLeaf,
    parentId: node.parentId,
  }
}

export function transformToOperationTreeNode(
  node: OperationSelectTreeNode
): OperationTreeNode {
  return {
    id: node.id,
    key: node.value,
    title: node.label,
    isLeaf: node.isLeaf,
    parentId: node.parentId,
  }
}

@Component({
  components: {
    Icon,
    SearchInput,
    Modal,
    OperationTreeDivision,
    OperationTreeMove,
    OperationTreeName,
    OperationTreeSearchResult,
  },
})
export default class OperationTree extends Vue {
  @Prop({ type: String, required: true })
  objectTitle!: string

  @Prop({ type: Function, required: true })
  loadTreeData!: OperationLoadTreeData

  @Prop({ type: Function, required: true })
  addNode!: AddTreeNode

  @Prop({ type: Function, required: true })
  moveNode!: MoveTreeNode<OperationTreeNode>

  @Prop({ type: Function, required: true })
  deleteNode!: DeleteTreeNode

  @Prop({ type: Function, required: true })
  updateNodeName!: UpdateTreeNode

  @Prop({ type: Function, required: true })
  searchNode!: SearchNode

  @Prop({ type: Boolean, default: false })
  allowUpdateRootName!: boolean

  // Main Tree
  treeData: OperationTreeNode[] = []
  treeIcon = getIcon('folder', 'folder', 'folder-open')
  loadedKeys: string[] = []
  selectedKeys: string[] = []
  expandedKeys: string[] = []
  autoExpandParent = false

  @Watch('selectedKeys')
  selectedKeysChanged(val: string[]): void {
    if (val.length) {
      this.$emit('select', val[0])
    }
  }

  loadData(treeNode: any) {
    return getLoadData<OperationTreeNode>(this, node => {
      return (node ? this.loadTreeData(node.id) : this.loadTreeData()).then(
        p => {
          return p
        }
      )
    })(treeNode)
  }

  created(): void {
    this.loadTreeData()
      .then((nodes: OperationTreeNode[]) => {
        this.treeData = nodes
        this.normalizeTreeNode()
        this.selectNode(this.treeData[0])
      })
      .catch(() => {})
  }

  // 树节点操作
  // 1. 增加操作：normalizeTreeNode
  // 2. 操作时选中状态：setTreeNodeDropdown
  onDropdownToggle(visible: boolean, key: string): void {
    this.setTreeNodeDropdown(visible, key)
  }

  private setTreeNodeDropdown(visible: boolean, key: string) {
    const node = getTreeNode<OperationTreeNode>(this.treeData, key)
    const nodeDropdownClass = 'tree-dropdown-node'

    if (node) {
      if (visible) {
        node.class = nodeDropdownClass
      } else {
        node.class = node.class ? node.class.replace(nodeDropdownClass, '') : ''
      }

      this.$forceUpdate()
    }
  }

  onTreeDataLoaded(loadedKeys: string[]): void {
    this.loadedKeys = loadedKeys
    this.normalizeTreeNode()
  }

  private normalizeTreeNode(): void {
    walkTreeNode<OperationTreeNode>(this.treeData, node => {
      node.scopedSlots = {
        ...(node.scopedSlots || {}),
        title: 'title',
      }
    })

    this.$forceUpdate()
  }

  // 选择逻辑
  // 1. 不允许取消选择
  onSelectTreeNode(selectedKeys: string[]): void {
    if (selectedKeys.length) {
      this.selectedKeys = selectedKeys
    }
  }

  onExpandTreeNode(expandedKeys: string[]): void {
    this.expandedKeys = expandedKeys
    this.autoExpandParent = false
  }

  // 操作节点逻辑
  // 1. 根节点只允许添加子节点
  // 2. 其他节点，均允许操作
  onClickMenu(e: any, key: string) {
    const node = getTreeNode<OperationTreeNode>(this.treeData, key)
    if (node === null) {
      return
    }

    switch (e.key) {
      case 'subdivision':
        this.divisionVisible = true
        this.operationNode = node
        break
      case 'modify':
        this.nameVisible = true
        this.operationNode = node
        break
      case 'move':
        this.moveVisible = true
        this.operationNode = node
        break
      case 'delete':
        this.$confirm({
          title: this.$t('deleteTitle', [node.title]) as string,
          content: this.$t('deleteContent') as string,
          onOk: () => {
            this.deleteNode(node)
              .then(() => {
                this.handleDeleteTreeNode(node)
              })
              .catch(e => {})
          },
        })
        break
    }

    this.setTreeNodeDropdown(false, key)
  }

  private isRootNode(key: string): boolean {
    return this.treeData[0].key === key
  }

  // 当前操作节点
  operationNode: OperationTreeNode | null = null

  // 添加节点逻辑:
  // 1. 合并树，无法合并（添加子节点的清空，不存在下拉树提供合并树信息）则只在目标节点添加
  // 2. 选择当前操作节点，并展开
  divisionVisible = false
  onDivision(): void {
    this.divisionVisible = true
    this.operationNode = null
  }
  onDivisionSuccess(
    treeData: OperationTreeNode[] | null,
    node: OperationTreeNode
  ): void {
    if (treeData !== null) {
      this.mergeTree(treeData)
    }

    this.mountNode(node)
    this.normalizeTreeNode()
    this.selectNode(node)
  }

  // 移动节点逻辑:
  // 1. 删除原有节点
  // 2. 合并树
  // 3. 将原有节点移植到目标节点
  // 4. 选择当前操作节点，并展开
  moveVisible = false
  moveExcludeNode(node: OperationTreeNode): boolean {
    return !!this.operationNode && node.key === this.operationNode.key
  }
  onMoveSuccess(treeData: OperationTreeNode[], node: OperationTreeNode) {
    this.removeNode(node)
    this.mergeTree(treeData)
    this.mountNode(node)
    this.normalizeTreeNode()
    this.selectNode(node)
  }

  // 删除节点逻辑:
  // 1. 删掉节点
  // 2. 选中根节点
  private handleDeleteTreeNode(node: OperationTreeNode): void {
    this.removeNode(node)
    this.selectNode(this.treeData[0])
  }

  // Modify Name
  nameVisible = false
  onNameSuccess(node: OperationTreeNode): void {
    this.renameNode(node)
  }

  private mergeTree(treeData: OperationTreeNode[]) {
    this.treeData = mergeTree(this.treeData, treeData)
  }

  private removeNode(node: OperationTreeNode): void {
    removeTreeNode<OperationTreeNode>(this.treeData, node.key)
    this.cleanNode(node)
  }

  private renameNode(node: OperationTreeNode): void {
    const targetNode = getTreeNode<OperationTreeNode>(this.treeData, node.key)

    if (!targetNode) {
      console.error('[OperationTree - renameNode] 未找到指定节点', node)
      return
    }

    targetNode.title = node.title
    this.$forceUpdate()
  }

  private mountNode(node: OperationTreeNode): void {
    const parentNode = getTreeNode<OperationTreeNode>(
      this.treeData,
      node.parentId,
      'id'
    )

    if (!parentNode) {
      console.error('[OperationTree - mountNode] 未找到父节点', node)
      return
    }

    // 触发重新加载父节点
    parentNode.isLeaf = false
    this.cleanNode(parentNode)
  }

  // 清理节点数据
  // 1. 将所有key清理
  // 2. 去除children，根据自有isLeaf来驱动是否重新加载数据
  private cleanNode(node: OperationTreeNode): void {
    walkTreeNode<OperationTreeNode>([node], node => {
      const loadedKeyIdx = this.loadedKeys.findIndex(key => node.key === key)
      if (loadedKeyIdx > -1) {
        this.loadedKeys.splice(loadedKeyIdx, 1)
      }

      const expandedKeyIdx = this.expandedKeys.findIndex(
        key => node.key === key
      )
      if (expandedKeyIdx > -1) {
        this.expandedKeys.splice(expandedKeyIdx, 1)
      }

      if (this.selectedKeys[0] === node.key) {
        this.selectedKeys = []
      }
    })

    delete node.children
  }

  private selectNode(node: OperationTreeNode): void {
    const parentNode =
      getTreeNode<OperationTreeNode>(this.treeData, node.parentId, 'id') || node

    this.selectedKeys = [node.key]
    this.expandedKeys = [...new Set(this.expandedKeys.concat(parentNode.key))]
    this.autoExpandParent = true
  }

  searchKeyword = ''
  confirmedSearchKeyword = ''
  onSearch(): void {
    this.confirmedSearchKeyword = this.searchKeyword
  }

  @Watch('searchKeyword')
  searchKeywordChanged(val: string): void {
    if (val === '') {
      this.$emit('select', this.selectedKeys[0])
    }
  }

  onSelectResult(item: OperationTreeSearchResultItem): void {
    this.$emit('select', item.key)
  }

  // 支持外部同步并选择节点
  // OPTIMIZE: hack
  mergeTreeAndSelectNode(treeData: OperationTreeNode[], key: string) {
    this.mergeTree(treeData)

    const node = getTreeNode<OperationTreeNode>(this.treeData, key)
    if (node) {
      this.selectNode(node)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~style/helper';

.operation-tree {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  width: 100%;

  .tree-header {
    display: flex;
    height: 32px;

    &-add {
      flex_both_middle();
      margin-right: 16px;
      padding: 8px 0;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      background: $deepblue;
      color: $white;
      text-align: center;
      font-size: 16px;
      line-height: 32px;
      cursor: pointer;

      >>>.icon {
        top: 0;
        margin-left: 0;
      }
    }
  }

  .tree-body {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 12px;

    >>>.ant-tree-node-content-wrapper {
      ellipsis();
      position: relative;
      padding-right: 36px;
      padding-left: 0;
      width: 100%;

      .tree-dropdown {
        position: absolute;
        top: 0;
        right: 26px;
        display: none;
        color: rgba($black, 0.75);
      }

      &:not(.ant-tree-node-selected):hover {
        background-color: $transparentblue;
      }

      &.ant-tree-node-selected, &:hover {
        .tree-dropdown {
          display: inline-block;
        }
      }
    }

    >>>.tree-dropdown-node {
      > .ant-tree-node-content-wrapper:not(.ant-tree-node-selected) {
        background-color: $transparentblue;
      }

      > .ant-tree-node-content-wrapper {
        .tree-dropdown {
          display: inline-block;
        }
      }
    }
  }
}
</style>
