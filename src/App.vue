<template>
  <div id="app">
    <nav class="tm-navbar uk-navbar uk-navbar-attached">
      <div class="uk-container uk-container-center vmail-header">
        <a href="">
          <img class="vmail-logo" src="./assets/vue-mailer-logo-v02.svg" alt="vue-mailer-logo">
        </a>
        <h1 class="uk-hidden-small">Vue Recruit Mailer</h1>
        <h2 class="uk-visible-small">Vue R Mailer</h2>
        <span class="uk-badge uk-badge-success vmail-version" style="">v0.0.42</span>
        <a class="github-banner uk-button uk-button-small" target="_blank" href="https://github.com/jerrywdlee/vue-recruitment-mailer">
          <i class="uk-icon-github"></i><b>&nbsp;Fork me!</b>
        </a>
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
  #app{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: transparent;
    /*margin-top: 60px;*/
  }
</style>
<style scoped>
  img.vmail-logo{
    max-height: 38px;
  }
  div.vmail-header{
    margin-top: 5px;
    /*line-height:100%;*/
    /*padding-top: 10px;*/
    margin-bottom: 5px;
  }
  div.vmail-header h1, div.vmail-header h2{
    display: inline;
    font-style: oblique;
    margin: 10px;
    vertical-align: middle;
    color: #41b883;
  }
  div.vmail-header .vmail-version{
    font-size:0.9em;
    padding-top: 3px;
    padding-bottom: 2px;
    vertical-align: middle;
  }
  .github-banner{
    /*float: right;*/
    box-shadow: 0 0 0 .10px rgba(0,0,0,0.4);
    position: absolute;
    top: 14px;
    right: calc(1% + 10px);
    z-index: 10;
    /*
    transform:rotate(25deg);
    -ms-transform:rotate(25deg);
    -moz-transform:rotate(25deg);
    -webkit-transform:rotate(25deg);
    -o-transform:rotate(25deg);
    */
  }
</style>
