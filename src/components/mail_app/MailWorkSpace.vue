<template>
  <div class="mail_app uk-flex uk-grid uk-grid-small uk-grid-match" data-uk-grid-match="{target:'.uk-panel'}" data-uk-grid-margin="">
    <div class="selectedTagStyles" style="display:none">
    </div>
    <div class="uk-width-large-1-2 uk-width-medium-1-1 uk-width-1-1">
      <div class="workspace_wrap uk-panel">
        <div class="adress" style="padding:0;padding-bottom:2px;">
          <div class="adress-inner-div" style="">
            <table class="vmail_to_address">
              <tr>
                <td class="address_label">
                  <span>To:</span>
                </td>
                <td class="input_emails">
                  <span v-for="mail in toAddressAry" class="emails"
                    :class="mail.match(/@#(?:.*?)#@/)?'vmail_'+mail.replace(/@#|#@/g, '') : ''">{{ mail }}
                    <i class="uk-icon-hover uk-icon-times" @click="delEmail(mail, 'to', $event)"></i></span>
                  <span id="to_address" class="single-line" contentEditable="true" @focus="setLastFocusId" @keydown.enter.stop="addEmail(null, 'to', $event)">
                    <!-- <span @blur="setLastFocusId"></span> -->
                  </span>
                </td>
              </tr>
              </table>
              <table class="vmail_cc_address">
              <tr>
                <td class="address_label">
                  <span>CC:</span>
                </td>
                <td class="input_emails">
                  <span v-for="mail in ccAddressAry" class="emails">{{ mail }}
                    <i class="uk-icon-hover uk-icon-times" @click="delEmail(mail, 'cc', $event)"></i></span>
                  <span id="cc_address" class="single-line" contentEditable="true" @focus="setLastFocusId" @keydown.enter.stop="addEmail(null, 'cc', $event)">
                    <!-- <span @blur="setLastFocusId"></span> -->
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

            <table class="vmail_subject" style="margin-top:2px;">
              <tr>
                <td class="address_label">
                  <span>Sub:</span>
                </td>
                <td class="input_emails subject-warp">
                  <span id="subject" contentEditable="true" @focus="setLastFocusId" @keyup="setMessage">
                    This Is An Awsome Demo!
                    <!-- <span @blur="setLastFocusId"></span> -->
                  </span>
                  <span id="subject-back" v-html="subjectBack"></span>
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
          <div id="div_f" class="editable front" contentEditable="true" @keyup="setMessage" @blur="setLastFocusId">
            Hello @#targetName#@<br>This is @#myName#@<br>Vue.js Is Awsome!
          </div>
          <div id="div_b" class="editable back" v-html="backMessage"></div>
        </div>
        <div class="workspace-background uk-container-center uk-text-center uk-vertical-align">
          <img class="uk-vertical-align-bottom" src="../../assets/my-heraldry-mark.png" alt="my-heraldry-mark" />
        </div>
        <div class="toolBar">
          <button class="uk-button uk-button-primary" @click="saveMailToLocal">
            <i class="uk-icon-justify uk-icon-floppy-o"></i>
            <span class="vmail_label">Save!</span>
          </button>
          <button class="uk-button uk-button-danger"
          :disabled="isLocalTemplate? false : true"
          @click="delLocalMail">
            <i class="uk-icon-justify uk-icon-trash"></i>
            <span class="vmail_label">Del Local</span>
          </button>
          <select class="fixedPhrase" id="mailTempSelect" v-model="selectedMailTemp">
            <option :value="index"
            v-for="(fixedPhrase, index) in fixedPhraseAry">
            {{ fixedPhrase.name }}{{ fixedPhrase['local'] ? ' (Local)' : ' (Remote)' }}
          </option>
          </select>

        </div>
      </div>
    </div>

    <div class="uk-width-large-1-4 uk-width-small-1-2 uk-flex-order-first-large">
      <div class="tagbar uk-panel">
        <div class="tags">
          <table style="border-collapse: collapse;" width="98%">
            <tr v-for="tag in tags" class="tagTableRow" :class="'vmail_'+tag">
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
          :disabled="selectedTags.length>0? false : true"
          @click="delTag">
            <i class="uk-icon-justify uk-icon-trash"></i>
            <span class="vmail_label">Delete</span>
          </button>
        </div>
      </div>
    </div>

    <div class="uk-width-large-1-4 uk-width-small-1-2 ">
      <MailRender class="uk-panel"
      :mail-tags="tags" :mail-template="messageF" :mail-reg="setReg" :mail-subjct-raw="mailSubjctRaw"
      :to-address-ary="toAddressAry" :cc-address-ary="ccAddressAry" :bcc-address-ary="bccAddressAry"></MailRender>
    </div>

  </div>

</template>

<script>
import insertTag from './helpers/insertTag.js'
import MailRender from './MailRender'
import fixedPhrase from '../../datas/fixed_phrase.json'

export default {
  name: 'MailWorkSpace',
  data () {
    return {
      messageF: 'Hello @#targetName#@\nThis is @#myName#@\nVue.js Is Awsome!',
      messageB: '',
      tags: ['targetName', 'targetEmail', 'myName'],
      selectedTags: [],
      toAddressAry: ['aaa@sample.com', '@#targetEmail#@'],
      ccAddressAry: ['ccc@sample.com'],
      bccAddressAry: ['eee@sample.com'],
      // toAddressRaw: '',
      // ccAddressRaw: '',
      // bccAddressRaw: '',
      mailSubjctRaw: 'This Is An Awsome Demo!',
      // fixedPhraseAry: fixedPhrase,
      localTemplatesAry: [],
      isLocalTemplate: false,
      templateName: '',
      selectedMailTemp: []
      // rawTags: [],
      // tagReg: null
    }
  },
  components: {
    // Hello,
    // World,
    // MailApp
    MailRender
  },
  computed: {
    // a computed getter
    // this may also be put in to `methods` but `computed` is better
    backMessage: function () {
      // `this` points to the vm instance
      // console.log(this.messageB)
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
    subjectBack: function () {
      let tmpReg = this.setReg
      let subjectBackMsg = ''
      if (tmpReg) {
        subjectBackMsg = this.mailSubjctRaw
                        // .replace(/\r|\n|\r\n/g, '<br>')
                        .replace(tmpReg, (match) => {
                          let tagName = match.replace(/@#|#@/g, '')
                          return `<span class='tagSpan vmail_${tagName}'>${match}</span>`
                        }).replace(/\r|\n|\r\n/g, '<br>')
      } else {
        subjectBackMsg = this.mailSubjctRaw.replace(/\r|\n|\r\n/g, '<br>')
      }
      return subjectBackMsg
    },
    rawTags: function () {
      // this.rawTags = this.messageF.match(/@#(?:.*?)#@/g)
      let tmpMessageTags = this.messageF.match(/@#(?:.*?)#@/g) || []
      let tmpSubjectTags = this.mailSubjctRaw.match(/@#(?:.*?)#@/g) || []
      let tmpMailTags = this.toAddressAry.filter((x, i, self) => {
        return x.match(/@#(?:.*?)#@/g)
      })
      tmpMailTags = tmpMailTags.concat(this.ccAddressAry.filter((x, i, self) => {
        return x.match(/@#(?:.*?)#@/g)
      }))
      // this.ccAddressAry.join(',') + this.bccAddressAry.join(',')
      // .match(/@#(?:.*?)#@/g) || []
      console.log(tmpMailTags)
      let tmpRawTags = tmpMessageTags.concat(tmpSubjectTags).concat(tmpMailTags)
      if (tmpRawTags[0]) {
        return tmpRawTags
      } else {
        return null
      }
      // return this.messageF.match(/@#(?:.*?)#@/g)
    },
    setReg: function () {
      if (this.tags[0]) {
        // this.tagReg = new RegExp('(' + this.rawTags.join('|') + ')', 'g')
        let tmpTagArry = this.tags.map((x, i, self) => {
          return `@#${x}#@`
        })
        // return (new RegExp('(' + this.rawTags.join('|') + ')', 'g'))
        return (new RegExp('(' + tmpTagArry.join('|') + ')', 'g'))
      } else {
        return null
      }
    },
    fixedPhraseAry: {
      get: function () {
        let remoteAry = fixedPhrase || []
        this.localTemplatesAry = JSON.parse(window.localStorage.getItem('localTemplates')) || []
        // console.log(remoteAry)
        // console.log(this.localTemplatesAry)
        // let localAry = JSON.parse(this.localTemplates) || []
        return remoteAry.concat(this.localTemplatesAry)
      },
      set: function (newLocalAry) {
        console.log('newLocalAry', newLocalAry)
        if (newLocalAry.length === undefined) {
          this.localTemplatesAry.push(newLocalAry)
        } else {
          this.localTemplatesAry = newLocalAry
        }
        // console.log(this.localTemplatesAry)
        let localTemplates = JSON.stringify(this.localTemplatesAry)
        window.localStorage.setItem('localTemplates', localTemplates)
      }
    }
  },
  methods: {
    setMessage: function (e) {
      console.log(e.target.innerText)
      // this.messageF = e.target.innerHTML // like `<div>aaa</div>`
      // this.messageF = e.target.textContent // this is text without newlines
      if (e.target.id === 'div_f') { // mail text
        this.messageF = e.target.innerText
      } else if (e.target.id === 'subject') {
        this.mailSubjctRaw = e.target.innerText
        // console.log(this.mailSubjctRaw)
      }
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
          // for subject
          this.mailSubjctRaw = this.mailSubjctRaw.replace(tmpReg, `@#${newTagLabel}#@`)
          let oldSub = document.getElementById('subject').innerHTML
          document.getElementById('subject').innerHTML = oldSub.replace(tmpReg, `@#${newTagLabel}#@`)
          this.toAddressAry = this.toAddressAry.map((x, i, self) => {
            if (x.match(tmpReg)) {
              return `@#${newTagLabel}#@`
            } else {
              return x
            }
          })
          this.ccAddressAry = this.ccAddressAry.map((x, i, self) => {
            if (x.match(tmpReg)) {
              return `@#${newTagLabel}#@`
            } else {
              return x
            }
          })
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
        let email = document.getElementById(lastFocusId).innerText.trim()
        switch (lastFocusId.toLowerCase()) {
          case 'to_address':
            // this.
            this.addEmail(email, 'to')
            break
          case 'cc_address':
            this.addEmail(email, 'cc')
            break
          case 'subject':
            this.mailSubjctRaw = email
            break
          default:

        }
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
        let conf = window.confirm('Delete Selected Tags?\n' + `[ ${selectedTagArry.join(', ')} ]`)
        if (conf) {
          let tmpTagArry = selectedTagArry.map((x, i, self) => {
            return `@#${x}#@`
          })
          let tmpReg = new RegExp('(' + tmpTagArry.join('|') + ')', 'g')
          // reset messageF
          let oldHtml = document.getElementById('div_f').innerHTML
          document.getElementById('div_f').innerHTML = oldHtml.replace(tmpReg, ``)
          this.messageF = document.getElementById('div_f').innerText
          // for subject
          // this.mailSubjctRaw = this.mailSubjctRaw.replace(tmpReg, ``)
          let oldSub = document.getElementById('subject').innerHTML
          document.getElementById('subject').innerHTML = oldSub.replace(tmpReg, ``)
          this.mailSubjctRaw = document.getElementById('subject').innerText
          // to cc
          this.toAddressAry = this.toAddressAry.filter((x, i, self) => {
            if (x.match(tmpReg)) {
              return false
            } else {
              return x
            }
          })
          this.ccAddressAry = this.ccAddressAry.filter((x, i, self) => {
            if (x.match(tmpReg)) {
              return false
            } else {
              return x
            }
          })
          this.scanTags()

          this.tags = this.tags.filter(function (x, i, self) {
            return selectedTagArry.indexOf(x) === -1
          })
          this.selectedTags = []
          console.log(this.selectedTags)
          console.log(this.tags)
        }
      }
    },
    setMailInfo: function (e) {
      switch (e.target.id) {
        case 'to_address':
          this.toAddressRaw = e.target.innerText
          break
        case 'cc_address':
          this.ccAddressRaw = e.target.innerText
          break
        case 'subject':
          this.mailSubjctRaw = e.target.innerText
          break
        default:
          return false
      }
      console.log(e.target.id, this.toAddressRaw)
    },
    addEmail: function (email, position, e) {
      if (!email) {
        email = e.target.innerText.trim()
      }
      let targetId = window.sessionStorage.getItem('lastFocusId')
      let mailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      console.log(email, position)
      if (email.match(mailReg) || email.match(/@#(?:.*?)#@/)) {
        switch (position.toLowerCase()) {
          case 'to':
            this.toAddressAry.push(email)
            // e.target.textContent = ''
            document.getElementById(targetId).innerText = ''
            break
          case 'cc':
            this.ccAddressAry.push(email)
            document.getElementById(targetId).innerText = ''
            break
          default:

        }
        this.scanTags()
      }
    },
    delEmail: function (email, position, e) {
      console.log(position, email)
      switch (position.toLowerCase()) {
        case 'to':
          this.toAddressAry.splice(this.toAddressAry.indexOf(email), 1)
          break
        case 'cc':
          this.ccAddressAry.splice(this.ccAddressAry.indexOf(email), 1)
          break
        default:

      }
    },
    saveMailToLocal: function (e) {
      console.log('saveMailToLocal')
      let newLocalmailName = window
      .prompt(`Please Set New Title\nRemain ${15 - this.localTemplatesAry.length} Slots`, 'Sample Template')
      let duplicateName = this.fixedPhraseAry.filter((x, i, self) => {
        return x.name === newLocalmailName
      })
      if (!duplicateName[0]) {
        let newLocalmail = {
          name: newLocalmailName,
          local: true,
          to: this.toAddressAry,
          cc: this.ccAddressAry,
          bcc: this.bccAddressAry,
          subject: this.mailSubjctRaw,
          mailText: this.messageF
        }
        this.fixedPhraseAry = newLocalmail
      } else {
        window.alert(`The Name [[ ${newLocalmailName} ]] Has Been Used!\nPlease Try a New Name.`)
      }
    },
    delLocalMail: function (e) {
      let confirm = window.confirm(`Do You Want To Delete This Mail Template\n [[ ${this.templateName} ]]`)
      if (confirm) {
        this.fixedPhraseAry = this.localTemplatesAry.filter((x, i, self) => {
          return x.name !== this.templateName
        })
        // reset select
        document.querySelector('#mailTempSelect option').selected = true
        this.selectedMailTemp = 0
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
    },
    selectedMailTemp: function (val) {
      console.log('selectedMailTemp', this.selectedMailTemp)
      console.log(this.fixedPhraseAry[val].to)
      this.tags = []
      let tmpMailObj = this.fixedPhraseAry[val]
      this.isLocalTemplate = tmpMailObj['local']
      this.templateName = tmpMailObj['name']
      this.toAddressAry = tmpMailObj['to'] || []
      this.ccAddressAry = tmpMailObj['cc'] || []
      this.bccAddressAry = tmpMailObj['bcc'] || []
      document.getElementById('subject').innerText = tmpMailObj['subject']
      this.mailSubjctRaw = document.getElementById('subject').innerText
      document.getElementById('div_f').innerText = tmpMailObj['mailText']
      this.messageF = document.getElementById('div_f').innerText
      this.scanTags()
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
  [contenteditable="true"].single-line {
    white-space: nowrap;
    width:200px;
    overflow: hidden;
    height: auto;
  }
  [contenteditable="true"].single-line br {
    display:none;
  }
  [contenteditable="true"].single-line * {
    display:inline;
    white-space:nowrap;
  }

  /* for all panels */
  div.uk-panel{
    border: 1px solid #b4d575;
    border-top: 3px solid #b4d575;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
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
    /*border: 1px solid green;*/
    /*width: calc(80% - 350px);*/
    /*min-width: 250px;*/
    /*max-width: 600px;*/
    padding-left: 8px;
    padding-right: 8px;
    /*height: 455px;*/
    height: auto;
    padding-bottom: 45px;
  }
  /*
  div.workspace_wrap:after{
    content: ".";
    display: block;
    clear: both;
    height: 0;
    visibility: hidden;
  }*/

  div.tags, div.workspace{
    overflow-x: hidden; /* Hide horizontal scrollbar */
    overflow-y: scroll; /* Add vertical scrollbar */
  }
  div.tagbar{
    position: relative;
    float: left;
    /*border: 1px solid magenta;*/
    /*margin-left: -10px;*/
    margin-right: 8px;
    padding-left: 8px;
    /*width: 15%;
    min-width:180px;
    max-width:20vw;
    height: 455px;*/
  }
  div.tags{
    border: 0.5px dashed #e7e088;
    box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    /*border-top: 2px solid #f16e2f;*/
    width: 95%;
    padding:5px;
    padding-left: 5px;
    height: calc(99% - 45px);
    text-align: left;
    overflow-x: scroll;
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
    width: 50%;
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
    /*height: 58%;*/
    height: 47vh;
    /*border: 0.5px solid Cyan;*/
    border: 1px dashed #e7e088;
    box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    padding: 0px;
    text-align:center;
  }


  div.front, div.back, div.workspace-background{
    text-align: left;
    width: 99%;
    height: 95%;

    /*border: 2px solid #ccc;*/
    padding: 5px;
    padding-left: 10px;
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
  div#div_f:focus{
    outline: 0;
  }
  div.front:focus{
    /*background: yellow;*/
  }

  div.back, div.workspace-background{
    position:absolute;
    /*margin-left:-40%;*/
    z-index:-1;
    color: rgba(0,0,0,0.25);
    word-break: break-all;
  }
  div.workspace-background{
    position: absolute;
    height: 100%;
    z-index:-5;
    /*background: url('../../assets/logo.png') no-repeat center center;*/
    opacity: 0.1;
  }
  div.workspace-background>img{
    margin-bottom: 60px;

  }

  select.fixedPhrase{
    height: 30px;
    margin-top: 5px;
    margin-right: 10px;
    float: right;
    width: 40%;
    min-width: 80px;
    font-weight: bold;
    color: #555;
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

  div.adress{
    width:98%;
    min-width:250px;
    max-width:none;
  }
  div.adress-inner-div{
    /*padding-left: 5px;
    padding-right: 5px;*/
    padding: 5px;
    padding-top: 2px;
    margin-bottom: 2px;
    width:calc(100%);

    /*border: 0.5px solid #ffd1cc;*/
    border: 0.5px dashed #e7e088;
    /*box-shadow: 0 1px 1px rgba(0,0,0,0.1);*/
    float:none;
  }
  .adress-inner-div>table{
    width: 98%;
  }
  div.adress table td>span{
    font-weight: bold;
  }
  div.adress table td span[contentEditable="true"],.emails{
    /* border-bottom: 0.5px solid #aaa; */
    float: left;
    /* width: 40vw; */
    width: auto;
    text-align: left;
    padding-left: 3px;
    /*padding-bottom: -1.5px;*/
  }
  div.adress table td span[contentEditable="true"]{
    max-width: 420px;
    min-width:150px;
  }
  div.adress table td.input_emails{
    border-bottom: 0.5px solid #aaa;
    width: calc(100% - 40px);
  }
  span.emails{
    display: inline-block;
    border-radius: 5px;
    border: none;
    padding-right: 3px;
    margin-right: 2px;
    margin-top: 2px;
    /*background: MistyRose;*/
    background: lavenderBlush;
  }
  span[contenteditable="true"].single-line{
    margin-left: 5px;
    border: 0.5px solid MistyRose;
    border-radius: 5px;
    margin-top: 2px;
  }
  td.subject-warp{
    position:relative;
  }
  span#subject{
    position:relative;
    z-index:10;
    max-width: 100%;
    width: 99%;
  }
  span#subject-back{
    text-align: left;
    position:absolute;
    top: auto;
    left: auto;
    left: 3.8px;
    /*margin-left:-80%;*/
    z-index:-1;
    color: rgba(0,0,0,0.25);
    word-break: break-all;
  }

  div.adress table td.address_label{
    width: 40px;
  }

</style>
