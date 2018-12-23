<template lang="pug">
  #search-panel
    label.warning
      .notice *
      |  Both CSS and XPath selectors are
      .bold  CASE-SENSITIVE
      |  for XML
    search-form(
      :method="search.method"
      :selector="search.selector"
      @start-search="onStartSearch"
      @change-method="onChangeMethod"
      @input-selector="onInputSelector"
      )
</template>

<script>
import debounce from 'lodash/debounce';
import { mapState, mapActions } from 'vuex';

import { SearchForm } from '../components';

const searchCalls = {
  CSS: (root, selector) => root.querySelectorAll(selector),
  XPath: (root, selector, preview) => {
    const result = document.evaluate(selector, root);
    switch (result.resultType) {
      case XPathResult.NUMBER_TYPE:
        return result.numberValue;
      case XPathResult.STRING_TYPE:
        return result.stringValue;
      case XPathResult.BOOLEAN_TYPE:
        return result.booleanValue;
      case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE: {
        const nodes = [];
        if (preview) {
          for (let i = 0; i < 10; i += 1) {
            const node = result.iterateNext();
            if (!node) break;
            nodes.push(node);
          }
        } else {
          for (;;) {
            const node = result.iterateNext();
            if (!node) break;
            nodes.push(node);
          }
        }
        return nodes;
      }
      default:
        throw TypeError(`Unsupported ${result.resultType}`);
    }
  },
};

function startSearch({
  xmlElement, method, selector, preview,
}, resolver) {
  console.log(`search: ${xmlElement.tagName}`, { method, selector, preview });
  if (!selector.trim()) {
    resolver({
      result: null,
      error: null,
      preview,
    });
  }

  try {
    const result = searchCalls[method](xmlElement, selector, preview);
    resolver({
      result,
      error: null,
      preview,
    });
  } catch (error) {
    resolver({
      result: null,
      error,
      preview,
    });
  }
}

const autoSearch = debounce(startSearch, 500);

export default {
  name: 'SearchPanel',
  components: { SearchForm },

  computed: {
    ...mapState(['search', 'current']),

    xmlElement() {
      return this.$xml.p2eMap.get(this.current.selected) || this.$xml.root;
    },
  },

  methods: {
    ...mapActions(['asyncUpdate']),

    updateSearchResults({ error, result, preview }) {
      console.log({ error, result, preview });
    },

    onStartSearch() {
      const { search, xmlElement } = this;
      startSearch({
        ...search,
        xmlElement,
        preview: false,
      }, (...args) => this.updateSearchResults(...args));
    },

    onAutoSearch() {
      const { search, xmlElement } = this;
      this.$nextTick(() => {
        autoSearch({
          ...search,
          xmlElement,
          preview: true,
        }, (...args) => this.updateSearchResults(...args));
      });
    },

    onChangeMethod(method) {
      this.asyncUpdate({
        name: 'updateSubject',
        payload: {
          subject: 'search',
          data: { method, selector: '' },
        },
      });
      this.onAutoSearch();
    },

    onInputSelector(selector) {
      this.asyncUpdate({
        name: 'updateSubject',
        payload: {
          subject: 'search',
          data: { selector },
        },
      });
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

.warning
  color darkorange
  padding 8px
  & > *
    display inline
  .notice
    color gray
  .bold
    color red
    font-weight bold
</style>
