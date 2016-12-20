export default {
  closeModal: function () {
    return new Promise(function (resolve, reject) {
      try {
        // document.getElementById('modal').className = 'uk-modal uk-close'
        // document.querySelector('.uk-modal-header').innerHTML = ''
        // document.querySelector('.my-modal-body').innerHTML = ''
        // document.querySelector('.uk-modal-footer').innerHTML = ''
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  openModal: function (header, body, footer) {
    if (header) {
      // document.querySelector('.uk-modal-header').innerHTML = header
      document.querySelector('.header-html-insert-target').innerHTML = header
    }
    if (body) {
      // document.querySelector('.my-modal-body').innerHTML = body
      document.querySelector('.body-html-insert-target').innerHTML = body
    }
    if (footer) {
      // document.querySelector('.uk-modal-footer').innerHTML = footer
      document.querySelector('.footer-html-insert-target').innerHTML = footer
    }

    // document.getElementById('modal').className = 'uk-modal uk-open'
    // return false
  }
}
