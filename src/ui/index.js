import Vue from 'vue';
import App from './App';
import createStore from './store';

Vue.config.productionTip = false;

const startApp = (xml) => {
  new Vue({
    store: createStore(xml),
    render: h => h(App),
  }).$mount('#app');
};

export default startApp;
