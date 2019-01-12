<template lang="pug">
  #app
    header
      .url {{ url }}
    hr
    xml-main(:root-element="rootElement" :levels="levels")
</template>

<script>
import { mapState } from 'vuex';
import { XmlMain } from '../ui/containers';

export default {
  name: 'app',

  components: { XmlMain },

  mounted() {
    this.$nextTick(() => {
      console.timeEnd('init');
      const loading = document.getElementById('loading-cloak');
      if (loading) loading.parentNode.removeChild(loading);
    });
  },

  computed: {
    ...mapState(['url']),

    rootElement() {
      return this.$xml.root;
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
  color white
  width 100vw
  height 100vh
  header
    display inline-flex
    align-items center
    height 36px
    background-color #444
    overflow hidden
    font-size 14pt
    font-family Consolas, monospace
    .url
      padding-left 15px
</style>
