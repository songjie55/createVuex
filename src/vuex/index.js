import Vue from "vue";

let forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key])
    })
}
//namespaced的原理是在注册mutation和action时候添加给mutationName或actionName加上子模块的名字，生成单独的mutationName和actionName
function installModule(store, rootState, path, rawModule) {//给各个模块安装action和mutation
    //第一个参数是当前实例，第二个参数根组件的数据state,第三个路径，第四个父模块

    //给根模块上面安装子模块的state
    if (path.length > 0) {//当path不为空数组就是正在安装子模块
        let parentState = path.slice(0, -1).reduce((root, current) => {
            return rootState[current]
        }, rootState)
        //vue中给不存在的值设置响应式通过set
        Vue.set(parentState, path[path.length - 1], rawModule.state)
    }
    let {getters,mutations,actions} = rawModule._raw
    if (getters) {
        forEach(getters, (getterName, value) => {//设置模块的getters
            Object.defineProperty(store.getters, getterName, {
                get: () => {
                    return value(rawModule.state)//传递当前模块的state
                }
            })
        })
    }
    if (mutations) {
        forEach(mutations, (mutationName, value) => {
            // 发布订阅,在根组件上面设置一个订阅者,commit的时候所有同名的mutation都会触发
            let arr = store.mutations[mutationName] || (store.mutations[mutationName] = [])
            arr.push((payload) => {
                value(rawModule.state, payload)
            })
        })
    }
    if (actions) {
        forEach(actions, (actionName, value) => {
            // 发布订阅,在根组件上面设置一个订阅者,commit的时候所有同名的mutation都会触发
            let arr = store.actions[actionName] || (store.actions[actionName] = [])
            arr.push((payload) => {
                value(store, payload)
            })
        })
    }
    //如果有子模块递归安装action和mutation;
    forEach(rawModule._children, (moduleName, rawModule) => {
        installModule(store, rootState, path.concat(moduleName), rawModule)
    })
}
//重置store
function resetStore (store) {
    store.actions = Object.create(null)
    store.mutations = Object.create(null)
    store.getters = Object.create(null)
    installModule(store, store.state, [], store.modules.root)
}
class ModuleCollection {//递归收集子模块并注册
    constructor(options) {
        //深度递归所有子模块
        this.register([], options)
    }

    register(path, rootModule) {//第一个参数用来收集模块放到数组里,第二个参数可以看成是父模块
        let rawModule = {
            _raw: rootModule,
            _children: {},//对象方便查找
            state: rootModule.state
        }
        if (!this.root) {
            //没有根模块
            this.root = rawModule
        } else {//如果有根模块
            //不停的通过Path把子模块自己注册到父模块上，递归
            let parentModule = path.slice(0, -1).reduce((root, current) => {
                return root._children[current]
            }, this.root)//reduce的初始参数是根节点
            parentModule._children[path[path.length - 1]] = rawModule//直接获取依赖收集数组的最后一项正好是可以作为子模块的根模块
        }
        if (rootModule.modules) {//如果含有子模块
            forEach(rootModule.modules, (modulesName, module) => {
                /*递归注册子模块*/
                this.register(path.concat(modulesName), module)
            })
        }
    }
}

class Store {
    constructor(options) {
        //利用vue的数据响应式原理来设置响应式数据，不自己利用defineProperty设置响应式的理由是太过繁琐
        this.vm = new Vue({//创建实例
            data: {state: options.state}
        })

        this.getters = {};
        this.mutations = {};
        this.actions = {};
        // 实现模块化，递归收集依赖
        // 1.对用户传入数据进行格式化操作
        this.modules = new ModuleCollection(options)
        // 2.递归安装模块
        installModule(this, this.state, [], this.modules.root)
    }

    commit = (mutationName, payload) => {//这里用箭头函数的原因是、commit是函数，函数被调用的时候里面的this指向当前调用的对象，但是在写action方法时候会用解构的方式来写，例如change({commit}),这个时候commit才会正确指向并找到
        this.mutations[mutationName].forEach(fn => {
            fn(payload)
        })
    }
    dispatch = (actionName, payload) => {
        this.actions[actionName].forEach(fn => {
            fn(payload)
        })
    }

    get state() {
        return this.vm.state
    }

    //动态注册模块
    registerModule(moduleName, module) {//第一个参数是数组
        if (!Array.isArray(moduleName)) {
            moduleName = [moduleName]
        }
        this.modules.register(moduleName, module)//注册模块格式化
        //安装模块
        installModule(this, this.state, moduleName, module)
        //安装后重新重置模块，因为会有相同的getter会重复
        resetStore(this)
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
