## API

### OperationTree

用于分类、部门等树操作

```typescript
interface OperationTreeNode extends Partial<TreeNode> {
  id: number
  key: string
  title: string
  parentId: number | null
  children?: OperationTreeNode[]
}

interface AddForm {
  name: string
  node: OperationTreeNode
}

interface MoveForm<T> {
  origin: T
  target: OperationTreeNode
}
```

| 成员                | 说明                       | 类型                                              | 默认值 | 可选值 |
| ------------------- | -------------------------- | ------------------------------------------------- | ------ | ------ |
| objectTitle         | 操作对象名                 | string                                            |        | 必填   |
| loadTreeData        | 加载树节点（一层一层加载） | `( id?: number ) => Promise<OperationTreeNode[]>` |        | 必填   |
| addNode             | 添加节点                   | `(data: AddForm) => Promise<OperationTreeNode>`   |        | 必填   |
| moveNode            | 移动节点                   | `(data: MoveForm<T>) => Promise<T>`               |        | 必填   |
| deleteNode          | 删除节点                   | `(node: OperationTreeNode) => Promise<void>`      |        | 必填   |
| updateNodeName      | 更新节点名                 | `(node: OperationTreeNode) => Promise<void>`      |        | 必填   |
| allowUpdateRootName | 是否允许修改根节点名称     | boolean                                           | false  |        |

| 事件   | 说明             | 参数类型 | 可选值 |
| ------ | ---------------- | -------- | ------ |
| select | 选中节点对应 key | string   |        |
