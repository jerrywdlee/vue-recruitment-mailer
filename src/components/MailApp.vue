<template>
  <div class="MailApp">
    <MailWorkSpace v-on:openModal="openModal"></MailWorkSpace>
  </div>
</template>

<script>
  import MailWorkSpace from './mail_app/MailWorkSpace'

  export default {
    name: 'MailApp',
    data () {
      return {
        // messageF: 'Plz \n Type \n Sth.'
      }
    },
    components: {
      MailWorkSpace
    },
    computed: {
      backMessage: function () {
        // console.log('MailWorkSpace.backMessage')
        // console.log(MailWorkSpace.backMessage)
        // return MailWorkSpace.backMessage
      }
    },
    methods: {
      openModal: function (val, e) {
        console.log(val)
        console.log(e)
      }
    }
  }
</script>
