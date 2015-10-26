/**
 * Created by huangxinghui on 2015/5/25.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var template = '<div class="loading-screen">'
    + '<div class="loading-center-outer">'
    + '<div class="loading-center-middle">'
    + '<img src="images/spin.gif">'
    + '</div>'
    + '</div>'
    + '</div>';

var Loading = Widget.extend({
  _create: function() {
    this.$loading = $(template);
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