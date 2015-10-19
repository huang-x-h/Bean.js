/**
 * Created by huangxinghui on 2015/10/19.
 */

// see https://github.com/WickyNilliams/headroom.js/blob/master/src/Debouncer.js
require('./polyfills/raf');
var $ = require('jquery');

function Debouncer(callback) {
  this.callback = callback;
  this.ticking = false;
}

Debouncer.prototype = {
  update: function() {
    this.callback && this.callback();
    this.ticking = false;
  },

  requestTick: function() {
    if (!this.ticking) {
      requestAnimationFrame(this.rafCallback || (this.rafCallback = $.proxy(this.update, this)));
    }

    this.ticking = true;
  },

  // EventListener implement
  handleEvent: function() {
    this.requestTick();
  }
};

module.exports = Debouncer;