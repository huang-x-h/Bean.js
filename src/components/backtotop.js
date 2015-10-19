/**
 * Created by huangxinghui on 2015/10/8.
 */

var $ = require('jquery');
var Widget = require('../widget');
var Debouncer = require('../debouncer');
var plugin = require('../plugin');
var $window = $(window);

var BackToTop = Widget.extend({
  options: {
    offset: 1000
  },

  events: {
    'click': '_onClick'
  },

  _create: function() {
    this.debouncer = new Debouncer($.proxy(this._update, this));

    window.addEventListener('scroll', this.debouncer, false);
    this.debouncer.handleEvent();
  },

  _destroy: function() {
    window.removeEventListener('scroll', this.debouncer, false);
  },

  _update: function() {
    if ($window.scrollTop() > this.options.offset) {
      this.$element.fadeIn();
    } else {
      this.$element.fadeOut();
    }
  },

  _onClick: function(e) {
    //1 second of animation time
    //html works for FFX but not Chrome
    //body works for Chrome but not FFX
    //This strange selector seems to work universally
    $('html, body').animate({scrollTop: 0}, 1000);
  }
});

plugin('backtotop', BackToTop);
