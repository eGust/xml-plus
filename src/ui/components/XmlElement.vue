<template lang="pug">
  .xml-element
    .open(:class="{ clickable: isTogglable }")
      template(v-if="isTogglable")
        .toggle.unselectable(@click="onToggleOpen" :class="toggleClass")  &nbsp;
        | <
      template(v-else)
        .dash.unselectable -&nbsp;
        | <
      .tag-name(@click="onToggleOpen") {{ tagName }}
      template(v-if="isOpen")
        .attribute(v-for="attr in attributes")
          | &nbsp;
          .name {{ attr.name }}
          | ="
          .value {{ attr.value }}
          | "
      template(v-else-if="hasAttributes")
        |  ...
      | {{ isTogglable ? '>' : ' />' }}
      template(v-if="!isOpen")
        .elements(v-if="hasChildren")  [{{ childElements.length }} elements...]
        .text(v-else)  ...
        .unselectable {{ ' ' }}
        | </
        .tag-name {{ tagName }}
        | >

    template(v-if="isOpen")
      .children(v-if="hasChildren")
        XmlElement(
          v-for="e in childElements"
          :element="e.element"
          :path="e.path"
          :key="e.path"
        )
      .children(v-else-if="hasText") {{ text }}
      .close(v-if="isTogglable")
        .unselectable  &nbsp;
        | </
        .tag-name {{ tagName }}
        | >
    .guide-line(v-show="isOpen && isTogglable")
</template>

<script>
const KEY_NAME = '__::_key_';
const DO_NOTHING = () => {};

const XmlElement = {
  name: 'xml-element',
  props: ['element', 'path'],

  data: () => ({
    isOpen: true,
  }),

  computed: {
    hasChildren() {
      return this.element.childElementCount > 0;
    },
    hasText() {
      return this.text.length > 0;
    },
    hasAttributes() {
      return this.attributes.length > 0;
    },
    childElements() {
      const { path: p, element: el } = this;
      const parent = `${p}>${el.tagName}`;
      return Array.from(el.children).map((element, index) => ({
        element,
        path: `${parent}.${index}`,
      }));
    },
    isTogglable() {
      return this.hasChildren || this.hasText;
    },

    toggleClass() {
      return this.isOpen ? 'open-graph' : 'closed-graph';
    },

    tagName() {
      return this.element.tagName;
    },
    attributes() {
      const { element: el } = this;
      const attrs = el.getAttributeNames()
        .map(name => ({ name, value: el.getAttribute(name) }))
        .filter(({ name }) => name !== KEY_NAME);

      el.setAttribute(KEY_NAME, this.path);
      return attrs;
    },
    text() {
      return this.element.innerHTML.trim();
    },

    onToggleOpen() {
      return this.isTogglable ? this.toggleOpen : DO_NOTHING;
    },
  },

  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
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

.children
  padding-left 2.2em
  position relative

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

.guide-line
  position absolute
  top 1.2em
  left 5px
  bottom 0.5em
  width 0.4em
  background-color transparent
  border-left 0.6px dashed lemonchiffon
  border-bottom 0.6px dashed lemonchiffon
</style>
