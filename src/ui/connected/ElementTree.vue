<template lang="pug">
  xml-element(
    :tag-name="element.tagName"
    :attributes="attributes"
    :child-count="childCount"
    :text="text"
    :status="status"
    @toggle="onToggle"
    @select="onSelect"
    @hoverStart="onHoverStart"
    @hoverEnd="onHoverEnd"
  )
    .children.child-elements(v-if="childCount > 0")
      grouped-list(
        :total-count="childCount"
        :group-size="groupSize"
        :active-index="status.childListOffset"
        @click="onSwitchList"
        )
        element-tree(
          v-for="item in childElements"
          :element="item.element"
          :key="item.key"
        )
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { XmlElement, GroupedList } from '../components';

const GROUP_SIZE = 50;
const ElementTree = {
  name: 'ElementTree',
  components: { XmlElement, GroupedList },
  props: ['element'],

  created() {
    const path = this.$xml.e2pMap.get(this.element);
    if (this.statuses[path]) return;

    const status = this.$xml.cached.statuses[path];
    this.asyncUpdate({
      name: 'setElementStatus',
      payload: {
        path,
        status,
      },
    });
  },

  computed: {
    ...mapState(['statuses']),

    path() {
      return this.$xml.e2pMap.get(this.element);
    },
    status() {
      return this.statuses[this.path];
    },

    attributes() {
      const { element: el } = this;
      return el.getAttributeNames().map(name => ({ name, value: el.getAttribute(name) }));
    },
    text() {
      return this.childCount === 0 ? this.element.innerHTML.trim() : null;
    },

    groupSize: () => GROUP_SIZE,

    childElements() {
      const { element: el, status: { childListOffset } } = this;
      const listSize = Math.min(this.childCount - childListOffset, GROUP_SIZE);
      const list = new Array(listSize);

      for (let i = 0; i < listSize; i += 1) {
        const element = el.children[childListOffset + i];
        list[i] = {
          element,
          key: this.$xml.e2pMap.get(element),
        };
      }
      return list;
    },

    childCount() {
      return this.element.childElementCount;
    },
  },

  methods: {
    ...mapActions(['asyncUpdate']),

    onToggle() {
      this.asyncUpdate({
        name: 'updateElementStatus',
        payload: {
          path: this.path,
          open: !this.status.open,
        },
      });
    },

    onSwitchList(index) {
      this.asyncUpdate({
        name: 'updateElementStatus',
        payload: {
          path: this.path,
          childListOffset: this.status.childListOffset === index ? null : index,
        },
      });
    },

    onSelect() {
      this.asyncUpdate({
        name: 'updateCurrentElement',
        payload: {
          subject: 'selected',
          path: this.status.selected ? null : this.path,
        },
      });
    },

    onHoverStart() {
      if (this.status.hovering) return;

      this.asyncUpdate({
        name: 'updateCurrentElement',
        payload: {
          subject: 'hovering',
          path: this.path,
        },
      });
    },
    onHoverEnd() {
      if (!this.status.hovering) return;

      this.asyncUpdate({
        name: 'updateCurrentElement',
        payload: {
          subject: 'hovering',
          path: null,
        },
      });
    },
  },
};

ElementTree.components.ElementTree = ElementTree;

export default ElementTree;
</script>

<style lang="stylus">
.children
  margin 3px 2.2em
  position relative
</style>
