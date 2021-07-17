import Vuex from './vuex'
import Vue from "vue";
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        age:18,
        name:'tony',
    },
    getters:{
        getName(state){
            return state.name
        }
    }
})
