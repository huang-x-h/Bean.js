/**
 * @global
 */

$ = require('jquery')

var Bean = {
  ns: 'bean-',
  version: '0.0.1',
  attr: function(value) {
    return 'data-' + Bean.ns + value
  }
}

module.exports = window.Bean = Bean
