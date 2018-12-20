<template lang="pug">
  #app
    header
      .title {{ url }}
    hr
    .xml-root
      ElementTree(:element="rootElement" :path="rootPath" :key="rootPath")
    SearchPanel
</template>

<script>
import { ElementTree, SearchPanel } from './components';

export default {
  name: 'app',

  components: { ElementTree, SearchPanel },

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
#app
  display block
  position relative
.title
  font-size 14pt
  margin 0.8em 1em
.xml-root
  padding 10px 20px
  position relative
</style>
