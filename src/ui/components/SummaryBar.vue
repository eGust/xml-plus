<template lang="pug">
  #summary-bar
    .summary Total {{ nodeCount }} nodes; Max Depth: {{ maxDepth }}
</template>

<script>
export default {
  name: 'SummaryBar',
  props: ['levels'],
  computed: {
    maxDepth() {
      return this.levels.length;
    },

    nodeCount() {
      return this.levels.reduce((sum, cnt) => sum + cnt, 0);
    },
  },
};
</script>

<style lang="stylus" scoped>
#summary-bar
  background-color #444
  color white
  height 100%
  display flex
  align-items center
  border-top 1px solid gray
  .summary
    margin-left 12px
    color deeppink
</style>
