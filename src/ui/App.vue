<template lang="pug">
  #app
    header
      .title {{ url }}
    hr
    .xml-root
      XmlElement(:element="rootElement" :path="rootPath" :key="rootPath")
    p
      br
</template>

<script>
import { XmlElement } from './components';

export default {
  name: 'app',

  components: { XmlElement },

  data: () => ({
    url: window.location.href,
  }),

  computed: {
    rootElement() {
      return this.$xml;
    },
    rootPath() {
      const el = this.rootElement;
      return el ? `XML.${el.tagName}` : 'XML';
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
