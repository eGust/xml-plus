<template lang="pug">
  .group-list
    template(v-if="count <= 1")
      slot
    template(v-else)
      .row(v-for="(range, index) in ranges")
        template(v-if="index == activeIndex")
          .active.pointer-cursor(@click="$emit('click', index)")
            .range - {{ range.low }} : {{ range.high }}
          .items
            slot
            .guide-line
        .pointer-cursor(v-else @click="$emit('click', index)")
          .range [{{ range.low }} .. {{ range.high }}]
</template>

<script>
export default {
  name: 'GroupedList',
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
  color #CCC
  user-select none
  vertical-align middle
.active .range
    color green
.pointer-cursor
  cursor pointer
.items
  padding-left 1.1em
  position relative
  .guide-line
    position absolute
    display block
    top 0.3em
    bottom 0.5em
    left 0.3em
    width 0.4em
    border-left 1px dotted green
    border-bottom 1px dotted green
</style>
