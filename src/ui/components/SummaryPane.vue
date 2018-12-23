<template lang="pug">
  #detail-panel
    .summary Total {{ nodeCount }} nodes; Max Depth: {{ maxDepth }}
</template>

<script>
export default {
  name: 'DetailPane',
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
#detail-panel
  background-color #444
  color white
  height 100%
  display flex
  align-items center
  .summary
    margin-left 12px
</style>
