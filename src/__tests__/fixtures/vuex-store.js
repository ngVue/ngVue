import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    people: [
      { firstName: 'John', lastName: 'Smith' },
      { firstName: 'Jane', lastName: 'Doe' }
    ]
  },

  mutations: {
    addPerson (state, person) {
      state.people = state.people.concat([person])
    }
  }
})
