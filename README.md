# operator-tree

基于 ant-design-vue 对操作树组件

> **Note:** Examples are as follows:

```html
<yk-operation-tree
  :addNode="addNode"
  :deleteNode="deleteNode"
  :loadTreeData="loadTreeData"
  :moveNode="moveNode"
  :searchNode="searchNode"
  :updateNodeName="updateNodeName"
  objectTitle="分类"
></yk-operation-tree>
```

```js
```

## TODO

1.API 接口模拟(express + 本地 data.json + mock.js + vue.config.js 配置接口代理防止跨域冲突)
2.example 引用组件 编写 demog

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

### Component Images

![Image text](https://github.com/hyt10290330/operator-tree/blob/master/images/1.png)
![Image text](https://github.com/hyt10290330/operator-tree/blob/master/images/2.png)
![Image text](https://github.com/hyt10290330/operator-tree/blob/master/images/3.png)
