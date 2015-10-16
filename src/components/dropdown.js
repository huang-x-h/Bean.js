/**
 * Created by huangxinghui on 2015/5/19.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../plugin');
var Widget = require('../widget');
var $document = require('../document');
var toggle = '[data-toggle="dropdown"]';

var DropDown = Widget.extend({
  options: {
    target: null,
    position: 'bottomLeft' // topLeft/topRight/bottomLeft/bottomRight
  },

  events: {
    'click': 'toggle'
  },

  _create: function() {
    var parentClass = 'dropdown';
    this.$parent = this.getParent();

    if (this.options.position.indexOf('top') !== -1) {
      parentClass = 'dropup';
    }
    this.$parent.addClass(parentClass);

    if (this.options.position.indexOf('Right') !== -1) {
      this.$parent.children('.dropdown-menu').addClass('dropdown-menu-right')
    }
  },

  open: function() {
    this.$parent.addClass('open');
    this._trigger('open');
  },

  close: function() {
    this.$parent.removeClass('open');
    this._trigger('close');
  },

  toggle: function(e) {
    var isActive = this.$parent.hasClass('open');

    clearMenus(e);

    if (!isActive) this.open();
    return false;
  },

  getParent: function() {
    if (this.options.target) {
      return (this.options.target instanceof $ ? this.options.target : $(this.options.target)).parent();
    } else {
      return this.$element.parent();
    }
  }
});

plugin('dropdown', DropDown);

module.exports = DropDown;

function clearMenus(e) {
  if (e && e.which === 3) return;

  $(toggle).dropdown('close');
}

$document
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '[data-toggle="dropdown"]', function(e) {
      return $(this).dropdown('toggle');
    });