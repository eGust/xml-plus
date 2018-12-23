<template lang="pug">
  .group-list
    template(v-if="count <= 1")
      slot
    template(v-else)
      .row(v-for="(range, index) in ranges")
        template(v-if="index == activeIndex")
          .active.pointer-cursor(@click="$emit('click', index)")
            minus-square-button.svg-button
            .range - {{ range.low }} : {{ range.high }}
          .items
            slot
            .guideline
        .pointer-cursor(v-else @click="$emit('click', index)")
          add-square-button.svg-button
          .range [{{ range.low }} .. {{ range.high }}]
</template>

<script>
import AddSquareButton from '../../assets/add-square-button.svg';
import MinusSquareButton from '../../assets/minus-square-button.svg';

export default {
  name: 'GroupedList',
  components: { AddSquareButton, MinusSquareButton },
  props: ['totalCount', 'activeIndex', 'groupSize'],

  computed: {
    count() {
      const { totalCount, groupSize } = this;
      return Math.ceil(totalCount / groupSize);
    },

    ranges() {
      const { count, totalCount, groupSize } = this;
      const ranges = new Array(count);

      let low = 0;
      for (let i = 0; i < count; i += 1) {
        const next = low + groupSize;
        ranges[i] = { low, high: next - 1 };
        low = next;
      }
      ranges[count - 1].high = totalCount - 1;
      return ranges;
    },
  },
};
</script>

<style lang="stylus">
.row
  display block
  margin 5px 0
.range
  display inline-block
  color deepskyblue
  user-select none
  vertical-align middle
.active .range
    color darkseagreen
.pointer-cursor
  cursor pointer
.svg-button
  width 14px
  height 14px
  margin-right 8px
  vertical-align middle
.items
  padding-left 1.1em
  position relative
  .guideline
    position absolute
    display block
    top 0.3em
    bottom 0.5em
    left 7px
    width 0.4em
    border-left 1px dotted green
    border-bottom 1px dotted green
</style>
