import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  numbers: [],
}

const mutations = {
  ADD_NUMBER(state, payload) {
    state.numbers.push(payload)
  },
}

const actions = {
  addNumber(context, number) {
    context.commit('ADD_NUMBER', number)
  },
}

const getters = {
  // state
  getNumbers: (state) => state.numbers,
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
