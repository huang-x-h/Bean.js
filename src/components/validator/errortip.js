/**
 * Created by huangxinghui on 2015/8/28.
 */

var Tooltip = require('../tooltip');

var ErrorTip = Tooltip.extend({
  options: {
    animation: true,
    placement: 'top-left',
    template: '<div class="errortip" role="errortip"><div class="errortip-arrow"></div>' +
    '<div class="errortip-inner"></div></div>',
    trigger: 'hover',
    title: '',
    html: false,
    container: false
  },

  setContent: function() {
    var $tip = this.tip();
    var title = this.getTitle();

    $tip.find('.errortip-inner')[this.options.html ? 'html' : 'text'](title);
    $tip.removeClass('fade in top bottom left right');
  }
});

module.exports = ErrorTip;