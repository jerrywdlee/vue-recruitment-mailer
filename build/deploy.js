
console.log(`It will build application into ./docs...`);

require('shelljs/global');
const express = require('express')
const opn = require('opn')
const child_process = require('child_process');
const path = require('path')

// console.log(__dirname);
var oldDocsFolderPath = path.join(__dirname, '../docs_backs')
var oldDocsPath = path.join(__dirname, '../docs_backs/docs_back_'+ (new Date()).toLocaleString())
var docsPath = path.join(__dirname, '../docs')
var distPath = path.join(__dirname, '../dist')
// var demoToPath = path.join(__dirname, '../demofolder')

// console.log('staticPath:', staticPath);
var buildProcess = child_process.fork("build/build.js");
var app = express()
var port = process.argv[2] || 8888
buildProcess.on('close', function (code) {
  try {
    mkdir('-p', oldDocsFolderPath)
  } catch (e) {}
  try {
    mv('-f', docsPath, oldDocsPath)
  } catch (e) {}
  try {
    mv('-f', distPath, docsPath)
  } catch (e) {}
  app.use('/deploy', express.static(docsPath));
  app.listen(port, function (err) {
    if (err) {
      console.log(err)
      return
    }
    var uri = 'http://localhost:' + port + '/deploy'
    console.log('Deploy completed, check at : ' + uri + '\n');

    // when env is testing, don't need open it
    if (process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
  })
});
