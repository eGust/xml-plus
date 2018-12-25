<template lang="pug">
  .result-layout
    .params(:class="{ invalid: !result.text }")
      | <
      .node(:class="{ selected: selected }" @click="$emit('click-tag')") {{ params.tag }}
      | >.
      .method {{ params.method }}
      .selector {{ params.query }}
    .result
      .error(v-if="!!result.error") {{ result.error }}
      .blank(v-else-if="!result.text") (blank)
      .value(v-else-if="!result.nodes") {{ result.text }}
      template(v-else)
        grouped-list(
          :total-count="result.nodes.length"
          :group-size="groupSize"
          :active-index="groupIndex"
          @click="$emit('switch-index', $event)"
          )
          slot
</template>

<script>
import GroupedList from './GroupedList';

export default {
  name: 'ResultLayout',
  components: { GroupedList },
  props: ['params', 'result', 'pinned', 'selected', 'group-index', 'group-size'],
};
</script>

<style lang="stylus" scoped>
.result-layout
  padding 8px 9px 0 12px
  line-height 1.2em
  overflow auto
  color #CCC
  font-family Consolas, monospace
  &:not(:first-child)
    margin-top 8px
    border-top 0.5px dashed #444

.params
  text-overflow ellipsis
  color #CCC
  display flex
  .method
    color green
  &.invalid .method
    color darkred
.node
  cursor pointer
  color dodgerblue
  &.selected
    color lime
.selector
  color darkorange
  &:before
    content '"'
    color gray
    padding-left 5px
  &:after
    content '"'
    color gray

.blank
  color #444
.error
  color red
.value
  color yellowgreen
  cursor pointer
</style>
