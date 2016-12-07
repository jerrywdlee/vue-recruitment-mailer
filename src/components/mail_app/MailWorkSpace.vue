<template>
  <div class="mail_app">
    <div class="selectedTagStyles">
    </div>
    <div class="tagbar">
      <div class="tags">
        <table style="border-collapse: collapse;">
          <tr v-for="tag in tags" class="tagTableRow">
            <td >
              <span class="tagLabel"
              @keydown.enter="renewTags(tag, $event)"
              @blur="renewTags(tag, $event)"
              @dblclick="editTag( tag )"
              :id="'vmail_tag_'+tag">
              {{ tag }}
              </span>
            </td>
            <td>
              <input type="checkbox" :value="tag" v-model="selectedTags">
            </td>
            <td style="padding-top:3.6px;padding-left:6px;">
              <a href="javascript:void(0);" class="uk-icon-hover uk-icon-edit" @click="editTag( tag )"></a>
            </td>
            <td style="padding-top:2.5px;padding-left:6px;">
              <a href="javascript:void(0);" class="uk-icon-hover uk-icon-sign-in" @click="insertTag( tag )"></a>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <input type="text" placeholder="New Tag" style="width:95%" @keydown.enter="addTag($event)">
            </td>
            <!--
            <td style="padding-top:2.5px;padding-left:3px;">
              <a class="uk-icon-hover uk-icon-plus-square" style="font-size:1.5em;"></a>
            </td>
            -->
          </tr>
        </table>
      </div>
      <div class="toolBar">
        <button class="uk-button uk-button-danger"
        :disabled="selectedTags[0]? false : true"
        @click="delTag">
          <i class="uk-icon-justify uk-icon-trash"></i>
          <span class="vmail_label">Delete</span>
        </button>
      </div>
    </div>
    <div class="workspace_wrap">
      <div class="adress" style="padding:0;padding-bottom:2px;">
        <div style="width:inherit;border: 0.5px solid #ffd1cc;float:none;">
          <table>
            <tr>
              <td class="address_label">
                <span>To:</span>
              </td>
              <td>
                <span id="to_address" contentEditable="true" @blur="setLastFocusId">
                  aaa@example.com
                </span>
              </td>
            </tr>
            <tr>
              <td class="address_label">
                <span>CC:</span>
              </td>
              <td>
                <span id="cc_address" contentEditable="true" @blur="setLastFocusId">
                  bbb@example.com
                </span>
              </td>
            </tr>
          </table>
            <!--
            <span>To:</span>
            <span id="to_address" contentEditable="true" @blur="setLastFocusId">
              aaa@example.com</span>
            -->
              <!--
              <input id="to_address" type="text" name="name" value="aaa@example.com">
            -->

            <!--
            <span>CC:</span> <span>bbb@example.com</span>
            <span>Bcc:</span> <span>bbb@example.com</span>
          -->
        </div>
        <!--
        <div style="width:inherit;border: 0.5px solid #ffd1cc;float:none;margin-top:2px;">
          <span>CC:</span>
          <span id="cc_address" contentEditable="true" @blur="setLastFocusId">
            bbb@example.com
          </span>
        </div>
      -->
        <div style="width:inherit;border: 0.5px solid #ffd1cc;margin-top:2px;">
          <table>
            <tr>
              <td class="address_label">
                <span>Sub:</span>
              </td>
              <td>
                <span id="subject" contentEditable="true" @blur="setLastFocusId">
                  AAAAAA
                </span>
              </td>
            </tr>
          </table>
          <!--
            <span>Sub:</span>
            <span id="subject" contentEditable="true" @blur="setLastFocusId">
              AAAAAA
            </span>
          -->
        </div>
      </div>
      <div class="workspace">
        <div id="div_f" class="editable front" contentEditable="true" @keyup="setMessage" @blur="setLastFocusId"></div>
        <div id="div_b" class="editable back" v-html="backMessage"></div>
      </div>
      <div class="toolBar">

      </div>
    </div>

  </div>
</template>

<script>
import insertTag from './insertTag.js'

export default {
  name: 'MailWorkSpace',
  data () {
    return {
      messageF: 'Plz \n Type \n Sth.',
      messageB: '',
      tags: ['targetName', 'targetEmail', 'myName'],
      selectedTags: []
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
                          let tagName = match.replace(/@#|#@/g, '')
                          return `<span class='tagSpan vmail_${tagName}'>${match}</span>`
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
    scanTags: function () {
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
    },
    editTag: function (tagName) {
      console.log(tagName)
      // console.log(document.getElementById('vmail_tag_' + tagName))
      let tagLabel = document.getElementById('vmail_tag_' + tagName)
      console.log(tagLabel.contentEditable)
      tagLabel.style.backgroundColor = 'OldLace'
      tagLabel.contentEditable = true
      tagLabel.focus()
    },
    renewTags: function (tagName, e) {
      let newTagLabel = e.target.innerText
      console.log(newTagLabel)
      console.log(tagName)
      if (newTagLabel !== '' && newTagLabel !== tagName) {
        console.log('Yes!')
        // openModal()
        // this.$emit('openModal', 'AAA', 'BBB')
        let con = window.confirm(`Do you want to Change All Tags In Text? \n   ${tagName} => ${newTagLabel}`)
        if (con) {
          e.target.contentEditable = false
          e.target.style.backgroundColor = 'transparent'
          this.tags.forEach((x, i, array) => {
            if (x === tagName) { array[i] = newTagLabel }
          })
          let tmpReg = new RegExp(`@#${tagName}#@`, 'g')
          // this.messageF = this.messageF.replace(`@#${tagName}#@`, `@#${newTagLabel}#@`)
          this.messageF = this.messageF.replace(tmpReg, `@#${newTagLabel}#@`)
          let oldHtml = document.getElementById('div_f').innerHTML
          document.getElementById('div_f').innerHTML = oldHtml.replace(tmpReg, `@#${newTagLabel}#@`)
          this.scanTags()
          console.log(this.tags)
        } else {
          e.target.contentEditable = false
          e.target.style.backgroundColor = 'transparent'
          e.target.innerText = tagName
        }
      } else {
        console.log('No!')
        e.target.contentEditable = false
        e.target.style.backgroundColor = 'transparent'
        e.target.innerText = tagName
      }
    },
    insertTag: function (msg) {
      console.log(insertTag)
      // let target = document.getElementById('div_f')
      let lastFocusId = window.sessionStorage.getItem('lastFocusId')
      console.log('lastFocusId', lastFocusId)
      if (lastFocusId !== 'div_f') {
        let target = document.getElementById(lastFocusId)
        target.focus()
        insertTag.insertHtmlAtCurrent(`@#${msg}#@`)
      } else {
        lastFocusId = 'div_f'
        let target = document.getElementById(lastFocusId)
        target.focus()
        insertTag.insertHtmlAtCurrent(`@#${msg}#@`)
        this.messageF = target.innerText
        this.scanTags()
      }
    },
    setLastFocusId: function (e) {
      console.log('setLastFocusId', e.target.id)
      window.sessionStorage.setItem('lastFocusId', e.target.id)
    },
    addTag: function (e) {
      this.tags.push(e.target.value)
      e.target.value = ''
      this.scanTags()
    },
    delTag: function () {
      let selectedTagArry = this.selectedTags
      if (selectedTagArry === []) {
        window.alert('Plz Select At Least 1 Tag.')
      } else {
        this.tags = this.tags.filter(function (x, i, self) {
          return selectedTagArry.indexOf(x) === -1
        })
        this.selectedTags = []
        console.log(this.selectedTags)
        console.log(this.tags)
      }
    }
  },
  watch: {
    selectedTags: function (val) {
      let selectedTagClasses = val.map(function (x, i, self) {
        return 'vmail_' + x
      }).join(',.')
      console.log(selectedTagClasses)
      if (selectedTagClasses !== '') {
        console.log(`<style>.${selectedTagClasses}{background: #ffd1cc;}</style>`)
        document.querySelector('.selectedTagStyles')
        .innerHTML = `<style>.${selectedTagClasses}{background: #ffd1cc !important;}</style>`
      } else {
        document.querySelector('.selectedTagStyles')
        .innerHTML = ``
      }
    }
  }
}

</script>

<style media="screen">
  span.tagSpan{
    /* background: lavender; */
    /* background: MistyRose; */
    /* background: #ffd1cc; */
    background: #BFE6D0;
    border: 0px solid #ffd1cc;
    position: relative;
    -moz-border-radius:    10px;
    -webkit-border-radius: 10px;
    border-radius:         10px;
  }
  span.tagLabel {
    -moz-border-radius:    5px;
    -webkit-border-radius: 5px;
    border-radius:         5px;
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
  div.workspace_wrap{
    position: relative;
    border: 1px solid green;
    width: 70vw;
    min-width: 250px;
    /*max-width: 350px;*/
    padding-left: 4.5px;
    height: 395px;
  }
  div.tags, div.workspace{
    overflow-x: hidden; /* Hide horizontal scrollbar */
    overflow-y: scroll; /* Add vertical scrollbar */
  }
  div.tagbar{
    position: relative;
    float: left;
    border: 1px solid magenta;
    margin-left: -10px;
    margin-right: 10px;
    padding-left: 3px;
    min-width:120px;
    max-width:20vw;
    height: 395px;
  }
  div.tags{
    border: 0.5px solid red;
    width: 95%;
    padding:5px;
    padding-left: 3px;
    height: 87%;
    text-align: left;
  }
  .tagTableRow{
    -moz-border-radius:    5px;
    -webkit-border-radius: 5px;
    border-radius:         5px;
    background:       lavender;
    padding-bottom: 1px;
    border-bottom: 1px solid #FFF;
    /* border: 0.5px solid red; */
  }
  .tagTableRow>td:first-child{
    /* border: 0.5px solid red; */
    -moz-border-radius:    8px 0 0 8px;
    -webkit-border-radius: 8px 0 0 8px;
    border-radius:         8px 0 0 8px;
    padding-left: 5px;
  }
  .tagTableRow>td:last-child{
    -moz-border-radius:    0 8px 8px 0;
    -webkit-border-radius: 0 8px 8px 0;
    border-radius:         0 8px 8px 0;
    padding-right: 5px;
  }
  td>input{
    -moz-border-radius:    3px;
    -webkit-border-radius: 3px;
    border-radius:         3px;
    border: 0.5px solid #ccc;
  }
  div.workspace{
    position:relative;
    width:100%;
    min-width:250px;
    max-width:none;
    height: 63%;
    border: 0.5px solid Cyan;
    padding: 0px;
    text-align:center;
  }


  div.front,div.back{
    text-align: left;
    width: 99%;
    height: inherit;
    /*border: 2px solid #ccc;*/
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
  div.front:focus{
    /*background: yellow;*/
  }

  div.back{
    position:absolute;
    /*margin-left:-40%;*/
    z-index:-1;
    color: rgba(0,0,0,0.25);
  }

  div.toolBar{
    border-radius:0 0 5px 5px;
    padding: 0;
    background: #ecf0f5;
    height: 40px;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  div.toolBar button{
    margin-top: 5px;
    margin-right: 10px;
    float: right;
  }

  div.adress table td span[contentEditable="true"]{
    border-bottom: 0.5px solid #555;
    float: left;
    /*padding-bottom: -1.5px;*/
  }
  div.adress table td.address_label{
    width: 40px;
  }
  div.adress table td>span{
    font-weight: bold;
  }
</style>
