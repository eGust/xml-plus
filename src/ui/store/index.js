import Vue from 'vue';
import Vuex from 'vuex';

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

const DEFAULT_STATUSES = {
  show: true,
  highlight: false,
  selected: false,
  hovering: false,
  childGroupIndex: null,
};

const newState = (level, childElementCount, element) => ({
  level,
  isLeaf: childElementCount === 0,
  open: decideOpen(level, childElementCount, element),
});

const mergeTo = ({ elements, e2pMap }, { element: el, path: parent, level: lvl }) => {
  const elementState = newState(lvl, el.childElementCount, el);
  Object.assign(elements, { [parent]: elementState });

  const level = lvl + 1;
  e2pMap.set(el, parent);
  const children = Array.from(el.children).map((element, index) => {
    const path = `${parent}:${index}/${element.tagName}`;
    return mergeTo({ elements, e2pMap }, { element, path, level });
  });

  elementState.leafCount = children
    .map(({ isLeaf, leafCount }) => (isLeaf ? 1 : leafCount))
    .reduce((sum, count) => sum + count, 0);

  return elementState;
};

function createDataFromXml(element) {
  const elements = {};
  const e2pMap = new WeakMap();
  mergeTo({ elements, e2pMap }, { element, path: element.tagName, level: 0 });
  return { elements, e2pMap };
}

function generateStateMaps(xml) {
  const { elements, e2pMap } = createDataFromXml(xml);

  const levels = [];
  Object.keys(elements).forEach((k) => {
    const { level } = elements[k];
    levels[level] = (levels[level] || 0) + 1;
  });

  return {
    statuses: elements,
    maps: {
      e2pMap,
      p2eMap: new WeakMap(Array.from(e2pMap).reverse()),
    },
    levels,
  };
}

const processXmlStore = (xml) => {
  console.time('build store');
  const root = xml.children[0];
  const { maps, levels, ...cached } = generateStateMaps(root);
  const store = new Vuex.Store({
    state: {
      statuses: {},
      current: {
        selected: null,
        hovering: null,
      },
    },

    mutations: {
      setElementStatus: (state, { path, status }) => {
        const { statuses } = state;
        if (state[path]) return;

        Vue.set(statuses, path, {
          ...DEFAULT_STATUSES,
          ...status,
        });
      },

      updateElementStatus: (state, { path, ...value }) => {
        const { statuses } = state;
        statuses[path] = { ...statuses[path], ...value };
      },
      updateCurrentElement: (state, { subject, path }) => {
        const { current, statuses } = state;
        const prevPath = current[subject];
        if (prevPath) {
          statuses[prevPath][subject] = false;
        }

        if (path) {
          statuses[path][subject] = true;
        }
        current[subject] = path;
      },
    },

    actions: {
      asyncUpdate: ({ commit }, { name, payload }) => {
        commit(name, payload);
      },
    },
  });
  console.timeEnd('build store');
  console.log(levels);
  return {
    store,
    xml: {
      ...maps, root, levels, cached,
    },
  };
};

export default processXmlStore;
