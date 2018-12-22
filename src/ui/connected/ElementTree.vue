<template lang="pug">
  xml-element(
    :tag-name="element.tagName"
    :attributes="attributes"
    :child-count="childCount"
    :open="status.open"
    :show="status.show"
    :highlight="status.highlight"
    :leaf-count="status.leafCount"
    :text="text"
    :selected="path == selected"
    @toggle="onToggle"
    @select="onSelect"
  )
    .children.child-elements(v-if="childCount > 0")
      element-tree(
        v-for="item in childElements"
        :element="item.element"
        :key="item.key"
      )
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { XmlElement } from '../components';

const ElementTree = {
  name: 'ElementTree',
  components: { XmlElement },
  props: ['element'],

  computed: {
    ...mapState(['elements', 'selected']),

    path() {
      return this.$xml.e2pMap.get(this.element);
    },

    status() {
      return this.elements[this.path];
    },

    attributes() {
      const { element: el } = this;
      return el.getAttributeNames().map(name => ({ name, value: el.getAttribute(name) }));
    },

    text() {
      return this.element.childElementCount === 0 ? this.element.innerHTML.trim() : null;
    },

    childElements() {
      const { element: el } = this;
      return Array.from(el.children).map(element => ({
        element,
        key: this.$xml.e2pMap.get(element),
      }));
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

    onSelect() {
      this.asyncUpdate({
        name: 'selectElement',
        payload: {
          path: this.selected === this.path ? null : this.path,
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
  padding-left 2.2em
  position relative
</style>
