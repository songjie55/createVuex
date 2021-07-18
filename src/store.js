import Vuex from './vuex'
import Vue from "vue";

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        age: 18,
        name: 'tony',
    },
    getters: {
        getName(state) {
            return state.name
        }
    },
    mutations: {
        changeName(state, payload) {
            state.name = payload
        },
        addAge(state, payload) {
            state.age += payload
        }
    },
    actions: {
        addAge({commit}, payload) {
            setTimeout(() => {
                commit('addAge',payload)
            }, 2000)
        }
    }
})
