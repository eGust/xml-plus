<template lang="pug">
  #app
    header
      .title {{ url }}
    hr
    .xml-root
      XmlElement(:element="rootElement" :path="rootPath" :key="rootPath")
    p
      br
    template(v-if='isDev')
      hr
      pre.raw {{ raw }}
</template>

<script>
import { XmlElement } from './components';

export default {
  name: 'app',

  components: { XmlElement },

  created() {
    this.isDev = this.$isDev;
  },

  data: () => ({
    url: window.location.href,
    isDev: false,
  }),

  computed: {
    rootElement() {
      return this.$xml.doc.children[0];
    },
    rootPath() {
      const el = this.rootElement;
      return el ? `XML.${el.tagName}` : 'XML';
    },
    raw() {
      return this.$xml.raw;
    },
  },
};
</script>

<style lang="stylus">
body
  margin 0
  padding 0
  font-family 'Avenir', Helvetica, Arial, sans-serif
  background-color cornsilk
#app
  display block
  position relative
  min-height 100vh
.title
  padding 6px 12px
.xml-root
  padding 10px 20px
  position relative
pre.raw
  display inline-block
  margin 5px
  padding 15px
  background-color white
</style>
