<i18n>
{
  "zh": {
    "loadingTip": "正在加载中，请稍候...",
    "emptyTip": "当前条件下无内容",
    "errorTip": "加载遇到了问题，请点击重试"
  },
  "en": {
    "loadingTip": "Loading...",
    "emptyTip": "No content under current conditions",
    "errorTip": "Loading encountered a problem, please click and retry"
  }
}
</i18n>

<template>
  <div class="status-container">
    <slot
      name="empty"
      v-if="empty"
    >
      <div
        :class="emptySizeClass"
        class="status-container-empty"
      >
        <img :src="blankImg" />
        <div>{{ $t('emptyTip') }}</div>
      </div>
    </slot>
    <slot
      name="loading"
      v-if="loading"
    >
      <div class="status-container-loading">
        <a-spin
          :spinning="true"
          :tip="$t('loadingTip')"
        />
      </div>
    </slot>
    <slot v-if="normal || loading"></slot>
    <slot
      name="error"
      v-if="error"
    >
      <div class="status-container-error">
        <a
          @click="onReload"
          href="javascript:;"
        >
          <a-icon type="reload" />
          {{ $t('errorTip') }}
        </a>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

import blankImg from './img/blank.png'

export enum ContainerStatus {
  Loading = 'loading',
  Normal = 'normal',
  Empty = 'empty',
  Error = 'error',
}

export enum ContainerEmptySize {
  Normal = 'normal',
  Small = 'small',
}

@Component
export default class StatusContainer extends Vue {
  @Prop({ type: String, default: ContainerStatus.Normal })
  status!: ContainerStatus

  @Prop({ type: String, default: ContainerEmptySize.Normal })
  emptySize!: ContainerEmptySize

  blankImg = blankImg

  get emptySizeClass(): string {
    return `size-${this.emptySize}`
  }

  get loading(): boolean {
    return this.status === ContainerStatus.Loading
  }

  get empty(): boolean {
    return this.status === ContainerStatus.Empty
  }

  get normal(): boolean {
    return this.status === ContainerStatus.Normal
  }

  get error(): boolean {
    return this.status === ContainerStatus.Error
  }

  onReload(): void {
    this.$emit('reload')
  }
}
</script>

<style lang="stylus" scoped>
@import '~style/helper'

.status-container
  position relative
  min-height 200px
  width 100%

  .status-container-loading
    absolute_position(0,0)
    z-index 99
    width 100%
    height 100%
    background rgba($white,.8)

    >>>.ant-spin
      absolute_both_middle()

    >>>.ant-spin-dot
      vertical-align middle

    >>>.ant-spin-text
      display inline-block
      margin-left 10px

  .status-container-empty, .status-container-error
    padding 100px 0
    color rgba($black,.45)
    text-align center

  .status-container-empty
    &.size-small
      padding 80px 0

      img
        width 80px
        height 80px

  .status-container-error
    color $normalDarkColor
    text-decoration none
    font-size 16px

    >>>.anticon
      vertical-align middle
      font-size 28px
</style>
