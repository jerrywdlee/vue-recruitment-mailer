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
        <i class="uk-icon-justify uk-icon-table"></i>
        <span class="vmail_label"> CSV</span>
      </button>
      <button class="uk-button uk-button-success"
      @click="renderMail('mailto', $event)">
        <i class="uk-icon-justify uk-icon-envelope"></i>
        <span class="vmail_label"> Create!</span>
      </button>
    </div>

    <!-- Modal component -->
    <div id="modal" class="uk-modal uk-close" :style="{display: modalDisplay}" @click.self="closeModal">
      <div class="uk-modal-dialog">
        <button type="button" class="uk-modal-close uk-close" @click="closeModal"></button>
        <!-- mailto_send -->
        <!-- Header -->
        <div class="uk-modal-header" v-if="modalFooter === 'mailto_send'">
          <div class="header-wrapper">
            &nbsp;&nbsp;<b>Subject:</b> {{ mailSubjct }}
            【 <b>Mail To:</b> {{ toAddress[0] }}... 】
          </div>
          <span class="header-html-insert-target"></span>
        </div>
        <!-- Body -->
        <div class="my-modal-body" v-if="modalFooter === 'mailto_send'">
          <span class="body-html-insert-target"></span>
        </div>
        <!-- Footer -->
        <div class="uk-modal-footer uk-text-right" v-if="modalFooter === 'mailto_send'">
          <button type="button" class="uk-button" @click="closeModal">Cancel</button>
          <a class="uk-button uk-button-success" :href="modalButtonHref">
            <i class="uk-icon-justify uk-icon-paper-plane"></i>
            <span class="vmail_label"> Send!</span>
          </a>
        </div>

        <!-- mailto_send -->
        <!-- Header -->
        <div class="uk-modal-header" style="padding-top:15px;padding-bottom:12px;" v-if="modalFooter === 'set_csv'">
          <div class="header-wrapper">
            <b style="font-size:1.7em;color:#35495e;">Setting CSV</b>
          </div>
        </div>
        <!-- Body -->
        <div class="my-modal-body" v-if="modalFooter === 'set_csv'">
          <span class="body-html-insert-target">
            <span style="font-weight:bold;font-size:1.2em;font-style: oblique;">
              Please Just Paste DataTable Here:
            </span>
          </span>
          <div class="csv-input-box" contenteditable="true">
            <table>
              <tr>
                <th style="padding-left:5px;padding-right:5px;"
                    v-for="tag in mailTags">{{ tag }}</th>
              </tr>
            </table>
          </div>
        </div>
        <!-- Footer -->
        <div class="uk-modal-footer uk-text-right" v-if="modalFooter === 'set_csv'">
          <div class="footer-wrapper" >
            <button type="button" class="uk-button" @click="dowloadCsvFile" style="float:left">Download CSV</button>
            <button type="button" class="uk-button" @click="closeModal">Cancel</button>
            <span class="footer-html-insert-target"></span>
          </div>
        </div>


      </div>
    </div>
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
        // msg: 'Welcome to Your Vue.js App',
        infoTagObj: {},
        modalDisplay: 'none',
        modalFooter: 'mailto_send',
        toAddress: [],
        ccAddress: [],
        bccAddress: [],
        mailSubjct: '',
        mailText: ''
      }
    },
    computed: {
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
      }
    },
    methods: {
      setInfoTag: function (e) {
        // console.log(e.target.id, e.target.value)
        let tagName = e.target.id.replace('set_vmail_tag_', '')
        let tagVal = e.target.value
        // console.log(tagName, tagVal)
        this.infoTagObj[tagName] = tagVal
        console.log(this.infoTagObj)
      },
      renderMail: function (sendMethod, e) {
        console.log(this.toAddressRaw)
        switch (sendMethod) {
          case 'gmail':
            console.log('gmail')
            break
          case 'mailto':
          default:
            this.mailText = renderTags.renderTags(this.mailReg, this.mailTemplate, this.infoTagObj)
            this.mailSubjct = renderTags.renderTags(this.mailReg, this.mailSubjctRaw, this.infoTagObj)

            this.toAddress = this.toAddressAry.map((x, i, self) => {
              return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
            }) || []
            this.ccAddress = this.ccAddressAry.map((x, i, self) => {
              return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
            }) || []
            this.bccAddress = this.bccAddressAry.map((x, i, self) => {
              return renderTags.renderTags(this.mailReg, x, this.infoTagObj)
            }) || []
            // this.toAddress = renderTags.renderTags(this.mailReg, this.toAddressRaw, this.infoTagObj)
            // this.ccAddress = renderTags.renderTags(this.mailReg, this.ccAddressRaw, this.infoTagObj)
            // this.bccAddress = renderTags.renderTags(this.mailReg, this.bccAddressRaw, this.infoTagObj)

            // let footerBtn = ''
            // footerBtn = `<button type="button" class="uk-button" @click="closeModal">Cancel</button>`
            /*
            footerBtn += `<a class="uk-button uk-button-success" href="${this.modalButtonHref}">
                          <i class="uk-icon-justify uk-icon-paper-plane"></i>&nbsp;Send!</a>`
            */
            this.modalFooter = 'mailto_send' // set modal footer mode to mailto mode
            // modalHelper.openModal('Mail To: ' + this.toAddress[0], this.mailText.replace(/\r|\n|\r\n/g, '<br>'), footerBtn)
            modalHelper.openModal(null, this.mailText.replace(/\r|\n|\r\n/g, '<br>'), null)
            this.modalDisplay = 'block'
            console.log('mailto', this.mailText, this.mailSubjctRaw, this.mailSubjct)
        }
      },
      setCsv: function (e) {
        console.log('setCsv')
        this.modalFooter = 'set_csv'
        modalHelper.openModal(null, null, null)
        this.modalDisplay = 'block'
      },
      dowloadCsvFile: function (e) {
        let csvTempUrl = csvHelper.createCsvFile(this.mailTags)
        console.log(csvTempUrl)
        csvHelper.downloadFile(csvTempUrl, `Template [${this.mailSubjctRaw}].csv`)
      },
      closeModal: function (e) {
        modalHelper.closeModal().then(
          this.modalDisplay = 'none'
        )
      }
    }
  }
</script>

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

  .csv-input-box{
    overflow-x: scroll;
    /*overflow-y: scroll;*/
    margin-top: 5px;
    min-height: 30vh;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 3px;
    border: 1px solid #ccc;
  }
</style>
