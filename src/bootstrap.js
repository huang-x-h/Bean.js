/**
 * Created by huangxinghui on 2015/8/15.
 */

var $document = require('./document')
var locale = require('./locale')

$document.ready(function init() {
  locale.publish()
})
