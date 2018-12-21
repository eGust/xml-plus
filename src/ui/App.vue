<template lang="pug">
  #app
    header
      .title {{ url }}
    hr
    main
      .xml-root
        element-tree(:element="rootElement" :path="rootPath" :key="rootPath")
      //- summary-panel
    footer
      //- search-panel
</template>

<script>
import { ElementTree, SearchPanel, SummaryPanel } from './components';

export default {
  name: 'app',

  components: { ElementTree, SearchPanel, SummaryPanel },

  data: () => ({
    url: window.location.href,
  }),

  computed: {
    rootElement() {
      return this.$xml;
    },
    rootPath() {
      const el = this.rootElement;
      return el ? el.tagName : 'XML';
    },
  },
};
</script>

<style lang="stylus">
body
  margin 0
  padding 0
  font-family 'Avenir', Helvetica, Arial, sans-serif
  color white
  background-color #222
  *
    margin 0
    padding 0

*::-webkit-scrollbar
  width 8px

*::-webkit-scrollbar-thumb
  background: #888;
  border-radius: 20px;

*::-webkit-scrollbar-track
  background: #444
  border-radius: 20px

#app
  display flex
  flex-direction column
  position relative
  width 100vw
  height 100vh
.title
  font-size 14pt
  margin 0.8em 1em
main
  display flex
  flex-direction row
  flex 1
  & > *
    overflow-y auto
.xml-root
  flex 1
  padding 10px 20px
</style>
