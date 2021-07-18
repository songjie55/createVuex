import Vue from "vue";

let forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key])
    })
}

class Store {
    constructor(options) {
        //利用vue的数据响应式原理来设置响应式数据，不自己利用defineProperty设置响应式的理由是太过繁琐
        this.vm = new Vue({//创建实例
            data: {state: options.state}
        })
        let getters = options.getters;
        this.getters = {}
        forEach(getters, (key, value) => {
            Object.defineProperty(this.getters, key, {
                get: () => {
                    return value(this.state)//value就是获取到的每个getter函数
                }
            })
        })
        //吧用户定义的Mutation放到store上
        let mutations = options.mutations;
        this.mutations = {};
        forEach(mutations, (mutationName, value) => {
            this.mutations[mutationName] = (payload) => {//这里要用箭头函数不然this错乱
                value(this.state, payload)
            }
        })
        let actions = options.actions;
        this.actions = {};
        forEach(actions, (actionName, value) => {
            this.actions[actionName] = (payload) => {//这里要用箭头函数不然this错乱
                value(this, payload)//这里的第一个参数用this store是因为action写的时候可以解构
            }
        })
    }

    commit = (mutationName, payload) => {//这里用箭头函数的原因是、commit是函数，函数被调用的时候里面的this指向当前调用的对象，但是在写action方法时候会用解构的方式来写，例如change({commit}),这个时候commit才会正确指向并找到
        this.mutations[mutationName](payload)
    }
    dispatch = (actionName, payload) => {
        this.actions[actionName](payload)
    }

    get state() {
        return this.vm.state
    }
}

const install = function (Vue) {
    // 这里不使用传进来的Vue构造函数的原型，是因为会被所有的实例添加，store全局只能有一份统一的，而不是多份不统一的，
    // 全局状态统一管理
    // 只从当前根实例开始，所有的子组件才有$store
    Vue.mixin({
        beforeCreate() {
            //把根组件的store属性，都放到每个子组件上，根组件就是主入口文件实例化的那个vue对象
            if (this.$options.store) {//如果是根组件的话就把初始化时候传进来的参数store放到$store这个属性上
                this.$store = this.$options.store
            } else {
                this.$store = this.$parent && this.$parent.$store//子组件的store从父组件取值
            }
        }
    })
}
export default {
    Store,
    install
}
