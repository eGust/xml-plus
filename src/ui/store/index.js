import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const DEFAULT_STATUSES = {
  show: true,
  highlight: false,
  selected: false,
  hovering: false,
  childGroupIndex: null,
};

const store = new Vuex.Store({
  state: {
    url: null,
    statuses: {},
    current: {
      selected: null,
      hovering: null,
    },
  },

  mutations: {
    /* eslint-disable no-param-reassign */
    reset: (state, { url = null }) => {
      state.url = url;
      state.statuses = {};
      state.current = {
        selected: null,
        hovering: null,
      };
    },
    /* eslint-enable no-param-reassign */

    setElementStatus: (state, { path, status }) => {
      const { statuses } = state;
      if (state[path]) return;

      Vue.set(statuses, path, {
        ...DEFAULT_STATUSES,
        ...status,
      });
    },

    updateElementStatus: (state, { path, ...status }) => {
      const { statuses } = state;
      statuses[path] = { ...statuses[path], ...status };
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

      if (subject === 'selected') {
        const { x } = window;
        const { root } = x;
        x.cur = path ? path.slice(2).split('/').reduce((n, i) => n.children[i], root) : root;
      }
    },

    updateSubject: (state, { subject, data }) => {
      // eslint-disable-next-line no-param-reassign
      state[subject] = { ...state[subject], ...data };
    },
  },

  actions: {
    asyncUpdate: ({ commit }, { name, payload = {} }) => {
      commit(name, payload);
    },
  },
});

export default store;
