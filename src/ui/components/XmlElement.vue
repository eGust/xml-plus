<template lang="pug">
  .node
    .open(:class="{ clickable: isTogglable }")
      template(v-if="isTogglable")
        | {{ indent }}
        .toggle.unselectable(@click="onToggleOpen" ref="toggle") {{ isOpen ? '⏷' : '⏵' }}
        | <
      template(v-else)
        | {{ indent }}
        .dash.unselectable {{ '- ' }}
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
          :level="childLevel"
        )
      .text(v-else-if="hasText") {{ text }}
      .close(v-if="isTogglable")
        | {{ indent }}
        .unselectable {{ ' ' }}
        | </
        .tag-name {{ tagName }}
        | >
    .guide-line(:style="guideLineStyles")
</template>

<script>
const KEY_NAME = '__::_key_';

const DO_NOTHING = () => {};

console.log('load XmlElement');

const XmlElement = {
  name: 'xml-element',
  props: ['element', 'path', 'level'],

  data: () => ({
    isOpen: true,
    guideLineStyles: { display: 'none', left: 0 },
  }),

  mounted() {
    this.updateGuideLineStyles();
  },

  computed: {
    hasChildren() {
      return this.element.childElementCount > 0;
    },
    hasText() {
      return this.text.trim().length > 0;
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
    childLevel() {
      return (this.level | 0) + 1;
    },

    indent() {
      const indents = new Array(this.level | 0);
      indents.fill(this.$settings.indent);
      return indents.join('');
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
      const indent = `${this.indent}${this.$settings.indent}`;
      const lines = this.element.innerHTML.trim().split('\n');
      return lines.map(ln => `${indent}${ln}`).join('\n');
    },

    onToggleOpen() {
      return this.isTogglable ? this.toggleOpen : DO_NOTHING;
    },
  },

  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },

    updateGuideLineStyles() {
      const t = setTimeout(() => {
        clearTimeout(t);
        const { toggle } = this.$refs;
        if (!toggle) {
          this.$nextTick(() => {
            this.guideLineStyles = {
              display: 'none',
              left: 0,
            };
          });

          this.updateGuideLineStyles();
          return;
        }

        const { offsetLeft, offsetWidth } = toggle;
        const left = (offsetLeft + offsetWidth / 2) | 0;
        this.$nextTick(() => {
          this.guideLineStyles = {
            display: 'block',
            left: `${left - 1}px`,
          };
        });
      }, 33);
    },
  },
};

XmlElement.components = { XmlElement };
export default XmlElement;
</script>

<style lang="stylus" scoped>
.node
  position relative
  display block
  font-family Consolas, monospace
  white-space pre-wrap
.attribute
  display inline
.open, .close
  *
    display inline
  .tag-name
    color darkgreen
.clickable
  .tag-name, .toggle
    cursor pointer
.attribute
  color blue
  .name
    color purple
  .value
    color maroon
.toggle
  color deepskyblue
.dash
  color gray
.unselectable
  user-select: none;
.guide-line
  position absolute
  top 1.3rem
  bottom 0.8rem
  width 1px
  background-color transparent
  border-left 0.6px dashed lightskyblue
</style>
