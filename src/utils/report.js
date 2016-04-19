/**
 * Created by huangxinghui on 2016/1/11.
 */

var $ = require('jquery')

function Report(prefix, url) {
  this.prefix = prefix
  this.url = url
}

Report.prototype.send = function(params) {
  var image = new Image(),
    imageID = this.prefix + Date.now()

  image.onload = function() {
    delete window[imageID]
  }

  window[imageID] = image
  image.src = this.url + '?' + $.param(params)
}

module.exports = Report
