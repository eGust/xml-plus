<template lang="pug">
  #xml-main
    main
      section#xml-root
        element-tree(:element="rootElement" :path="rootPath" :key="rootPath")
      footer
        summary-bar(:levels="levels")
    aside
      search-panel
</template>

<script>
import { SummaryBar } from '../components';
import ElementTree from './ElementTree';
import SearchPanel from './SearchPanel';

export default {
  name: 'xml-main',
  props: ['root-element', 'levels'],
  components: { ElementTree, SearchPanel, SummaryBar },

  computed: {
    rootPath() {
      const el = this.rootElement;
      return el ? el.tagName : 'XML';
    },
  },
};
</script>

<style lang="stylus">
#xml-main
  display flex
  flex-direction row
  position relative
  color white
  width 100vw
  height calc(100vh - 36px)
main
  flex 5
  display flex
  flex-direction column
  max-width 1100px
  background-color #222
  & > *
    position relative
  #xml-root
    flex 1
    padding 8px 20px
    overflow-y auto
  header
    font-size 14pt
    padding 12px 20px
  footer
    height 30px
aside
  flex 3
  min-width 300px
  position relative
</style>
