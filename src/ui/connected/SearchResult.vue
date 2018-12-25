<template lang="pug">
  result-layout(
    :params="params"
    :result="result"
    :pinned="pinned"
    :group-index="groupIndex"
    :group-size="groupSize"
    @click-tag="onClickTag"
    @switch-index="onSwitchGroupIndex"
  )
    result-node(
      v-for="item in nodes"
      :element="item.element"
      :key="item.key"
      @click-node="onSelectNode"
    )
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { ResultLayout } from '../components';
import ResultNode from './ResultNode';
import { MAIN_GROUP_SIZE, SEARCH_RESULT_GROUP_SIZE } from './constants';

export default {
  name: 'SearchResult',
  props: ['search-result', 'pinned'],
  components: { ResultLayout, ResultNode },

  data: () => ({
    groupIndex: null,
  }),

  computed: {
    ...mapState(['statuses']),

    params() {
      const { base, method, query } = this.searchResult;
      return { tag: base.tagName, method, query };
    },

    result() {
      const { error, result } = this.searchResult;
      if (error) {
        const err = error.message;
        const col = err.indexOf(':');
        return {
          error: err.slice(col + 1).trim(),
          text: null,
          nodes: null,
        };
      }

      if (!result) {
        return {
          error: null,
          text: null,
          nodes: null,
        };
      }

      if (result instanceof NodeList || result instanceof Array) {
        return {
          error: null,
          text: `${result.length} Nodes`,
          nodes: result,
        };
      }
      return {
        error: null,
        nodes: null,
        text: result,
      };
    },

    groupSize() {
      return SEARCH_RESULT_GROUP_SIZE;
    },

    nodes() {
      const { groupIndex, result: { nodes } } = this;
      if (!nodes) return [];

      const offset = groupIndex * SEARCH_RESULT_GROUP_SIZE;
      const listSize = Math.min(nodes.length - offset, MAIN_GROUP_SIZE);
      const list = new Array(listSize);

      for (let i = 0; i < listSize; i += 1) {
        const key = offset + i;
        const element = nodes[key];
        list[i] = { key, element };
      }

      return list;
    },
  },

  methods: {
    ...mapActions(['asyncUpdate']),

    onSelectNode(node) {
      const { statuses, $xml: { e2pMap } } = this;

      // make sure all parents are in store
      let el = node;
      do {
        const path = e2pMap.get(el);
        if (!statuses[path]) {
          const status = this.$xml.cached.statuses[path];
          this.asyncUpdate({
            name: 'setElementStatus',
            payload: {
              path,
              status,
            },
          });
        }
        el = el.parentElement;
      } while (el);

      // make sure all parents are open
      for (el = node; ;) {
        const parent = el.parentElement;
        if (!parent) break;

        const path = e2pMap.get(el);
        const payload = {
          path,
          open: true,
          show: true,
        };
        if (parent.childCount > MAIN_GROUP_SIZE) {
          const index = +path.lastIndexOf('/');
          payload.childGroupIndex = Math.floor(index / MAIN_GROUP_SIZE);
        }

        this.asyncUpdate({
          name: 'updateElementStatus',
          payload,
        });
        el = parent;
      }

      // select clicked node
      this.asyncUpdate({
        name: 'updateCurrentElement',
        payload: {
          subject: 'selected',
          path: e2pMap.get(node),
        },
      });
    },

    onClickTag() {
      this.onSelectNode(this.searchResult.base);
    },

    onSwitchGroupIndex(index) {
      this.groupIndex = this.groupIndex === index ? null : index;
    },
  },

};
</script>

<style lang="stylus" scoped>
.search-result
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
.selector
  color darkorange
  &:before
    content ' "'
    color gray
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
