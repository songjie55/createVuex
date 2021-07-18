import Vuex from 'vuex'
// import Vuex from './vuex'
import Vue from "vue";

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        a: {
            state: {
                name: 'a'
            },
            mutations: {
                changeName(state, payload) {
                    state.name += payload
                }
            },
            actions: {
                addAge() {
                    console.log('a')
                }
            }
        },
        b: {
            //namespaced:true,//命名空间开启之后不共享mutation,也不会触发外部订阅的mutation
            state: {
                name: 'b'
            },
            mutations:{
                changeName(state, payload) {
                    state.name+=payload
                }
            },
            actions: {
                addAge() {
                    console.log('b')
                }
            },
            modules: {
                c: {
                    state: {
                        name: 'c'
                    },
                    mutations:{
                        changeName(state, payload) {
                            state.name+=payload
                        }
                    },
                    actions: {
                        addAge() {
                            console.log('c')
                        }
                    }
                }
            }
        }
    },
    state: {
        age: 18,
        name: 'root',
    },
    getters: {
        getName(state) {
            return state.name
        }
    },
    mutations: {
        changeName(state, payload) {
            state.name += payload
        },
        addAge(state, payload) {
            state.age += payload
        }
    },
    actions: {
        addAge({commit}, payload) {
            setTimeout(() => {
                commit('addAge', payload)
            }, 2000)
        }
    }
})
