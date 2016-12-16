// eslint not know Blob or MouseEvent are global
// so added in .eslintignore

export default {
  createCsvFile: function (array) {
    let csvText = array.join(',')
    console.log('csvText', csvText)
    let blob = new Blob([ csvText ], { 'type': 'text/plain' })
    let URL = window.URL || window.webkitURL
    return URL.createObjectURL(blob)
  },
  downloadFile: function (url, fileName) {
    // create temp <a> dom obj
    var aLink = document.createElement('a')
    aLink.href = url
    if (fileName) {
      aLink.download = fileName
    }
    // create new event
    let event = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    })
    // click temp <a> obj!
    aLink.dispatchEvent(event)
  }
}
