<template lang="pug">
  #search-result
    .base-node(:class="{ invalid: !text }")
      | {{ searchResult.method }}<{{ searchResult.base.tagName }}>({{ searchResult.query }})
    .error(v-if="!!searchResult.error") (Invalid)
    .blank(v-else-if="!searchResult.result") (blank)
    .result(v-else) {{ text }}
</template>

<script>
export default {
  name: 'SearchResult',
  props: ['search-result'],

  computed: {
    isBlank() {
      const { searchResult } = this;
      return !searchResult.result;
    },

    isError() {
      const { searchResult } = this;
      return !!searchResult.error;
    },

    text() {
      if (this.isError || this.isBlank) return null;

      const { result } = this.searchResult;
      if (result instanceof NodeList || result instanceof Array) {
        return `${result.length} Nodes`;
      }
      return result;
    },
  },

};
</script>

<style lang="stylus" scoped>
#search-result
  line-height 1.2em
  overflow auto
  color #CCC
  font-family Consolas, monospace
  & > *
    white-space nowrap
    width 100%
    overflow hidden

.blank
  color #444
.error
  color darkred
.base-node
  text-overflow ellipsis
  color skyblue
  &.invalid
    color gray
a.result
  color yellowgreen
  cursor pointer
</style>
