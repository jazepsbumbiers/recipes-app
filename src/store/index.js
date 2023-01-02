import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = () => ({
    searchTerm: '',
    sortOptions: {
        sortBy: '',
        order: 'ASC',
    },
});

const mutations = {
  setSearchTerm (state, query) {
    state.searchTerm = query;
  },
  setSortOptions (state, options) {
    state.sortOptions = options;
  },
};

const actions = {
    setSearchTerm: ({ commit }, value) => commit('setSearchTerm', value),
    setSortOptions: ({ commit }, options) => commit('setSortOptions', options),
};

const getters = {
  getSearchTerm: state => state.searchTerm,
  getSortOptions: state => state.sortOptions,
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
