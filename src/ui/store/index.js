import Vue from 'vue';
import Vuex from 'vuex';

import { KEY_NAME } from '../components/ElementTree';

Vue.use(Vuex);

const newState = level => ({
  level,
  open: level < 5,
  show: true,
  highlight: false,
});

const mergeTo = (state, { element: el, path: parent, level: lvl }) => {
  Object.assign(state, { [parent]: newState(lvl) });
  const level = lvl + 1;
  el.setAttribute(KEY_NAME, parent);
  Array.from(el.children).forEach((element, index) => {
    const path = `${parent}:${index}/${element.tagName}`;
    mergeTo(state, { element, path, level });
  });
};

function createStateFromXml(element) {
  const state = {};
  mergeTo(state, { element, path: element.tagName, level: 0 });
  return state;
}

const createStore = xml => new Vuex.Store({
  state: {
    elements: createStateFromXml(xml),
  },
  mutations: {
    updateElementStatus: (state, { path, ...value }) => {
      const { elements } = state;
      elements[path] = { ...elements[path], ...value };
    },
  },
  actions: {
    asyncUpdate: ({ commit }, { name, payload }) => {
      commit(name, payload);
    },
  },
});

export default createStore;
