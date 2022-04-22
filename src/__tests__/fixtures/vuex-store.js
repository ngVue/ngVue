import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultState = () => ({
  people: [
    { firstName: 'John', lastName: 'Smith' },
    { firstName: 'Jane', lastName: 'Doe' },
  ],
})

export default new Vuex.Store({
  state: defaultState(),

  mutations: {
    addPerson(state, person) {
      state.people = state.people.concat([person])
    },
    reset(state) {
      Object.assign(state, defaultState())
    },
  },
})
