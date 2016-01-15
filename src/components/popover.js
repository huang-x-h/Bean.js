/**
 * Created by huangxinghui on 2015/5/18.
 */

var $ = require('jquery');
var plugin = require('../plugin');
var Tooltips = require('./tooltip');

var PopOver = Tooltips.extend({
  options: {
    animation: true,
    placement: 'bottom',
    trigger: 'click',
    html: true,
    title: '',
    content: '',
    container: false,
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3>' +
    '<div class="popover-content"></div></div>'
  },

  setContent: function() {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
        this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
        ](content);

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  },

  hasContent: function() {
    return this.getTitle() || this.getContent();
  },

  getContent: function() {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-content')
        || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content);
  },

  arrow: function() {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'));
  }
});

plugin('popover', PopOver);

module.exports = PopOver;