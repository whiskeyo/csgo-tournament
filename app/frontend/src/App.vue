<template>
  <Navbar/>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="CS:GO Tournament web application"/>
  <Footer/>
</template>

<script>
import 'bootstrap'

import Navbar from './components/common/Navbar.vue'
import Footer from './components/common/Footer.vue'

import HelloWorld from './components/HelloWorld.vue'


export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    HelloWorld,
  }
}
</script>

<style>
@import '~bootstrap/dist/css/bootstrap.min.css';
@import './assets/css/styles.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--main-text-color);
  background-color: var(--main-bg-color);
  margin-bottom: 50px;
  padding-bottom: 10px;
  min-height: 100%;
}

</style>
