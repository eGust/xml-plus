<template lang="pug">
  .xml-element(v-if="show")
    .open(:class="{ clickable: isTogglable }")
      template(v-if="isTogglable")
        .toggle.unselectable(@click="onToggleOpen" :class="toggleClass")  &nbsp;
      template(v-else)
        .dash.unselectable -&nbsp;
      .tag(:class="{ selected: selected }")
        | <
        .tag-name(@click="onToggleOpen" @dblclick="onSelected") {{ tagName }}
        template(v-if="open")
          .attribute(v-for="attr in attributes")
            | &nbsp;
            .name {{ attr.name }}
            | ="
            .value {{ attr.value }}
            | "
        template(v-else-if="hasAttribute")
          |  ...
        | {{ hasInlineText || isTogglable ? '>' : ' />' }}

    template(v-if="hasInlineText")
      .inline-text.text-child {{ text }}
      .close.tag(:class="{selected: selected}")
        | </
        .tag-name(@dblclick="onSelected") {{ tagName }}
        | >

    template(v-else-if="open")
      .info.dark(v-if="hasChild")
        |  - {{ childCount }} children, {{ leafCount }} leafs
    template(v-else)
      .info.light-dark.elements(v-if="hasChild")
        |  [{{ childCount }} children, {{ leafCount }} leafs...]&nbsp;
      .info.shorten-text(v-else :title="text")
        | {{ shortenText }}...
      .close.tag(:class="{selected: selected}")
        | </
        .tag-name(@dblclick="onSelected") {{ tagName }}
        | >

    .children-wrap(v-if="open && isTogglable")
      template(v-if="hasChild")
        slot
      .children.text-child(v-else-if="hasIndividualText") {{ text }}
    .close(v-if="open && isTogglable")
      .unselectable  &nbsp;
      .tag(:class="{selected: selected}")
        | </
        .tag-name(@dblclick="onSelected") {{ tagName }}
        | >
    .guide-line(v-show="open && isTogglable")
</template>

<script>
const isInlineable = text => text.length <= 20 && !text.includes('\n');

const XmlElement = {
  name: 'XmlElement',
  props: [
    'tagName',
    'attributes',
    'childCount',
    'selected',
    'open',
    'show',
    'highlight',
    'leafCount',
    'text',
  ],

  data: () => ({
  }),

  computed: {
    hasAttribute() {
      return this.attributes.length > 0;
    },
    hasChild() {
      return this.childCount > 0;
    },
    hasInlineText() {
      return this.text ? isInlineable(this.text) : false;
    },
    hasIndividualText() {
      return this.text ? !isInlineable(this.text) : false;
    },

    isTogglable() {
      return this.hasChild || this.hasIndividualText;
    },

    toggleClass() {
      return {
        selected: this.selected,
        'open-graph': this.open,
        'closed-graph': !this.open,
      };
    },
    shortenText() {
      return this.hasIndividualText ? this.text.split('\n')[0].substr(0, 15) : '';
    },
  },

  methods: {
    onToggleOpen() {
      if (this.isTogglable) this.$emit('toggle');
    },
    onSelected() {
      this.$emit('select');
    },
  },
};

XmlElement.components = { XmlElement };
export default XmlElement;
</script>

<style lang="stylus">
.tag-name
  color dodgerblue
  line-height 1.3em
.xml-element
  position relative
  display block
  font-family Consolas, monospace
  font-size 12pt
  white-space pre-wrap

.attribute
  display inline
.open, .close, .tag
  display inline
  *
    display inline
.open.clickable
  .tag-name, .toggle
    cursor pointer
.attribute
  color orangered
  .name
    color plum
  .value
    color sandybrown
.info
  display inline
  user-select: none;

.dark
  color gray
.light-dark
  color darkgray
.lighter-dark
  color lightgray

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

.inline-text
  display inline
  padding 0 3px
.text-child
  color khaki
.shorten-text
  padding 0 6px
  color lightyellow
.selected.tag
  background black
  border-radius 3px
  color seagreen
  .tag-name
    color lime

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
