import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const createStore = ({ doc }) => {
  const xml = { doc };

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
