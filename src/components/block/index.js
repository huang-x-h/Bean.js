/**
 * Created by huangxinghui on 2015/11/6.
 */

var Widget = require('../../widget');
var plugin = require('../../plugin');
var wrapperTemplate = require('./wrapper.hbs');
var loadingTemplate = require('./loading.hbs');
var backdropTemplate = require('./backdrop.hbs');

var Block = Widget.extend({
  options: {
    template: loadingTemplate()
  },

  _create: function() {
    var fixed = false;
    if (this.$element.is('body')) {
      fixed = true;
    }

    this.$block = $(wrapperTemplate({template: this.options.template, fixed: fixed}));
    this.$backdrop = $(backdropTemplate({fixed: fixed}));
  },

  show: function() {
    this.$element.addClass('block');
    this.$element.append(this.$backdrop);
    this.$element.append(this.$block);
  },

  hide: function() {
    this.$element.removeClass('block');
    this.$backdrop.remove();
    this.$block.remove();
  }
});

plugin('block', Block);

module.exports = Block;