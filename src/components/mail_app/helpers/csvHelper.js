// eslint not know Blob or MouseEvent are global
// so added in .eslintignore

export default {
  createCsvFileUrl: function (array2d) {
    let tmpArray = array2d.map((x, i, self) => {
      return x.join(',')
    })
    let csvText = tmpArray.join('\n')
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
  stringifyObj2CsvAry: function (objAry, callback) {
    let worker = createWorkerFromFunction(function() {
      onmessage = function(e) {
        console.log('worker:')
        console.log(e.data)
        // console.log(e);
        // csv parser
        postMessage(convert2Csv(e.data))
      };
      function convert2Csv(objAry) {
        var keysArry = []
        for (var id in objAry[0]) {
          keysArry.push(id)
        }
        var tmpCsvObjAry = []
        tmpCsvObjAry.push(keysArry)
        objAry.forEach(function (obj) {
          var tmpObjAry = []
          keysArry.forEach(function (key) {
            tmpObjAry.push(('"'+obj[key]+'"'))
          })
          tmpCsvObjAry.push(tmpObjAry)
        })
        return tmpCsvObjAry
      }
    });
    worker.onmessage = function(e) {
      // console.log('host:', e.data)
      callback(e.data, e)
    }
    worker.postMessage(objAry)
  },
  parseCsv: function (content, callback) {
    let worker = createWorkerFromFunction(function() {
      onmessage = function(e) {
        console.log('worker:')
        console.log(e.data)
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
  },
  createMailsJson: function (mailReg, infoTagObjAry, mailTempObj = {}, callback) {
    /*
    mailTempObj: mailTemplate, mailSubjctRaw, toAddressAry, ccAddressAry, bccAddressAry
    */
    let worker = createWorkerFromFunction(function() {
      onmessage = function(e) {
        console.log('createMailsJson:')
        // console.log(e.data)
        // console.log(e);
        // csv parser
        postMessage(convertEmails(e.data))
      };
      function convertEmails(content) {
        var mailReg = content[0]
        var infoTagObjAry = content[1]
        var mailTemplate = content[2].mailTemplate
        ,   mailSubjctRaw = content[2].mailSubjctRaw
        ,   toAddressAry = content[2].toAddressAry
        ,   ccAddressAry = content[2].ccAddressAry
        ,   bccAddressAry = content[2].bccAddressAry
        var tmpMailsAry = []
        infoTagObjAry.forEach((infoTagObj, index, self) => {
          var tmpMailObj = {
            mailSubjct: renderTags(mailReg, mailSubjctRaw, infoTagObj),
            toAddress: toAddressAry.map((x, i, self) => {
              return renderTags(mailReg, x, infoTagObj)
            }) || [],
            ccAddress: ccAddressAry.map((x, i, self) => {
              return renderTags(mailReg, x, infoTagObj)
            }) || [],
            bccAddress: bccAddressAry.map((x, i, self) => {
              return renderTags(mailReg, x, infoTagObj)
            }) || [],
            mailText: renderTags(mailReg, mailTemplate, infoTagObj)
          }
          tmpMailsAry.push(tmpMailObj)
        })
        // console.log(tmpMailsAry)
        return tmpMailsAry
      }
      renderTags = function (reg, data, params) {
        if (reg) {
          data = data.replace(reg, (match) => {
            return params[match.replace(/@#|#@/g, '')] || ''
          })
          return data
        } else {
          return data
        }
      }
    });
    worker.onmessage = function(e) {
      // console.log('host:', e.data)
      callback(e.data, e)
    }
    worker.postMessage([mailReg, infoTagObjAry, mailTempObj])
  }
}

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
