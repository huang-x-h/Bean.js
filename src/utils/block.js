/**
 * Created by huangxinghui on 2015/5/26.
 */

var $body = require('../body')
var Bean = require('../core')

require('../components/block')

Bean.block = function() {
  $body.block('show')
}

Bean.unblock = function() {
  $body.block('hide')
}
