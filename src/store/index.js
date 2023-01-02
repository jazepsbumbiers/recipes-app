import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = () => ({
    searchTerm: '',
    sortOptions: {
        sortBy: '',
        order: 'ASC',
    },
    filterOptions: {
        types: [],
        difficulties: [],
        forServing: 0,
        rating: 0,
    },
});

const mutations = {
  setSearchTerm (state, query) {
    state.searchTerm = query;
  },
  setSortOptions (state, options) {
    state.sortOptions = options;
  },
  setFilterOptions (state, options) {
    state.filterOptions = options;
  },
};

const actions = {
    setSearchTerm: ({ commit }, value) => commit('setSearchTerm', value),
    setSortOptions: ({ commit }, options) => commit('setSortOptions', options),
    setFilterOptions: ({ commit }, options) => commit('setFilterOptions', options),
};

const getters = {
  getSearchTerm: state => state.searchTerm,
  getSortOptions: state => state.sortOptions,
  getFilterOptions: state => state.filterOptions,
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
