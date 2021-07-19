import Vue from 'vue'
import App from './App.vue'
import store from "./store";

Vue.config.productionTip = false
store.registerModule(['b', 'd'], {
    state: {
        name: 'c'
    }
})
new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
