<template>
  <div id="app">
    <p>{{$store.state.age}}</p>
    <p>{{$store.getters.getName}}</p>
    <p>{{$store.state.a.name}}</p>
    <p>{{$store.state.b.name}}</p>
    <p>{{$store.state.b.c.name}}</p>
    <button @click="syncChange">改名</button>
    <br>
    <button @click="$store.dispatch('addAge',3)">改年龄</button>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    console.log(this.$store)
  },
  methods:{
    syncChange(){
      this.$store.commit('changeName','1')
      // this.$store.commit('b/changeName','2')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
