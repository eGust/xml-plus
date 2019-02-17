<template lang="pug">
  xml-element(
    :tag-name="element.tagName"
    :attributes="attributes"
    :child-count="childCount"
    :text="text"
    :status="status"
    :path="path"
    @toggle="onToggle"
    @select="onSelect"
    @copy="onCopy"
    @hover-start="onHoverStart"
    @hover-end="onHoverEnd"
  )
    .children.child-elements(v-if="childCount > 0")
      grouped-list(
        :total-count="childCount"
        :group-size="groupSize"
        :active-index="status.childGroupIndex"
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
import { MAIN_GROUP_SIZE } from './constants';

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

    groupSize: () => MAIN_GROUP_SIZE,

    childElements() {
      const { element: el, status: { childGroupIndex } } = this;
      const offset = childGroupIndex * MAIN_GROUP_SIZE;
      const listSize = Math.min(this.childCount - offset, MAIN_GROUP_SIZE);
      const list = new Array(listSize);

      for (let i = 0; i < listSize; i += 1) {
        const element = el.children[offset + i];
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
          childGroupIndex: this.status.childGroupIndex === index ? null : index,
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

    onCopy() {
      const el = document.createElement('textarea');
      el.value = this.element.outerHTML;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
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
