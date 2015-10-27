/**
 * Created by huangxinghui on 2015/10/20.
 */

var Widget = require('../../widget');
var Collapse = require('./collapse');

var Panel = Widget.extend({
  _create: function() {
    this.$trigger = this.$element.find('.close');
    this.collapse = new Collapse(this.$element.find('.panel-collapse'));

    this._on(this.$trigger, {
      'click': 'toggle'
    });
  },

  toggle: function() {
    this.collapse.toggle();
    this.$trigger.toggleClass('collapsed');
  },

  isOpen: function() {
    return this.collapse.isOpen();
  }
});

module.exports = Panel;