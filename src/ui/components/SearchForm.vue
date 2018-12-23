<template lang="pug">
  #search-form
    .switch
      .option(:class="{active: method == 'CSS'}" @click="changeMethod('CSS')") CSS
      .option(:class="{active: method == 'XPath'}" @click="changeMethod('XPath')") XPath
    input(
      :value="selector"
      :placeholder="placeholder"
      @input="$emit('input-selector', $event.target.value)"
      @keyup.enter="startSearch"
      ref="input"
      )
</template>

<script>
export default {
  name: 'SearchForm',
  props: ['method', 'selector'],
  computed: {
    maxDepth() {
      return this.levels.length;
    },

    nodeCount() {
      return this.levels.reduce((sum, cnt) => sum + cnt, 0);
    },

    placeholder() {
      return `Search: ${this.method} Selector`;
    },
  },

  methods: {
    changeMethod(method) {
      this.$nextTick(() => this.$refs.input.focus());
      if (method === this.method) return;
      this.$emit('change-method', method);
    },

    startSearch() {
      if (!this.selector.trim()) return;
      this.$emit('start-search');
    },
  },
};
</script>

<style lang="stylus" scoped>
#search-form
  display flex
  align-items center
  & > input
    flex 1
    font-family Consolas, monospace
    font-size 12pt
    height 28px
    padding 2px 8px
    color white
    background-color #222
    border 1px solid pink
    &:focus
      background-color black
      border-color deeppink
.switch
  margin 0 5px
  border 2px solid red
  border-radius 5px
  display flex
  align-items center
  overflow hidden
  background-color #222
  .option
    cursor pointer
    padding 6px 12px
  &:not(:hover)
    width 75px
    text-align center
    & > .option.active
      margin 0 auto
    & > .option:not(.active)
      display none
  &:hover
    .option.active
      background-color red
    .option:hover
      color yellow
input, button
  -webkit-appearance none
  outline none
</style>
