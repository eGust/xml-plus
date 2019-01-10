<template lang="pug">
  #app(@dragover.stop.prevent @drop.stop.prevent)
    url-box(:current-url="url" :disabled="loading" @go="onGo")
    xml-main(v-if="isXmlReady")
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';
import { mapState, mapActions } from 'vuex';

import { processXml } from '../ui/store';
import XmlMain from './components/XmlMain';
import UrlBox from './components/UrlBox';

import readFileText from './readFileText';

export default {
  name: 'app',

  components: { XmlMain, UrlBox },

  data: () => ({ loading: false }),

  computed: {
    ...mapState(['url', 'xmlKey']),

    isXmlReady() {
      return !!this.xmlKey;
    },
  },

  methods: {
    ...mapActions(['asyncUpdate']),

    async onGo({ url, file, fileUrl }) {
      this.loading = true;
      this.$d.xml = null;
      this.asyncUpdate({ name: 'reset' });
      if (url) {
        const res = await fetch(`/fetch?url=${encodeURIComponent(url)}`);
        this.onXmlReady(await res.text(), url);
      } else if (file) {
        this.onXmlReady(await readFileText(file), fileUrl);
      } else {
        this.loading = false;
      }
    },

    onXmlReady(xmlText, url) {
      try {
        const xmlKey = Date.now().toString(36);
        console.log({ url, xmlText, xmlKey });
        const xmlDoc = (new DOMParser()).parseFromString(xmlText, 'text/xml');
        const xml = processXml(xmlDoc);

        window.x = {
          doc: xmlDoc,
          root: xml.root,
          $: $(xml.root),
          history: [],
        };

        this.$d.xml = { [xmlKey]: xml };
        Vue.prototype.$xml = xml;
        this.asyncUpdate({ name: 'reset', payload: { xmlKey, url } });
      } finally {
        this.loading = false;
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
