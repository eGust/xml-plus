<template lang="pug">
  #app
    main
      header {{ url }}
      hr
      section#xml-root
        element-tree(:element="rootElement" :path="rootPath" :key="rootPath")
      footer(v-if="selected")
        detail-panel
    aside
      search-panel
</template>

<script>
import { mapState } from 'vuex';
import { ElementTree, SearchPanel, DetailPanel } from './connected';

export default {
  name: 'app',

  components: { ElementTree, SearchPanel, DetailPanel },

  data: () => ({
    url: window.location.href,
  }),

  computed: {
    ...mapState(['selected']),

    rootElement() {
      return this.$xml.root;
    },

    rootPath() {
      const el = this.rootElement;
      return el ? el.tagName : 'XML';
    },
  },
};
</script>

<style lang="stylus">
*
  box-sizing border-box
body
  margin 0
  padding 0
  font-family 'Avenir', Helvetica, Arial, sans-serif
  color white
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

#webkit-xml-viewer-source-xml
  display none
#app
  display flex
  flex-direction row
  position relative
  width 100vw
  height 100vh
main
  flex 5
  display flex
  flex-direction column
  max-width 1100px
  background-color #222
  header, #xml-root
    position relative
    padding 10px 20px
  #xml-root
    flex 1
    overflow-y auto
  footer
    height 200px
aside
  flex 3
  min-width 300px
  position relative
</style>
