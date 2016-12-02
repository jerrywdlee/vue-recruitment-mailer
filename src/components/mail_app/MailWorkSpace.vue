<template>
  <div class="mail_app">
    <div class="tagbar">
      <div class="tags">
        <table>
          <tr v-for="tag in tags">
            <td>{{ tag }}</td>
            <td>del</td>
            <td>edit</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="workspace">
      <div id="div_f" class="editable front" contentEditable="true" @keyup="setMessage"></div>
      <div id="div_b" class="editable back" v-html="backMessage"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MailWorkSpace',
  data () {
    return {
      messageF: 'Plz \n Type \n Sth.',
      messageB: '',
      tags: ['aaa', 'bbb']
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
      // eventHub.$emit('backMessage',this.messageB)
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
      this.scanTags()
      // let tmpTags = this.messageF.match(/@#(?:.*?)#@/g)
      // this.rawTags = tmpTags || []
      // this.tagReg = new RegExp('(' + this.rawTags.join('|') + ')', 'g')
      // this.canRowTags()
    },
    scanTags: function (e) {
      /* eg: Tested at http://regex-testdrive.com/ja/dotest
        var str = `@#1234@#aaa#@1234@#aaa#@5678@#bbb#@\ncccd@dddd#@@#eee\nfff#@`
        str.match(/@#(?:.*?)#@/g)
        ["@#1234@#aaa#@", "@#aaa#@", "@#bbb#@"]
      */
      // this.rawTags = this.messageF.match(/@#(?:.*?)#@/g)
      let tmpRawTags = this.rawTags ? this.rawTags.map(function (x, i, self) {
        return x.replace(/@#|#@/g, '')
      }) : []
      let tmpTagArry = this.tags.concat(tmpRawTags)
      this.tags = tmpTagArry.filter(function (x, i, self) {
        return self.indexOf(x) === i // delete duplicates
      })
      console.log(this.tags)
      return this.tags
    }
  }
}

</script>
<style media="screen">
  span.tagSpan{
    /* background: lavender; */
    /* background: MistyRose; */
    background: #ffd1cc;
    border: 0px solid #ffd1cc;
    position: relative;
    -moz-border-radius:    10px;
    -webkit-border-radius: 10px;
    border-radius:         10px;
  }
</style>

<style scoped>
  div{
    border-radius:5px;
    float:left;
    padding:10px;
    /*position:relative;*/
  }
  div.mail_app{
    width:100%;
  }
  div.tags, div.workspace{
    overflow-x: hidden; /* Hide horizontal scrollbar */
    overflow-y: scroll; /* Add vertical scrollbar */
  }
  div.tagbar{
    border: 2px solid magenta;
    margin-right: 10px;
    padding-left: 3px;
    min-width:100px;
    max-width:none;
    height: 293px;
  }
  div.tags{
    border: 0.5px solid red;
    width: 95%;
    padding:5px;
    height: 200px;
    text-align: left;
  }
  div.workspace{
    position:relative;
    width:80%;
    min-width:300px;
    max-width:none;
    border: 2px solid Cyan;
    padding: 0px;
    text-align:center;
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
