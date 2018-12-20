<template lang="pug">
  XmlElement(
    :tag-name="element.tagName"
    :attributes="attributes"
    :children-count="childrenCount"
    :is-togglable="hasChildren || hasText"
    :open="status.open"
    :show="status.show"
    :highlight="status.highlight"
    @toggle="onToggle"
  )
    .children.child-elements(v-if="hasChildren")
      ElementTree(
        v-for="item in childElements"
        :element="item.element"
        :key="item.key"
      )
    .children.text-child(v-else-if="hasText") {{ text }}
    .close(v-if="hasChildren || hasText")
      .unselectable  &nbsp;
      | </
      .tag-name {{ element.tagName }}
      | >
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
      return this.element.innerHTML.trim();
    },

    childElements() {
      const { element: el } = this;
      return Array.from(el.children).map(element => ({
        element,
        key: element.getAttribute(KEY_NAME),
      }));
    },

    childrenCount() {
      return this.element.childElementCount > 0;
    },
    hasChildren() {
      return this.childrenCount > 0;
    },
    hasText() {
      return this.text.length > 0;
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
.text-child
  color beige
</style>
