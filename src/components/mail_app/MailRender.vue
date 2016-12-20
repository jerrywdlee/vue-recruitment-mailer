<template>
  <div class="mailRender">
    <!--
    <h1>{{ msg }}</h1>
  -->
    <div class="tagInputSpace">
      <table width="98%" style="border-collapse: collapse;">
        <tr v-for="tag in mailTags" class="tagTableRow" :class="'vmail_'+tag">
          <td class="tagLabel">
            <span class="tagLabel">
            {{ tag }}
            </span>
          </td>
          <td><span style="font-size:1.2em;font-weight:bolder;"> &nbsp;:&nbsp;</span></td>
          <td class="tagContent">
            <input type="text" :id="'set_vmail_tag_'+tag" @keyup="setInfoTag" >
            <!--
            <input type="text" :value="tag" v-model="selectedTags">
          -->
          </td>
          <!--
          <td style="padding-top:3.6px;padding-left:6px;">
            <a href="javascript:void(0);" class="uk-icon-hover uk-icon-edit" ></a>
          </td>
          <td style="padding-top:2.5px;padding-left:6px;">
            <a href="javascript:void(0);" class="uk-icon-hover uk-icon-sign-in" ></a>
          </td>
        -->
        </tr>
      </table>
    </div>
    <!--
    <p>
      {{ mailTags }}
    </p>
    <p>
      {{ mailTemplate }}
    </p>
    <p>
      {{ mailReg ? mailReg.toString() : 'Null' }}
    </p>
    <p>{{ mailSubjctRaw }}</p>
  -->
    <div class="toolBar">
      <button type="button" class="uk-button uk-button-warning"
      style="float:left" @click="setCsv">
        <i class="uk-icon-justify uk-icon-th-list"></i>
        <span class="vmail_label"> Batch!</span>
      </button>
      <button class="uk-button uk-button-success"
      @click="renderMail('dirInput', $event)">
        <i class="uk-icon-justify uk-icon-envelope"></i>
        <span class="vmail_label"> Create!</span>
      </button>
    </div>

    <!-- Modal component -->
      <!-- to use uikit default modal animations, toggle 'uk-open':'uk-close' during modal is exsit -->
      <transition v-on:after-enter="afterEnter" v-on:before-leave="beforeLeave">
        <!-- mailto_send -->
        <template v-if="modalType === 'mailto_send'">
          <div class="uk-modal" :class="modalShown?'uk-open':'uk-close'" style="display:block" @click.self="closeModal">
            <div class="uk-modal-dialog">
              <button type="button" class="uk-modal-close uk-close" @click="closeModal"></button>
          <!-- Header -->
          <div class="uk-modal-header" >
            <div class="header-wrapper">
              &nbsp;&nbsp;<b>Subject:</b> <i>{{ mailSubjct }}</i>
              【 <b>Mail To:</b> <i>{{ toAddress[0] }}...</i> 】
            </div>
            <span class="header-html-insert-target"></span>
          </div>
          <!-- Body -->
          <div class="my-modal-body">
            <div class="mail-rendering-box" v-html="mailTextToShow"></div>
            <span class="body-html-insert-target"></span>
          </div>
          <!-- Footer -->
          <div class="uk-modal-footer uk-text-right" >
            <button type="button" class="uk-button" @click="closeModal">Cancel</button>
            <a class="uk-button uk-button-success" :href="modalButtonHref">
              <i class="uk-icon-justify uk-icon-paper-plane"></i>
              <span class="vmail_label"> Send!</span>
            </a>
          </div>
        </div>
      </div>
      </template>

      <!-- set_csv -->
      <template v-if="modalType === 'set_csv' || modalType === 'rendering_csv'">
        <div class="uk-modal" :class="modalShown?'uk-open':'uk-close'" style="display: block;" @click.self="closeModal">
          <div class="uk-modal-dialog" style="min-width:95vw;">
            <button type="button" class="uk-modal-close uk-close" @click="closeModal"></button>
          <!-- Header -->
          <div class="uk-modal-header" style="padding-top:15px;padding-bottom:12px;" >
            <div class="header-wrapper">
              <b style="font-size:1.7em;color:#35495e;">Render From Table or CSV</b>
            </div>
          </div>
          <!-- Body -->
          <div class="my-modal-body" >
            <span class="body-html-insert-target">
              <!--
              <span style="font-weight:bold;font-size:1.2em;font-style: oblique;">
                Please Just Paste DataTable Here:
              </span>
            -->
            </span>
            <ul class="uk-tab uk-tab-flip" data-uk-tab="">
              <span v-html="csvRenderingLabel" style="font-weight:bold;font-size:1.2em;font-style: oblique;line-height: 200%;">
                Please Just Paste DataTable Here:
              </span>
              <li aria-expanded="false" :class="[infoTagObjAry[0]?'':'uk-disabled',modalType === 'rendering_csv'?'uk-active':'']">
                <a href="javascript:void(0)" @click="renderCsvMails">{{ infoTagObjAry.length }} Mail(s)</a>
              </li>
              <li :class="modalType === 'set_csv'? 'uk-active':''" aria-expanded="false">
                <a href="javascript:void(0)" @click="setCsv">Data Table</a>
              </li>
            </ul>
            <!-- csv paste area -->
            <template v-if="modalType === 'set_csv'">
              <div class="csv-input-box" id="csv-input-box" contenteditable="true" @keydown="getTmpInputedCsv" @blur="getTmpInputedCsv">
                <table>
                  <tr>
                    <th style="padding-left:5px;padding-right:5px;"
                      v-for="tag in mailTags">{{ tag }}</th>
                  </tr>
                </table>
              </div>
                <!-- Footer -->
              <div class="uk-modal-footer uk-text-right">
                <transition name="parser-warn">
                  <div class="parser-warn" v-if="parserWarnShow">
                    <span v-html="parserWarnMsg"></span>
                    <a class="uk-alert-close uk-close" @click="parserWarnShow = false"></a>
                  </div>
                </transition>
                <button type="button" class="uk-button uk-button-warning" @click="dowloadCsvFile" style="float:left">
                  <i class="uk-icon-justify uk-icon-cloud-download"></i>
                  Template CSV
                </button>
                <button type="button" class="uk-button" @click="closeModal">Cancel</button>
                <button type="button" class="uk-button uk-button-primary" @click="parseCsv">
                  <i class="uk-icon-justify uk-icon-bolt"></i>
                  Parse Table
                </button>
              </div>
            </template>

            <!-- csv mails rendering area -->
            <template v-if="modalType === 'rendering_csv' && infoTagObjAry.length > 0">
              <div class="csv-rendering-box" v-html="mailTextToShow">

              </div>
              <!-- Footer -->
              <div class="uk-modal-footer uk-text-center">
                <button type="button" class="uk-button" @click="setCsv" style="float:left">
                  <i class="uk-icon-justify uk-icon-th-list"></i>
                  Set Table
                </button>
                <button class="uk-button" :disabled="infoTagObjIndex<1" @click="infoTagObjIndex--">
                  <i class="uk-icon-backward"></i>&nbsp;<span>Prev</span>
                </button>
                <span class="csv-mail-number-label">{{ infoTagObjIndex + 1 }} / {{ infoTagObjAry.length }}</span>
                <button class="uk-button" :disabled="infoTagObjIndex>=infoTagObjAry.length-1" @click="infoTagObjIndex++">
                  <span>Next</span>&nbsp;<i class="uk-icon-forward"></i>
                </button>
                <a class="uk-button uk-button-success" :href="modalButtonHref" style="float:right">
                  <i class="uk-icon-justify uk-icon-paper-plane"></i>
                  <span class="vmail_label"> Send!</span>
                </a>
              </div>
            </template>
          </div>
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
  import renderTags from './helpers/renderTags.js'
  import modalHelper from './helpers/modalHelper.js'
  import csvHelper from './helpers/csvHelper.js'

  export default {
    name: 'mailRender',
    props: ['mailTags', 'mailTemplate', 'mailReg',
      'toAddressAry', 'ccAddressAry', 'bccAddressAry', 'mailSubjctRaw'],
    data () {
      return {
        infoTagObj: {}, // object for current render
        dirInputInfoTagObj: {}, // directed inputed render obj
        infoTagObjAry: [], // parsed from CSV
        infoTagObjIndex: -1, // CSV parsed index, -1 is no csv
        // toAddress: [],
        // ccAddress: [],
        // bccAddress: [],
        // mailSubjct: '',
        // mailText: '',
        /* **** modal show/hide control elements **** */
        /* modalDisplay: none(default), block */
        // modalDisplay: 'none',
        /* modalType: ''(default), mailto_send, set_csv , rendering_csv  */
        tmpInputedCsv: '', // remember inputed csv/table contents for show again
        modalType: '',
        csvRenderingLabel: '',
        modalShown: false,
        parserWarnShow: false,
        parserWarnMsg: ''
      }
    },
    computed: {
      mailText: function () {
        return renderTags.renderTags(this.mailReg, this.mailTemplate, this.infoTagObj)
      },
      mailSubjct: function () {
        return renderTags.renderTags(this.mailReg, this.mailSubjctRaw, this.infoTagObj)
      },
      toAddress: function () {
        let tmpAry = this.toAddressAry.map((x, i, self) => {
          return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
        }) || []
        return tmpAry
      },
      ccAddress: function () {
        let tmpAry = this.ccAddressAry.map((x, i, self) => {
          return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
        }) || []
        return tmpAry
      },
      bccAddress: function () {
        let tmpAry = this.bccAddressAry.map((x, i, self) => {
          return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
        }) || []
        return tmpAry
      },
      modalButtonHref: function () {
        let urlStr = 'mailto:'
        urlStr += (this.toAddress + '?')
        urlStr += ('cc=' + this.ccAddress + '&')
        // urlStr += ('bcc='+$('input[name=bcc]').val()+'&');
        urlStr += ('subject=' + encodeURI(this.mailSubjct) + '&')
        var bodyStr = (this.mailText).replace(/\r\n|\r|\n/g, '%0d%0a')
        urlStr += ('body=' + bodyStr)
        // console.log(urlStr)
        return urlStr
      },
      mailTextToShow: function () {
        let tmpMailText = '<table>'
        tmpMailText += `<tr><td><b>To: </b></td><td>${this.toAddress.join(', ')}</td></tr>`
        tmpMailText += `<tr><td><b>CC: </b></td><td>${this.ccAddress.join(', ')}</td></tr>`
        tmpMailText += `<tr><td><b>Subject: </b></td><td>${this.mailSubjct.replace(/\r|\n|\r\n/g, '<br>')}</td></tr>`
        tmpMailText += `<tr><td><b> </b></td></tr>`
        tmpMailText += `<tr><td colspan="2">${this.mailText.replace(/\r|\n|\r\n/g, '<br>')}</td></tr>`
        tmpMailText += `</table>`
        return tmpMailText
      }
    },
    methods: {
      setInfoTag: function (e) {
        // console.log(e.target.id, e.target.value)
        let tagName = e.target.id.replace('set_vmail_tag_', '')
        let tagVal = e.target.value
        // console.log(tagName, tagVal)
        this.dirInputInfoTagObj[tagName] = tagVal
        console.log(this.dirInputInfoTagObj)
      },
      renderMail: function (sendMethod, e) {
        console.log(this.toAddressRaw)
        switch (sendMethod) {
          case 'gmail':
            console.log('gmail')
            break
          case 'mailto':
          case 'dirInput':
          default:
            // this.mailText = renderTags.renderTags(this.mailReg, this.mailTemplate, this.infoTagObj)
            // this.mailSubjct = renderTags.renderTags(this.mailReg, this.mailSubjctRaw, this.infoTagObj)
            /*
            this.toAddress = this.toAddressAry.map((x, i, self) => {
              return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
            }) || []
            */
            /*
            this.ccAddress = this.ccAddressAry.map((x, i, self) => {
              return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
            }) || []
            this.bccAddress = this.bccAddressAry.map((x, i, self) => {
              return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
            }) || []
            */
            // this.toAddress = renderTags.renderTags(this.mailReg, this.toAddressRaw, this.infoTagObj)
            // this.ccAddress = renderTags.renderTags(this.mailReg, this.ccAddressRaw, this.infoTagObj)
            // this.bccAddress = renderTags.renderTags(this.mailReg, this.bccAddressRaw, this.infoTagObj)

            // let footerBtn = ''
            // footerBtn = `<button type="button" class="uk-button" @click="closeModal">Cancel</button>`
            /*
            footerBtn += `<a class="uk-button uk-button-success" href="${this.modalButtonHref}">
                          <i class="uk-icon-justify uk-icon-paper-plane"></i>&nbsp;Send!</a>`
            */
            this.infoTagObjIndex = -1 // reset if use input space
            this.infoTagObj = this.dirInputInfoTagObj
            this.modalType = 'mailto_send' // set modal footer mode to mailto mode
            // modalHelper.openModal('Mail To: ' + this.toAddress[0], this.mailText.replace(/\r|\n|\r\n/g, '<br>'), footerBtn)
            // modalHelper.openModal(null, this.mailText.replace(/\r|\n|\r\n/g, '<br>'), null)
            modalHelper.openModal(null, null, null)
            // this.modalDisplay = 'block'
            console.log('dirInput', this.mailText, this.mailSubjctRaw, this.mailSubjct)
        }
      },
      setCsv: function (e) {
        // console.log('setCsv')
        this.modalType = 'set_csv'
        this.csvRenderingLabel = 'Please Just Paste DataTable Here:'
        modalHelper.openModal(null, null, null)
        setTimeout(() => {
          this.setInputedContent()
        }, 150)
        // this.modalDisplay = 'block'
      },
      dowloadCsvFile: function (e) {
        let csvTempUrl = csvHelper.createCsvFile(this.mailTags)
        // console.log(csvTempUrl)
        csvHelper.downloadFile(csvTempUrl, `Template [${this.mailSubjctRaw}].csv`)
      },
      getTmpInputedCsv: function (e) {
        this.tmpInputedCsv = e.target.innerHTML
        // console.log(this.tmpInputedCsv)
      },
      setInputedContent: function (e) {
        // console.log('setInputedContent')
        if (this.tmpInputedCsv) {
          document.getElementById('csv-input-box').innerHTML = this.tmpInputedCsv
          // console.log('setInputedContent')
        }
      },
      parseCsv: function (e) {
        let csvInputBox = document.getElementById('csv-input-box')
        console.log(csvInputBox.innerText)
        // let tmpCsvObj
        csvHelper.parseCsv(csvInputBox.innerText, (data, e) => {
          console.log('callback:')
          console.log(data)
          // tmpCsvObj = data
          this.infoTagObjAry = data
          console.log(this.infoTagObjAry)
        })
        setTimeout(() => {
          if (this.infoTagObjAry.length > 0) {
            this.renderCsvMails()
            this.parserWarnShow = false
          } else {
            // window.alert('Nothing Detected...')
            this.parserWarnMsg = '<b>Whoops!</b> Nothing to parse...'
            this.parserWarnShow = true
            setTimeout(() => {
              this.parserWarnShow = false
            }, 10000)
          }
        }, 200)
      },
      renderCsvMails: function (e) {
        if (this.infoTagObjAry.length > 0) {
          if (this.infoTagObjIndex < 0) {
            this.infoTagObjIndex = 0
          }
          if (this.infoTagObjIndex >= this.infoTagObjAry.length) {
            this.infoTagObjIndex = this.infoTagObjAry.length
          }
          this.infoTagObj = this.infoTagObjAry[this.infoTagObjIndex]
          this.modalType = 'rendering_csv'
          this.csvRenderingLabel = `Subject: ${this.mailSubjct}`
        }
      },
      closeModal: function (e) {
        // modalHelper.closeModal().then(
          // this.modalDisplay = 'none'
        // )
        this.modalType = ''
      },
      afterEnter: function () {
        this.modalShown = true
      },
      beforeLeave: function () {
        this.modalShown = false
      }
    },
    watch: {
      infoTagObjIndex: function (val) {
        console.log('infoTagObjIndex', val)
        if (this.infoTagObjIndex >= 0) {
          this.infoTagObj = this.infoTagObjAry[this.infoTagObjIndex]
        } else {
          this.infoTagObj = this.dirInputInfoTagObj
        }
        // this.modalType = 'rendering_csv'
        this.csvRenderingLabel = `Subject: ${this.mailSubjct}`
      },
      mailTags: function (val) {
        // reset saved csv if tags changed
        this.tmpInputedCsv = ''
        // also reset render index
        this.infoTagObjIndex = -1
      }
    }
  }
</script>

<style media="screen">
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div.tagInputSpace div{
    border-radius:5px;
    float:left;
    padding:10px;
    padding-left: 8px;
    padding-right: 8px;
    /*position:relative;*/
  }
  div.mailRender{
    position: relative;
    /*height: 455px;*/
    /*border: 1px solid orange;*/
    /*margin-left: 10px;
    width: auto;*/
  }
  div.tagInputSpace{
    border-radius:5px;
    padding: 5px;
    /*border: 1px solid orange;*/
    border: 0.5px dashed #e7e088;
    box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    overflow-x: scroll;
    overflow-y: scroll;
    height: calc(99% - 45px);
    /*min-width: 200px;*/
  }
  a {
    /* color: #42b983; */
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
    /*width: 50%;*/
  }
  .tagTableRow>td:last-child{
    -moz-border-radius:    0 8px 8px 0;
    -webkit-border-radius: 0 8px 8px 0;
    border-radius:         0 8px 8px 0;
    padding-right: 5px;
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
    margin-left: 10px;
    float: right;
  }

  td.tagLabel{
    text-align: left;
  }
  span.tagLabel{
    /*font-weight: bold;*/
  }
  td.tagContent input{
    border-radius:3px;
    border: 1px solid #ccc;
    width: 95%;
  }

  div.my-modal-body{
    /*padding: 10px;*/
    text-align: left;
    /*overflow-x: none;
    overflow-y: scroll;*/
  }

  .csv-input-box, .csv-rendering-box, .mail-rendering-box{
    overflow-x: scroll;
    overflow-y: scroll;
    /*margin-top: 5px;*/
    min-height: 30vh;
    max-height: 53vh;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 1px 1px 3px 3px;
    border: 1px solid #ccc;
  }
  .csv-input-box{
    border-top: none;
  }
  .csv-rendering-box, .mail-rendering-box{
    padding: 10px;
    overflow-x: hidden;
    /*overflow-y: hidden;*/
  }
  .csv-mail-number-label{
    font-weight: bold;
    font-size: 1.2em;
    /*padding: 10px;*/
    padding-left: 10px;
    padding-right: 10px;
    /*display: inline-block;*/
    /*align-items: center;*/
  }
  .parser-warn{
    padding: 5px;
    /* padding-left: 15px; */
    /* margin-left: 15px; */
    /* margin-right: 10px;*/
    margin-top: -10px;
    margin-bottom: 10px;
    min-width: 30%;
    /* line-height: 28px; */
    /* min-height: 30px; */
    font-size: 1rem;
    border: 1px solid rgba(45, 112, 145, 0.3);
    border-radius: 4px;
    text-shadow: 0 1px 0 #ffffff;
    background: #fffceb;
    color: #e28327;
    border-color: rgba(226, 131, 39, 0.3);
  }
  .parser-warn>span{
    margin-left: 10px;
    margin-right: 10px;
  }

  .parser-warn-enter-active, .parser-warn-leave-active {
    transition: opacity .5s
  }
  .parser-warn-enter, .parser-warn-leave-active {
    opacity: 0
  }
</style>
