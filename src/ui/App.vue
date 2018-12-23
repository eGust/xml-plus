<template lang="pug">
  #app
    main
      header {{ url }}
      hr
      section#xml-root
        element-tree(:element="rootElement" :path="rootPath" :key="rootPath")
      footer
        summary-bar(:levels="levels")
    aside
      search-panel
</template>

<script>
import { mapState } from 'vuex';
import { ElementTree, SearchPanel } from './connected';
import { SummaryBar } from './components';

export default {
  name: 'app',

  components: { ElementTree, SearchPanel, SummaryBar },

  mounted() {
    this.$nextTick(() => {
      console.timeEnd('init');
      const loading = document.getElementById('loading-cloak');
      if (loading) loading.parentNode.removeChild(loading);
    });
  },

  data: () => ({
    url: window.location.href,
  }),

  computed: {
    ...mapState(['current']),

    rootElement() {
      return this.$xml.root;
    },

    rootPath() {
      const el = this.rootElement;
      return el ? el.tagName : 'XML';
    },

    levels() {
      return this.$xml.levels;
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
  font-family Helvetica, Arial, sans-serif
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
  color white
  width 100vw
  height 100vh
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
