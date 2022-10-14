import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = () =>
  new Vuex.Store({
    state: {
      menuActive: '1'
    },
    getters: {
      currentMenuActive: state => {
        return state.menuActive;
      }
    },
    mutations: {
      changeMenuActive(state, payload) {
        state.menuActive = payload;
      },
    }
  });
export default store;
