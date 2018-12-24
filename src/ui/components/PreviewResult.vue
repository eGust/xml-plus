<template lang="pug">
  #preview-result
    .base-node(:class="{ invalid: !item }")
      | @{{ base.tagName }}
    .error(v-if="!!preview.error") (Invalid)
    .blank(v-else-if="!preview.result") (blank)
    .result(v-else :class="{ clickable: item.hasValue }" @click="$emit('click')") {{ item.text }}
</template>

<script>
export default {
  name: 'PreviewResult',
  props: ['preview', 'base'],

  computed: {
    isBlank() {
      const { preview } = this;
      return !preview.result;
    },

    isError() {
      const { preview } = this;
      return !!preview.error;
    },

    item() {
      if (this.isError || this.isBlank) return null;

      const { result } = this.preview;
      if (result instanceof NodeList || result instanceof Array) {
        return { hasValue: result.length > 0, text: `${result.length} Nodes` };
      }
      return { hasValue: true, text: result };
    },
  },

};
</script>

<style lang="stylus" scoped>
#preview-result
  margin-top 5px
  padding 4px 10px
  border 1px dotted #444
  background-color #222
  line-height 1.5em
  height calc(3em + 10px)
  overflow auto
  color #CCC
  font-family Consolas, monospace
  & > *
    white-space nowrap
    width 100%
    overflow hidden

.blank
  color #666
.error
  color darkred
.base-node
  text-overflow ellipsis
  color skyblue
  &.invalid
    color gray
.result
  color #CCC
  &.clickable
    color yellowgreen
    cursor pointer
    &:hover
      color greenyellow
      text-decoration-line underline
</style>
