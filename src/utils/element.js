/**
 * Created by huangxinghui on 2015/10/25.
 */

var $ = require('jquery');
var $body = require('../body');

var viewport = {
  l: 0,
  t: 0,
  b: (window.innerHeight || document.documentElement.clientHeight),
  r: (window.innerWidth || document.documentElement.clientWidth)
};

module.exports = {
  inViewport: function(element) {
    var box = element.getBoundingClientRect();
    return (box.right >= viewport.l && box.bottom >= viewport.t && box.left <= viewport.r && box.top <= viewport.b);
  },

  reflow: function(element) {
    if (element) {
      if (!element.nodeType && element instanceof $) {
        element = element[0];
      }
    } else {
      element = $body[0];
    }

    return element.offsetHeight;
  }
};
