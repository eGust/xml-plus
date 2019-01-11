<template lang="pug">
  header(
    @dragenter.stop.prevent
    @dragleave.stop.prevent="onDragLeave"
    @mouseleave="onDragLeave"
    @dragover.stop.prevent="onDragOver"
    @drop.stop.prevent="onDrop"
  )
    label.browse
      xml-icon
      input(type="file" @change="onSelectFile" accept="text/xml,application/xml")
    input(
      type="url"
      :placeholder="placeholder"
      :class="dragClass"
      v-model="url"
    )
    label.button(:class="{disabled: !goable}" @click="onClickGo")
      .text Go!
    .disabled-mask(v-if="disabled")
</template>

<script>
import XmlIcon from '../../assets/xml.svg';
import { formatSize } from '../utils';

const isXmlType = ({ type }) => type === 'text/xml' || type === 'application/xml';
const reValidLink = /^https?:\/\/\w+/;

export default {
  name: 'url-box',

  components: { XmlIcon },
  props: ['current-url', 'disabled'],

  data: () => ({ newUrl: '', xmlFile: null, dragClass: '' }),

  computed: {
    url: {
      get() {
        return this.newUrl || this.fileInfo;
      },

      set(val) {
        const v = val.trim();
        if (v && this.xmlFile) {
          if (reValidLink.test(v)) {
            this.newUrl = val;
          } else {
            this.newUrl = '';
          }
          this.xmlFile = null;
          return;
        }

        this.newUrl = val;
        if (v) {
          this.xmlFile = null;
        }
      },
    },

    placeholder() {
      return this.currentUrl || 'Drop XML file or paste a link here';
    },

    fileInfo() {
      const { xmlFile: f } = this;
      return f && `<FILE: ${f.name} (${formatSize(f.size)})>`;
    },

    goable() {
      return this.xmlFile || (this.url && reValidLink.test(this.url));
    },
  },

  methods: {
    onDragOver(e) {
      this.dragClass = Array.from(e.dataTransfer.items)
        .find(isXmlType) ? 'green' : 'red';
    },

    onDragLeave() {
      this.dragClass = '';
    },

    onDrop(e) {
      this.dragClass = '';
      const xmlFile = Array.from(e.dataTransfer.files).find(isXmlType);
      this.xmlFile = xmlFile;
      if (xmlFile) {
        this.newUrl = '';
      }
    },

    onSelectFile(e) {
      const xmlFile = Array.from(e.target.files).find(isXmlType);
      this.xmlFile = xmlFile;
      if (xmlFile) {
        this.newUrl = '';
      }
    },

    onClickGo() {
      if (!this.goable) return;

      const { newUrl: url, xmlFile: file } = this;
      this.$emit('go', { url, file });
      this.$nextTick(() => {
        this.url = '';
        this.xmlFile = null;
        this.dragClass = '';
      });
    },
  },
};
</script>

<style lang="stylus">
header
  height 36px
  background-color #444
  overflow hidden
  & > *
    vertical-align top
  input
    font-family Consolas, monospace
    font-size 12pt
    height 30px
    margin 3px 4px
    padding 2px 8px
    color white
    background-color #222
    border 1px solid lightskyblue
    width calc(100% - 140px)
    min-width 250px
    max-width 1050px
    &.green
      background-color darkgreen
    &.red
      background-color darkred
      cursor not-allowed
    &:focus
      background-color black
      border-color white
      border-width 2px
  label
    display inline-flex
    cursor pointer
    position relative
    align-items center
    justify-content center
    & > *
      vertical-align middle
  label.button
    width 80px
    height 30px
    margin 3px 0
    font-family Consolas, monospace
    font-size 12pt
    color black
    border 1px solid white
    background-color darkorange
    &.disabled
      background-color #AAA
      color gray
      cursor not-allowed
      border-color gray
  label.browse
    margin 2px 0 2px 5px
    padding 5px
    height 32px
    width 40px
    background-color #222
    border 1px white solid
    & > *
      flex 1
      max-height 22px
    input[type=file]
      display none
  .disabled-mask
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background-color white
    opacity 0.8
</style>
