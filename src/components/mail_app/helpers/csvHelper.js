// eslint not know Blob or MouseEvent are global
// so added in .eslintignore

export default {
  createCsvFile: function (array) {
    let csvText = array.join(',')
    // console.log('csvText', csvText)
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
  },
  parseCsv: function (content, callback) {
    // use inline web worker to parse csv
    function createWorkerFromFunction(workerFunc) {
      var functionBody = workerFunc.toString().trim().match(
        /^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/
      )[1];
      return createWorkerFromString(functionBody);
    }

    function createWorkerFromString(workerCode) {
      var blob = new Blob([ workerCode ], { type: "text/javascript" });
      var url = URL.createObjectURL(blob);
      return new Worker(url);
    }
    let worker = createWorkerFromFunction(function() {
      onmessage = function(e) {
        console.log('worker:');
        console.log(e.data);
        // console.log(e);
        // csv parser
        postMessage(convertCsv(e.data))
      };
      function convertCsv(content) {
        var contentRowArry = content.trim().split(/\n|\r|\r\n/g)
        var tmpHeaderArry = contentRowArry.shift().split(/,|\t/)
        var columsNum = tmpHeaderArry.length
        var tmpResultArry = []
        contentRowArry.forEach((x, index, self) => {
          var tmpRowArry = x.split(/,|\t/)
          var tmpObj = {}
          for (var i = 0; i < columsNum; i++) {
            if (tmpRowArry[i]) {
              tmpObj[tmpHeaderArry[i]] = tmpRowArry[i].trim()
            } else {
              tmpObj[tmpHeaderArry[i]] = ''
            }
          }
          tmpResultArry.push(tmpObj)
        })
        return tmpResultArry
      }
    });
    worker.onmessage = function(e) {
      // console.log('host:', e.data)
      callback(e.data, e)
    }
    worker.postMessage(content)
  }
}
