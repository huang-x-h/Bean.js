/**
 * Created by huangxinghui on 2015/5/19.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../plugin');
var Widget = require('../widget');
var $document = require('../document');
var triangle = require('../utils/triangle');
var DATA_TOGGLE = '[data-toggle="dropdown"]';
var CLASS_NAME = {
  OPEN: 'open'
};

var DropDown = Widget.extend({
  options: {
    target: null,
    position: 'bottom left'
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
    this.$parent.children('.dropdown-menu').addClass('dropdown-menu-' + triangle[this.options.position]);
  },

  open: function() {
    this.$parent.addClass(CLASS_NAME.OPEN);
    this._trigger('open');
  },

  close: function() {
    if (!this._trigger('beforeClose')){
      return false;
    }

    this.$parent.removeClass(CLASS_NAME.OPEN);
    this._trigger('close');
    return true;
  },

  toggle: function(e) {
    var isActive = this.$parent.hasClass(CLASS_NAME.OPEN);

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

  var toggles = $.makeArray($(DATA_TOGGLE)),
      i = 0,
      n = toggles.length,
      $parent, $toggle;

  for (; i < n; i++) {
    $toggle = $(toggles[i]);
    $parent = $toggle.dropdown('getParent');

    if (!$parent.hasClass(CLASS_NAME.OPEN)) continue;

    if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

    if (!$toggle.dropdown('close')) return;
  }
}

$document
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', DATA_TOGGLE, function(e) {
      return $(this).dropdown('toggle');
    });