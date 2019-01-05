<template lang="pug">
  #search-form
    .row
      .switch
        .option(:class="{active: method == 'Text'}" @click="changeMethod('Text')") Text
        .option(:class="{active: method == 'jQuery'}" @click="changeMethod('jQuery')") jQuery
        .option(:class="{active: method == 'XPath'}" @click="changeMethod('XPath')") XPath
        .option(:class="{active: method == 'CSS'}" @click="changeMethod('CSS')") CSS
        .option(:class="{active: method == 'RegExpr'}" @click="changeMethod('RegExpr')") RegEx
      label.warning
        .bold {{ caseType }}
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
    placeholder() {
      return `Search: ${this.method} Selector`;
    },
    caseType() {
      return this.method === 'RegExpr' ? 'CASE-INSENSITIVE' : 'CASE-SENSITIVE';
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
  flex-direction column
  input
    flex 1
    font-family Consolas, monospace
    font-size 12pt
    height 30px
    padding 2px 8px
    color white
    background-color #222
    border 1px solid lightskyblue
    &:focus
      background-color black
      border-color white
      border-width 2px

.row
  display flex
  align-items center
  justify-content space-between

.warning
  padding 5px
  font-size 11pt
  & > *
    display inline
  .bold
    color orangered
    font-weight bold
    font-size 105%

.switch
  margin 0 5px
  border 2px solid dodgerblue
  border-radius 5px
  display inline-flex
  align-items center
  overflow hidden
  background-color #222
  color gray
  .option
    cursor pointer
    width 80px
    text-align center
    padding 6px
    &:not(:first-child)
      border-left 1px solid dodgerblue
  .option.active
    color white
    font-weight bold
    background-color dodgerblue
  .option:hover
    color yellow

input, button
  -webkit-appearance none
  outline none
</style>
