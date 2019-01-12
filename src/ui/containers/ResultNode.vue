<template lang="pug">
  xml-element(
    :tag-name="element.tagName"
    :attributes="attributes"
    :child-count="0"
    :text="text"
    :status="status"
    toggle="disabled"
    @select="$emit('click-node', element)"
  )
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { XmlElement } from '../components';

export default {
  name: 'ResultNode',
  components: { XmlElement },
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
      return { ...this.statuses[this.path], open: false };
    },

    attributes() {
      const { element: el } = this;
      return el.getAttributeNames().map(name => ({ name, value: el.getAttribute(name) }));
    },
    text() {
      const { element: el } = this;
      return el.childElementCount === 0 ? el.innerHTML.trim() : null;
    },
  },

  methods: {
    ...mapActions(['asyncUpdate']),
  },
};
</script>

<style lang="stylus">
.result-content .xml-element .tag-name
  cursor pointer
</style>
