<template>
  <!--
  <div class="parient">
    <div id="div_f" class="editable front" contentEditable="true" @keyup="setMessage"></div>
    <div id="div_b" class="editable back" v-html="backMessage"></div>
  </div>
  -->

  <div class="MailApp">
    <!--
    <div v-html="messageF">
      <span ></span>
    </div>
    -->
    <MailWorkSpace></MailWorkSpace>
  </div>
</template>

<script>
  import MailWorkSpace from './mail_app/MailWorkSpace'

  export default {
    name: 'MailApp',
    data () {
      return {
        messageF: 'Plz \n Type \n Sth.'
      }
    },
    components: {
      // Hello,
      // World,
      // MailApp
      MailWorkSpace
    },
    computed: {
      backMessage: function () {
        // console.log('MailWorkSpace.backMessage')
        // console.log(MailWorkSpace.backMessage)
        // return MailWorkSpace.backMessage
      }
    }
  }
</script>
<!--
<script>
import MailWorkSpace from './components/mail_app/MailWorkSpace'

export default {
  name: 'MailApp',
  data () {
    return {
      messageF: 'Plz \n Type \n Sth.',
      messageB: ''
      // rawTags: [],
      // tagReg: null
    }
  },
  computed: {
    // a computed getter
    // this may also be put in to `methods` but `computed` is better
    backMessage: function () {
      // `this` points to the vm instance
      console.log(this.messageB)
      // let tmpReg = new RegExp('(' + this.rawTags.join('|') + ')', 'g')
      console.log(this.rawTags)
      // console.log(tmpReg)
      // let tmpReg = /aaa/g
      let tmpReg = this.setReg
      console.log(tmpReg)
      // this.messageB = this.messageB.replace(tmpReg, '<span class="tagSpan">aaa</span>')
      /*
      this.messageB = this.messageB.replace(tmpReg, (match) => {
        return `<span class='tagSpan'>${match}</span>`
      })
      */
      if (tmpReg) {
        this.messageB = this.messageF
                        // .replace(/\r|\n|\r\n/g, '<br>')
                        .replace(tmpReg, (match) => {
                          return `<span class='tagSpan'>${match}</span>`
                        }).replace(/\r|\n|\r\n/g, '<br>')
      } else {
        this.messageB = this.messageF.replace(/\r|\n|\r\n/g, '<br>')
      }

      // this.messageB = this.messageF

      return this.messageB
    },
    rawTags: function () {
      // this.rawTags = this.messageF.match(/@#(?:.*?)#@/g)
      return this.messageF.match(/@#(?:.*?)#@/g)
    },
    setReg: function () {
      if (this.rawTags) {
        // this.tagReg = new RegExp('(' + this.rawTags.join('|') + ')', 'g')
        return (new RegExp('(' + this.rawTags.join('|') + ')', 'g'))
      } else {
        return null
      }
    }
  },
  methods: {
    setMessage: function (e) {
      console.log(e.target.innerText)
      // this.messageF = e.target.innerHTML // like `<div>aaa</div>`
      // this.messageF = e.target.textContent // this is text without newlines
      this.messageF = e.target.innerText
      // let tmpTags = this.messageF.match(/@#(?:.*?)#@/g)
      // this.rawTags = tmpTags || []
      // this.tagReg = new RegExp('(' + this.rawTags.join('|') + ')', 'g')
      // this.canRowTags()
    },
    scanRowTags: function (e) {
      /* eg: Tested at http://regex-testdrive.com/ja/dotest
        var str = `@#1234@#aaa#@1234@#aaa#@5678@#bbb#@\ncccd@dddd#@@#eee\nfff#@`
        str.match(/@#(?:.*?)#@/g)
        ["@#1234@#aaa#@", "@#aaa#@", "@#bbb#@"]
      */
      // this.rawTags = this.messageF.match(/@#(?:.*?)#@/g)
    }
  }
}

</script>
-->
<!--
<style media="screen">
  span.tagSpan{
    /* background: lavender; */
    /* background: MistyRose; */
    background: #ffd1cc;
    border: 0px solid #ffd1cc;
    position: relative;
    -moz-border-radius:    5px;
    -webkit-border-radius: 5px;
    border-radius:         5px;
  }
</style>

<style scoped>
  div{
    border-radius:5px;
    float:left;
    /*position:relative;*/
  }

  div.parient{
    position:relative;
    width:90%;
    border: 2px solid Cyan;
    padding: 0px;
    text-align:center;
    overflow-x: hidden; /* Hide horizontal scrollbar */
    overflow-y: scroll; /* Add vertical scrollbar */
  }

  div.editable{
  }

  div.front,div.back{
    text-align: left;
    width: 99%;
    height: 300px;
    border: 2px solid #ccc;
    padding: 5px;
    top:0px;
    left:50%;
    margin-right: -50%;
    transform: translateX(−50%);
    -webkit-transform: translateX(-50%);
    /*right: 0px;*/
  }

  div.front{
    position:relative;
    z-index:10;
  }

  div.back{
    position:absolute;
    /*margin-left:-40%;*/
    z-index:-1;
    color: rgba(0,0,0,0.25);
  }

</style>
-->
