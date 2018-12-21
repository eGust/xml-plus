<template lang="pug">
  XmlElement(
    :tag-name="element.tagName"
    :attributes="attributes"
    :child-count="childCount"
    :open="status.open"
    :show="status.show"
    :highlight="status.highlight"
    :leaf-count="status.leafCount"
    :text="text"
    @toggle="onToggle"
  )
    .children.child-elements(v-if="childCount > 0")
      ElementTree(
        v-for="item in childElements"
        :element="item.element"
        :key="item.key"
      )
</template>

<script>
import { mapState, mapActions } from 'vuex';

import XmlElement from './XmlElement';

export const KEY_NAME = '__::_key_';

const ElementTree = {
  name: 'ElementTree',
  components: { XmlElement },
  props: ['element'],

  computed: {
    ...mapState(['elements']),

    path() {
      return this.element.getAttribute(KEY_NAME);
    },

    status() {
      return this.elements[this.path];
    },

    attributes() {
      const { element: el } = this;
      return el.getAttributeNames()
        .map(name => ({ name, value: el.getAttribute(name) }))
        .filter(({ name }) => name !== KEY_NAME);
    },

    text() {
      return this.element.childElementCount === 0 ? this.element.innerHTML.trim() : null;
    },

    childElements() {
      const { element: el } = this;
      return Array.from(el.children).map(element => ({
        element,
        key: element.getAttribute(KEY_NAME),
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
