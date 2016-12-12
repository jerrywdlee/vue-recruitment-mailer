<template>
  <div id="app">
    <nav class="tm-navbar uk-navbar uk-navbar-attached">
      <div class="uk-container uk-container-center vmail-header">
        <a href="">
          <img class="vmail-logo" src="./assets/vue-mailer-logo-v02.svg" alt="vue-mailer-logo">
        </a>
        <h1>Vue Recruit Mailer</h1>
      </div>
    </nav>
    <!--
    <div id="glayer">

    </div>
  -->
    <!--
    <img src="./assets/logo.png">
    -->

    <!--
    <hello></hello>
    <world></world>
    -->
    <MailApp></MailApp>
  </div>
</template>

<script>
import Hello from './components/Hello'
import World from './components/World'
import MailApp from './components/MailApp'

export default {
  name: 'app',
  components: {
    Hello,
    World,
    MailApp
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
<style scoped>
  img.vmail-logo{
    height: 40px;
  }
  div.vmail-header{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  div.vmail-header h1{
    display: inline;
    margin: 10px;
    vertical-align: middle;
  }
</style>
