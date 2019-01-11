<template lang="pug">
  #app(@dragover.stop.prevent @drop.stop.prevent)
    url-box(:current-url="url" :disabled="xmlStatus == 'loading'" @go="onGo")
    xml-main(v-if="xmlStatus == 'ready'" :root-element="rootElement" :levels="levels")
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import { processXml } from '../ui/store';
import { UrlBox } from '../ui/components';
import { XmlMain } from '../ui/connected';

import buildFetchUrl from './buildFetchUrl';
import { buildX, readFileText, formatSize } from '../ui/utils';

export default {
  name: 'app',

  components: { XmlMain, UrlBox },

  data: () => ({
    xmlStatus: null,
    rootElement: null,
    levels: null,
  }),

  computed: {
    ...mapState(['url']),
  },

  methods: {
    ...mapActions(['asyncUpdate']),

    async onGo({ url, file }) {
      this.xmlStatus = 'loading';
      this.rootElement = null;
      this.levels = null;
      Vue.prototype.$xml = null;

      this.asyncUpdate({ name: 'reset' });
      try {
        if (url) {
          const fetchUrl = buildFetchUrl(url);
          const res = fetchUrl && await fetch(fetchUrl);
          this.onXmlReady(res && await res.text(), url);
        } else if (file) {
          this.onXmlReady(await readFileText(file), `<FILE: ${file.name}>`);
        } else {
          this.xmlStatus = null;
        }
      } catch (e) {
        console.error(e);
        this.xmlStatus = null;
      }
    },

    onXmlReady(xmlText, url) {
      try {
        console.debug({ url, xmlText });
        const xmlDoc = (new DOMParser()).parseFromString(xmlText, 'text/xml');
        const xml = processXml(xmlDoc);

        window.x = buildX(xmlDoc, xml);

        this.asyncUpdate({
          name: 'reset',
          payload: {
            url: `${url} (${formatSize(xmlText.length)})`,
          },
        });
        Vue.prototype.$xml = xml;
        this.rootElement = xml.root;
        this.levels = xml.levels;
        this.xmlStatus = 'ready';
      } catch (err) {
        this.xmlStatus = err.message;
      }
    },
  },
};
</script>

<style lang="stylus">
*
  box-sizing border-box
body
  margin 0
  padding 0
  font-family Helvetica, Arial, sans-serif
  background-color #222
  *
    margin 0
    padding 0

*::-webkit-scrollbar
  width 8px

*::-webkit-scrollbar-thumb
  background: #888;
  border-radius: 20px;

*::-webkit-scrollbar-track
  background: #444
  border-radius: 20px

#app
  display flex
  flex-direction column
  position relative
  color white
  width 100vw
  height 100vh
</style>
