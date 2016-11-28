<template>
  <div class="parient">
    <div id="div01" class="editable front" contentEditable="true"></div>
    <div id="div02" class="editable back">back back back</div>
  </div>
</template>

<script>
export default {
  name: 'MailApp',
  data () {
    return {}
  }
}

</script>

<style scoped>
  div{
    border-radius:5px;
    float:left;
    /*position:relative;*/
  }

  div.parient{
    position:relative;
    width:60%;
    border: 2px solid Cyan;
    padding: 0px
  }

  div.editable{
  }

  div.front,div.back{
    width: 95%;
    height: 300px;
    border: 2px solid #ccc;
    padding: 5px;
    top:0px;
    left:10px;
  }

  div.front{
    position:relative;
    z-index:10;
  }

  div.back{
    position:absolute;
    /*margin-left:-40%;*/
    z-index:-1;
    color: rgba(0,0,0,0.2);
  }

  .red{
    background: red;
    position: relative;
    -moz-border-radius:    5px;
    -webkit-border-radius: 5px;
    border-radius:         5px;
    /*padding: 1.5px;*/
    /*
    margin-left: 3px;
    left : -3px;
    margin-right: 3px;
    right:-3px;
    */
  }
</style>
