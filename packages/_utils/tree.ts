import Vue from 'vue'
import _ from 'lodash'
import { TreeNode } from 'ant-design-vue/types/tree-node'

interface NestedTreeNode {
  key: string
  children?: NestedTreeNode[]
}

interface TreeNodeProps extends Partial<TreeNode> {
  expanded: boolean
}

export type LoadTreeData<T extends Partial<TreeNode>> = (
  node?: T
) => Promise<T[]>

export function getIcon(
  nodeIcon: string,
  leafIcon: string,
  nodeExpandedIcon?: string
) {
  return function(props: TreeNodeProps, h: any) {
    const type = props.isLeaf
      ? leafIcon
      : props.expanded
      ? nodeExpandedIcon || nodeIcon
      : nodeIcon

    if (type) {
      return h('a-icon', {
        attrs: {
          type,
        },
      })
    }
  }
}

export function getLoadData<T extends Partial<TreeNode>>(
  tree: any,
  loadKeyData: LoadTreeData<T>
) {
  return function(treeNode: any): Promise<void> {
    if (treeNode.dataRef.children) {
      return Promise.resolve()
    }

    return loadKeyData(treeNode.dataRef).then(treeNodes => {
      treeNode.dataRef.children = treeNodes
      tree.treeData = [...tree.treeData]
    })
  }
}

export function getTreeNode<T extends NestedTreeNode>(
  nodes: T[],
  keyValue: T[keyof T],
  key: keyof T = 'key'
): T | null {
  for (let node of nodes) {
    if (node[key] === keyValue) {
      return node
    }

    if (node.children) {
      const result = getTreeNode<T>(node.children as T[], keyValue, key)

      if (result) {
        return result
      }
    }
  }

  return null
}

export function walkTreeNode<T extends NestedTreeNode>(
  nodes: T[],
  callback: (node: T) => void
) {
  for (let node of nodes) {
    callback(node)

    if (node.children) {
      walkTreeNode(node.children as T[], callback)
    }
  }
}

export function removeTreeNode<T extends NestedTreeNode>(
  nodes: T[],
  key: string
): boolean {
  for (let [index, node] of nodes.entries()) {
    if (node.key === key) {
      nodes.splice(index, 1)
      return true
    }

    if (node.children) {
      const result = removeTreeNode<T>(node.children as T[], key)
      if (result) {
        return true
      }
    }
  }

  return false
}

export function mapTreeNode<T extends NestedTreeNode, K extends NestedTreeNode>(
  nodes: T[],
  callback: (node: T) => K
): K[] {
  const cloneNodes: K[] = []
  for (let [index, node] of nodes.entries()) {
    const mainNode = callback(node)

    if (node.children) {
      mainNode.children = mapTreeNode(node.children as T[], callback)
    }

    cloneNodes[index] = mainNode
  }

  return cloneNodes
}

export function mergeTree<T extends NestedTreeNode>(
  target: T[],
  origin: T[]
): T[] {
  return _.merge(target, origin)
}
