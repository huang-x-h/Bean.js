/**
 * Created by huangxinghui on 2015/5/25.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var template = require('./loading.hbs');

var Loading = Widget.extend({
  options: {
    customClass: null
  },

  _create: function() {
    this.$loading = $(template({
      customClass: this.options.customClass
    }));
    this.$element.append(this.$loading);
  },

  finish: function() {
    this.$loading.remove();

    // remove widget
    this.destroy();
  }
});

plugin('loading', Loading);

module.exports = Loading;