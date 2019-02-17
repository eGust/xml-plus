<template lang="pug">
  .xml-element(v-show="status.show" @mouseover="onMouseOver" @mouseleave="onMouseLeave")
    .open(:class="{ clickable: isTogglable }")
      template(v-if="isTogglable")
        .toggle.unselectable(@click="onToggleOpen" :class="toggleClass")  &nbsp;
      template(v-else)
        .dash.unselectable -&nbsp;
      .tag(:class="{ selected: status.selected }")
        | <
        .tag-name(@click="onSelected" :data-path="path") {{ tagName }}
        template(v-if="status.open || (isToggleDisabled && isSelfClosed)")
          .attribute(v-for="attr in attributes")
            | &nbsp;
            .name {{ attr.name }}
            | ="
            .value {{ attr.value }}
            | "
        template(v-else-if="hasAttribute")
          |  ...
        | {{ isSelfClosed ? ' /' : '' }}>

    template(v-if="hasInlineText")
      .inline-text.text-child {{ text }}
      .close.tag(:class="{selected: status.selected}")
        | </
        .tag-name(@click="onSelected") {{ tagName }}
        | >

    template(v-else-if="status.open")
      .copy-button(@click="onCopy")
        copy-icon.copy-icon
      .info.dark(v-if="hasChild")
        |  - {{ childCount }} children, {{ status.leafCount }} leafs
    template(v-else-if="!isSelfClosed")
      .copy-button(@click="onCopy")
        copy-icon.copy-icon
      .info.light-dark.elements(v-if="hasChild")
        |  [{{ childCount }} children, {{ status.leafCount }} leafs...]&nbsp;
      .info.shorten-text(v-else :title="text")
        | {{ shortenText }}...
      .close.tag(:class="{selected: status.selected}")
        | </
        .tag-name(@click="onSelected") {{ tagName }}
        | >

    .children-wrap(v-if="available || isOpen" v-show="isOpen")
      template(v-if="hasChild")
        slot
      .children.text-child(v-else-if="hasIndividualText") {{ text }}
    .close(v-if="isOpen")
      .unselectable  &nbsp;
      .tag(:class="{selected: status.selected}")
        | </
        .tag-name(@click="onSelected") {{ tagName }}
        | >
    .guide-line(v-show="isOpen", :class="{ hovering: status.hovering }")
</template>

<script>
import CopyIcon from '../../assets/copy-document.svg';

const isInlineable = text => text.length <= 20 && !text.includes('\n');

const XmlElement = {
  name: 'XmlElement',
  props: [
    'tagName',
    'attributes',
    'childCount',
    'text',
    'status',
    'toggle',
    'path',
  ],

  data: () => ({
    available: false,
  }),

  mounted() {
    if (!this.isOpen) return;

    this.$nextTick(() => {
      this.available = this.isOpen;
    });
  },

  updated() {
    if (this.available || !this.isOpen) return;

    this.$nextTick(() => {
      this.available = true;
    });
  },

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

    isToggleDisabled() {
      return this.toggle === 'disabled';
    },
    isTogglable() {
      return !this.isToggleDisabled && (this.hasChild || this.hasIndividualText);
    },
    isOpen() {
      return this.status.open && this.isTogglable;
    },
    isSelfClosed() {
      return !(this.isToggleDisabled ? this.text : (this.hasInlineText || this.isTogglable));
    },

    toggleClass() {
      return {
        selected: this.status.selected,
        'open-graph': this.status.open,
        'closed-graph': !this.status.open,
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
    onCopy() {
      this.$emit('copy');
    },
    onMouseOver(e) {
      if (this.hovering) {
        e.stopImmediatePropagation();
        return;
      }

      if (this.isOpen) {
        e.stopImmediatePropagation();
        this.$emit('hover-start');
      }
    },
    onMouseLeave() {
      this.$emit('hover-end');
    },
  },
};

XmlElement.components = { XmlElement, CopyIcon };
export default XmlElement;
</script>

<style lang="stylus">
.tag-name
  cursor default
  color dodgerblue
  line-height calc(1em + 6px)
.xml-element
  position relative
  display block
  font-family Consolas, monospace
  font-size 12pt
  white-space pre-wrap

.attribute
  display inline
.open, .close
  display inline
  *
    display inline
.tag > *
  display inline-block
.toggle
  cursor pointer
.attribute
  color orangered
  .name
    color plum
  .value
    color sandybrown
.info
  display inline-block
  user-select: none

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
.copy-button
  display none
  cursor pointer
  margin-left 5px
  .copy-icon
    width 19px
    height 19px
    padding 3px
    vertical-align middle
    border 0.6px dotted lightskyblue
    border-radius 3px
  &:hover .copy-icon
    border-style solid

.xml-element
  &:hover > .copy-button
    display inline-block
  & > .guide-line
    position absolute
    top 1.2em
    left 6px
    bottom 0.5em
    width 0.4em
    background-color transparent
    border-left 0.6px dashed lemonchiffon
    border-bottom 0.6px dashed lemonchiffon
    &.hovering
      border-left 0.6px solid deeppink
      border-bottom 0.6px solid deeppink
</style>
