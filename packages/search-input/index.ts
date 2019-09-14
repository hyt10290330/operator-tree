import SearchInput from './src/search-input.vue'
import Vue from 'vue'
;(SearchInput as any).install = (vue: Vue) => {
  Vue.component(SearchInput.name, SearchInput)
}

export default SearchInput
