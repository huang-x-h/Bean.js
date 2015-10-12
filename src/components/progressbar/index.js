/**
 * Created by huangxinghui on 2015/7/21.
 */

var $ = require('jquery');
var Widget = require('../../widget');
var plugin = require('../../plugin');
var template = require('./progressbar.hbs');

var ProgressBar = Widget.extend({
  options: {
    animation: false,
    minimum: 0,
    maximum: 100,
    value: 0,
    showLabel: false,
    progressBarClass: ''
  },

  _create: function() {
    this.$element.append(template(this.options));
    this.$progressBar = this.$element.find('.progress-bar');
    this.progress(this.options.value / this.options.maximum);
  },

  progress: function(value) {
    var pct = (value * 100) + '%';
    this.$progressBar.css('width', pct);

    if (this.options.showLabel) {
      this.$progressBar.text(pct);
    }
  }
});

plugin('progressbar', ProgressBar);

module.exports = ProgressBar;