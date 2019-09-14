import SearchInput from './src/search-input.vue'
import Vue from 'vue'
// eslint-disable-next-line
;(SearchInput as any).install = (vue: Vue) => {
  Vue.component(SearchInput.name, SearchInput)
}

export default SearchInput
