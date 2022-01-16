<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="CS:GO Tournament web application"/>
</template>

<script>
import 'bootstrap'

import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #eee;
  margin-top: 60px;
}

@import '~bootstrap/dist/css/bootstrap.min.css';
@import './assets/css/styles.css';
</style>
