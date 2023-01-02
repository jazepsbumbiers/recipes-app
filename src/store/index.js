import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = () => ({
    searchTerm: '',
});

const mutations = {
  setSearchTerm (state, query) {
    state.searchTerm = query;
  },
};

const actions = {
    setSearchTerm: ({ commit }, value) => commit('setSearchTerm', value),
};

const getters = {
  getSearchTerm: state => state.searchTerm,
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
