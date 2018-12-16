import Vue from 'vue';
import Vuex from 'vuex';
import cheerio from 'cheerio';

Vue.use(Vuex);

const createStore = ({ raw, root }) => {
  const xml = {
    root,
    $: cheerio.load(raw, { xmlMode: true }),
  };

  return new Vuex.Store({
    state: {
      xml,
    },
    mutations: {
    },
    actions: {
    },
  });
};

export default createStore;
