<template>
  <yk-status-container
    :status="status"
    class="yk-operation-tree-search-result"
    emptySize="small"
  >
    <div
      :class="{
        selected: !!selectedItem && selectedItem.id === item.id,
      }"
      :key="item.id"
      @click="onSelectItem(item)"
      class="result-item"
      v-for="item in list"
    >
      <span class="result-left">{{ item.title }}</span>
      <span class="result-right">{{ item.parentTitle }}</span>
    </div>
  </yk-status-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import YkStatusContainer, {
  ContainerStatus,
} from 'components/layout/container/StatusContainer.vue'
import { SearchNode, OperationTreeSearchResultItem } from './OperationTree.vue'

@Component({
  components: {
    YkStatusContainer,
  },
})
export default class OperationTreeSearchResult extends Vue {
  @Prop({ type: Function, required: true })
  searchNode!: SearchNode

  @Prop({ type: String, required: true })
  keyword!: string

  list: OperationTreeSearchResultItem[] = []
  selectedItem: OperationTreeSearchResultItem | null = null
  status: ContainerStatus = ContainerStatus.Loading

  @Watch('keyword', { immediate: true })
  keywordChanged(val: string): void {
    this.status = ContainerStatus.Loading

    this.searchNode(val)
      .then(list => {
        this.list = list
        if (this.list.length > 0) {
          this.status = ContainerStatus.Normal
        } else {
          this.status = ContainerStatus.Empty
        }
      })
      .catch(err => {
        console.log(err)

        this.status = ContainerStatus.Error
      })
  }

  onSelectItem(item: OperationTreeSearchResultItem): void {
    this.selectedItem = item
    this.$emit('select', item)
  }
}
</script>

<style lang="stylus" scoped>
@import '~style/helper'

.yk-operation-tree-search-result
  .result-item
    display flex
    padding 5px
    line-height 22px
    cursor pointer

    &.selected
      .result-left
        color $blue

    &:hover
      background $transparentblue

  .result-left
    flex 1
    color $normalDarkColor

  .result-right
    flex 1
    margin-left 16px
    color $secondaryDarkColor
    text-align right
</style>
