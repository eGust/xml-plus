import Vue from 'vue';
import Vuex from 'vuex';

import { KEY_NAME } from '../components/ElementTree';

Vue.use(Vuex);

function linesLessThan(str, count) {
  let total = 0;
  // performance consideration
  for (const c of str) { // eslint-disable-line no-restricted-syntax
    if (c !== '\n') continue; // eslint-disable-line no-continue

    total += 1;
    if (total >= count) return false;
  }
  return true;
}

function decideOpen(level, count, element) {
  if (count === 1) return true;
  if (!count) return linesLessThan(element.innerHTML.trim(), 10);

  if (level <= 1) return count < 32;
  if (level <= 3) return count < 20;
  if (level <= 5) return count <= 6;
  if (level <= 7) return count <= 3;
  return false;
}

const newState = (level, childElementCount, element) => ({
  level,
  open: decideOpen(level, childElementCount, element),
  show: true,
  highlight: false,
  isLeaf: childElementCount === 0,
});

const mergeTo = (state, { element: el, path: parent, level: lvl }) => {
  const elementState = newState(lvl, el.childElementCount, el);
  Object.assign(state, { [parent]: elementState });

  const level = lvl + 1;
  el.setAttribute(KEY_NAME, parent);
  const children = Array.from(el.children).map((element, index) => {
    const path = `${parent}:${index}/${element.tagName}`;
    return mergeTo(state, { element, path, level });
  });

  elementState.leafCount = children
    .map(({ isLeaf, leafCount }) => (isLeaf ? 1 : leafCount))
    .reduce((sum, count) => sum + count, 0);

  return elementState;
};

function createElementsFromXml(element) {
  const state = {};
  mergeTo(state, { element, path: element.tagName, level: 0 });
  return state;
}

function generateState(xml) {
  const elements = createElementsFromXml(xml);

  const levels = {};
  Object.keys(elements).forEach((k) => {
    const { level } = elements[k];
    levels[level] = (levels[level] || 0) + 1;
  });

  levels[0] = Object.values(levels).reduce((sum, count) => sum + count, 0) - 1;
  console.log(levels);

  return {
    elements,
    selected: null,
  };
}

const createStore = xml => new Vuex.Store({
  state: generateState(xml),
  mutations: {
    updateElementStatus: (state, { path, ...value }) => {
      const { elements } = state;
      elements[path] = { ...elements[path], ...value };
    },
    selectElement: (state, { path }) => {
      state.selected = path;
    },
  },
  actions: {
    asyncUpdate: ({ commit }, { name, payload }) => {
      commit(name, payload);
    },
  },
});

export default createStore;
