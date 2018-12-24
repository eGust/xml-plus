<template lang="pug">
  #search-panel
    .search-result-container
      .result-content
        SearchResult(v-for="sr in pinnedResults" :key="sr.key" :search-result="sr")
        SearchResult(v-for="sr in searchResults" :key="sr.key" :search-result="sr")
    search-form(
      :method="search.method"
      :selector="search.selector"
      @start-search="onStartSearch"
      @change-method="onChangeMethod"
      @input-selector="onInputSelector"
      )
    preview-result(:preview="previewResult" :base="currentBase" @click="onClickPreview")
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { PreviewResult, SearchForm, SearchResult } from '../components';
import { searchSelector, autoSearch } from '../utils';

const HISTORY_LIMIT = 5;

export default {
  name: 'SearchPanel',
  components: { PreviewResult, SearchForm, SearchResult },

  data: () => ({
    search: {
      method: 'CSS',
      selector: '',
    },
    pinnedResults: [],
    searchResults: [],
    previewResult: { error: null, result: null },
  }),

  computed: {
    ...mapState(['current']),

    xmlElement() {
      return this.$xml.p2eMap.get(this.current.selected) || this.$xml.root;
    },

    currentBase() {
      return this.previewResult.base || this.xmlElement;
    },
  },

  methods: {
    ...mapActions(['asyncUpdate']),

    updateSearchResults({ preview, ...searchResult }) {
      if (preview) {
        this.previewResult = searchResult;
      } else {
        this.pushSearchResult(searchResult);
      }
    },

    pushSearchResult(result) {
      console.log('push', result);
      this.previewResult = { error: null, result: null };
      const items = [...this.searchResults, { ...result, pinned: false }];
      this.searchResults = items.slice(items.length - HISTORY_LIMIT);
      this.search.selector = '';
      this.onAutoSearch();
    },

    onStartSearch() {
      const { search, xmlElement } = this;
      searchSelector({
        ...search,
        xmlElement,
      }, (...args) => this.updateSearchResults(...args));
    },

    onAutoSearch() {
      const { search, xmlElement } = this;
      // `autoSearch` is debounced so it will fire much later than $nextTick
      autoSearch({
        ...search,
        xmlElement,
        preview: true,
      }, (...args) => this.updateSearchResults(...args));
    },

    onChangeMethod(method) {
      this.search = { method, selector: '' };
      this.onAutoSearch();
    },

    onInputSelector(selector) {
      this.search.selector = selector;
      this.onAutoSearch();
    },

    onClickPreview() {
      this.pushSearchResult(this.previewResult);
    },
  },

  watch: {
    xmlElement() {
      this.onAutoSearch();
    },
  },
};
</script>

<style lang="stylus" scoped>
#search-panel
  position relative
  padding 10px 20px
  display flex
  flex-direction column
  width 100%
  height 100%
  overflow auto
  background-color black

.search-result-container
  flex 1
  position relative
  display flex
  flex-direction column
  justify-content flex-end
  border 2px solid gray
  border-radius 10px
  padding 10px 0
  margin 5px 0
  font-family Consolas, monospace

.result-content
  white-space pre-wrap
  max-height 100%
  overflow auto
  padding-left 12px
</style>
