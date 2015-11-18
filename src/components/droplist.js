/**
 * Created by huangxinghui on 2015/11/13.
 */

var List = require('./list');
var Widget = require('../widget');
var Drop = require('./drop');
var keyboard = require('../utils/keyboard');
var classPrefix = 'select';
var highlightClass = 'highlight';
var highlightSelector = '.highlight';

function defaultItemRenderer(data) {
  return this.itemToLabel(data);
}

var DropList = List.extend({
  options: {
    target: null,
    remove: true,
    itemRenderer: defaultItemRenderer
  },

  events: {
    'click li': '_onClick'
  },

  _create: function () {
    this._super();

    this.$target = this.options.target;
    this.drop = new Drop(this.$target, {
      classPrefix: classPrefix,
      content: this.$element,
      remove: this.options.remove
    });
    this.$element.css('width', this.$target.outerWidth());
  },

  _onClick: function (e) {
    this._super(e);
    this.drop.close();
  },

  open: function () {
    this.drop.open();
  },

  close: function () {
    this.$element.find(highlightSelector).removeClass(highlightClass);
    this.drop.close();
  },

  isOpened: function() {
    return this.drop.isOpened();
  },

  moveHighlight: function (directionKeyCode) {
    var $highlight = this.$element.find(highlightSelector),
        children = this.$element.children();

    if ($highlight.length === 0) {
      children.eq(0).addClass(highlightClass);
      return;
    }

    var highlightedIndex = children.index($highlight);
    if (!(highlightedIndex >= 0)) {
      return;
    }

    if (directionKeyCode === keyboard.UP) {
      highlightedIndex -= 1;
    } else {
      highlightedIndex += 1;
    }

    if (highlightedIndex < 0 || highlightedIndex >= children.length) {
      return;
    }

    $highlight.removeClass(highlightClass);
    children.eq(highlightedIndex).addClass(highlightClass);
  },

  selectHighlightedOption: function () {
    var $highlight = this.$element.find(highlightSelector),
        children = this.$element.children();

    if ($highlight.length === 0) return;

    var highlightedIndex = children.index($highlight);
    this._setSelectedIndex(highlightedIndex);
  }
});

module.exports = DropList;