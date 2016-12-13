<template>
  <div class="mailRender">
    <!--
    <h1>{{ msg }}</h1>
  -->
    <div class="tagInputSpace">
      <table style="border-collapse: collapse;">
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
        <div class="uk-modal-header"></div>
        <div class="my-modal-body"></div>
        <div class="uk-modal-footer uk-text-right">
          <!--
          <button type="button" class="uk-button" @click="closeModal">Cancel</button>

          <a class="uk-button uk-button-success" :href="modalButtonHref">Send!</a>
        -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import renderTags from './helpers/renderTags.js'
  import modalHelper from './helpers/modalHelper.js'

  export default {
    name: 'mailRender',
    props: ['mailTags', 'mailTemplate', 'mailReg',
      'toAddressAry', 'ccAddressAry', 'bccAddressAry', 'mailSubjctRaw'],
    data () {
      return {
        // msg: 'Welcome to Your Vue.js App',
        infoTagObj: {},
        modalDisplay: 'none',
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
        console.log(urlStr)
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

            let footerBtn = ''
            // footerBtn = `<button type="button" class="uk-button" @click="closeModal">Cancel</button>`
            footerBtn += `<a class="uk-button uk-button-success" href="${this.modalButtonHref}">Send!</a>`
            modalHelper.openModal('Mail To: ' + this.toAddress[0], this.mailText.replace(/\r|\n|\r\n/g, '<br>'), footerBtn)
            this.modalDisplay = 'block'
            console.log('mailto', this.mailText, this.mailSubjctRaw, this.mailSubjct)
        }
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
    /*position:relative;*/
  }
  div.mailRender{
    position: relative;
    height: 455px;
    border: 1px solid orange;
    margin-left: 10px;
    width: auto;
  }
  div.tagInputSpace{
    border-radius:5px;
    padding: 5px;
    border: 1px solid orange;
    overflow-x: scroll;
    overflow-y: scroll;
    height: 88%;
    min-width: 200px;
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
</style>
