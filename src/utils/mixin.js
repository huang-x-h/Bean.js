/**
 * Created by huangxinghui on 2015/6/24.
 */

var _ = require('underscore')

var Mixin = function(clazz, from) {
  var to = clazz.prototype

  _.defaults(to, from)
  _.defaults(to.options, from.options)

  extendMethod(to, from, '_create')
}

function extendMethod(to, from, methodName) {
  if (!_.isUndefined(from[methodName])) {
    var old = to[methodName]

    to[methodName] = function() {
      var oldReturn = old.apply(this, arguments)
      from[methodName].apply(this, arguments)
      return oldReturn
    }
  }
}

module.exports = Mixin
