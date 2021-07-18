<template>
  <div id="app">
    <p>{{$store.state.age}}</p>
    <p>{{$store.getters.getName}}</p>
    <button @click="$store.commit('changeName','juju')">改名</button>
    <br>
    <button @click="$store.dispatch('addAge',3)">改年龄</button>
  </div>
</template>

<script>

export default {
  name: 'App',
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
