<template lang="pug">
  #app(@dragover.stop.prevent @drop.stop.prevent)
    url-box(:current-url="url" :disabled="xmlStatus == 'loading'" @go="onGo")
    xml-main(v-if="xmlStatus == 'ready'" :root-element="rootElement" :levels="levels")
    #readme(v-else)
      read-me
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import { UrlBox } from '../ui/components';
import { XmlMain } from '../ui/containers';
import ReadMe from '../../README.md';

import buildFetchUrl from './buildFetchUrl';
import {
  buildX, readFileText, formatSize, parseXml,
} from '../ui/utils';

export default {
  name: 'app',

  components: { XmlMain, UrlBox, ReadMe },

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
        const xml = parseXml(xmlDoc);

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

#readme
  flex 1
  overflow auto
</style>

<style lang="scss">
#readme > section {
  padding: 30px 50px;
  margin: 0px;
  color:#f0e7d5;
  font-weight: normal;
  background: #252525;
  background-attachment: fixed !important;
  background: linear_gradient(#2a2a29, #1c1c1c);

  h1, h2, h3, h4, h5, h6 {
    color:#e8e8e8;
    margin:0 0 10px;
    font-weight: normal;
  }

  p, ul, ol, table, pre, dl {
    margin:0 0 20px;
  }

  h1, h2, h3 {
    line-height:1.1;

  }

  h1 {
    font-size:28px;
  }

  h2 {
    font-size: 24px;
  }

  h4, h5, h6 {
    color:#e8e8e8;
  }

  h3 {
    font-size: 18px;
    line-height: 24px;
    font-weight: normal;
    color: #b6b6b6;
  }

  a {
    color:#ffcc00;
    font-weight:400;
    text-decoration:none;

    &:hover {
      color: #ffeb9b;
    }
  }

  a small {
    font-size:11px;
    color:#666;
    margin-top:-0.6em;
    display:block;
  }

  strong {
    font-weight: normal;
  }

  .wrapper {
    max-width:650px;
    margin:0 auto;
    position:relative;
    padding: 0 20px;
  }

  section img {
    max-width: 100%;
  }

  blockquote {
    border-left:3px solid #ffcc00;
    margin:0;
    padding:0 0 0 20px;
    font-style:italic;
  }

  code {
    color:#efefef;
    font-size:13px;
    margin: 0 4px;
    padding: 4px 6px;
    border-radius: 2px;
  }

  pre {
    padding:8px 15px;
    background: #191919;
    border-radius: 2px;
    border:1px solid #121212;
    box-shadow: inset 0 1px 3px rgba(0,0,0,.3);
    overflow: auto;
    overflow-y: hidden;

    code {
      color: #efefef;
      text-shadow: 0px 1px 0px #000;
      margin: 0;
      padding: 0;
    }
  }

  table {
    width:100%;
    border-collapse:collapse;
  }

  th {
    text-align:left;
    padding:5px 10px;
    border-bottom:1px solid #434343;
    color: #b6b6b6;
    font-weight: normal;
  }

  td {
    text-align:left;
    padding:5px 10px;
    border-bottom:1px solid #434343;
  }

  hr {
    border: 0;
    outline: none;
    height: 3px;
    margin: 0 0 20px;
  }

  dt {
    color:#F0E7D5;
    font-weight: normal;
  }

}
</style>
