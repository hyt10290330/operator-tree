<i18n>
{
  "zh": {
    "inputHit": "请输入"
  },
  "en": {
    "inputHit": "Please enter"
  }
}
</i18n>

<template>
  <div class="search-input">
    <a-input
      :placeholder="placeholder ? placeholder : $t('inputHit')"
      @change="onSearchData"
      v-model="content"
    >
      <a-icon slot="prefix" type="search" />
      <a-icon @click="onClear" slot="suffix" type="close-circle" v-if="content" />
    </a-input>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from 'vue-property-decorator'
import { debounce } from 'throttle-debounce'
import { placeholder } from '@babel/types'

@Component
export default class SearchInput extends Vue {
  @Model('change', { type: String, default: '' })
  keyword!: string

  @Prop({ type: String, default: '' })
  placeholder!: string

  content: string = ''

  @Watch('keyword', { immediate: true })
  keywordChanged(value: string) {
    this.content = value
  }

  private _searchDataDebounce: any = null

  onClear(): void {
    this.content = ''
    this.$emit('change', this.content)
    this.$emit('search', this.content)

    if (this._searchDataDebounce) {
      this._searchDataDebounce.cancel()
      this._searchDataDebounce = null
    }
  }

  onSearchData(): void {
    this.$emit('change', this.content)

    if (!this._searchDataDebounce) {
      this._searchDataDebounce = debounce(300, () => {
        this.$emit('search', this.content)
      })
    }
    this._searchDataDebounce()
  }
}
</script>

<style lang="stylus" scoped>
@import '~style/helper';

.search-input {
  >>>.anticon-close-circle {
    cursor: pointer;
  }
}
</style>

