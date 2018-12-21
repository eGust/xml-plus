<template lang="pug">
  .xml-element(v-show="show")
    .open(:class="{ clickable: isTogglable }")
      template(v-if="isTogglable")
        .toggle.unselectable(@click="onToggleOpen" :class="toggleClass")  &nbsp;
        | <
      template(v-else)
        .dash.unselectable -&nbsp;
        | <
      .tag-name(@click="onToggleOpen") {{ tagName }}
      template(v-if="open")
        .attribute(v-for="attr in attributes")
          | &nbsp;
          .name {{ attr.name }}
          | ="
          .value {{ attr.value }}
          | "
      template(v-else-if="hasAttributes")
        |  ...
      | {{ isTogglable ? '>' : ' />' }}
      template(v-if="!open")
        .elements(v-if="childrenCount > 0")  [{{ childrenCount }} elements...]
        .text(v-else)  ...
        .unselectable {{ ' ' }}
        | </
        .tag-name {{ tagName }}
        | >

    .children-wrap(v-show="open")
      slot
    .guide-line(v-show="open && isTogglable")
</template>

<script>
const DO_NOTHING = () => {};

const XmlElement = {
  name: 'XmlElement',
  props: ['tagName', 'attributes', 'childrenCount', 'isTogglable', 'open', 'show', 'highlight'],

  data: () => ({
  }),

  computed: {
    hasAttributes() {
      return this.attributes.length > 0;
    },

    toggleClass() {
      return this.open ? 'open-graph' : 'closed-graph';
    },
  },

  methods: {
    onToggleOpen() {
      return this.isTogglable ? this.$emit('toggle') : DO_NOTHING;
    },
  },
};

XmlElement.components = { XmlElement };
export default XmlElement;
</script>

<style lang="stylus">
.xml-element
  position relative
  display block
  font-family Consolas, monospace
  font-size 12pt
  white-space pre-wrap
.attribute
  display inline
.open, .close
  position relative
  *
    display inline
  .tag-name
    color dodgerblue
    line-height 1.3em
.clickable
  .tag-name, .toggle
    cursor pointer
.attribute
  color orangered
  .name
    color plum
  .value
    color sandybrown
.toggle
  display inline-block
  position relative
  color gold
  vertical-align top
  &:before
    content ''
    position absolute
    width 0
    height 0
.dash
  color lightyellow
.unselectable
  user-select: none;

.open-graph:before
  border-left 6px solid transparent
  border-right 6px solid transparent
  border-top 6px solid
  top calc(0.5em)
.closed-graph:before
  border-left 6px solid
  border-top 6px solid transparent
  border-bottom 6px solid transparent
  top calc(0.5em - 3px)
  left calc(0.5em - 4px)

.xml-element
  & > .guide-line
    position absolute
    top 1.2em
    left 5px
    bottom 0.5em
    width 0.4em
    background-color transparent
    border-left 0.6px dashed lemonchiffon
    border-bottom 0.6px dashed lemonchiffon
  &:hover > .guide-line
    border-left 0.6px solid pink
    border-bottom 0.6px solid pink
</style>
