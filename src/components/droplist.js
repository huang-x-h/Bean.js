/**
 * Created by huangxinghui on 2015/11/13.
 */

var Immutable = require('immutable');
var _ = require('underscore');
var Widget = require('../widget');
var Drop = require('./drop');
var keyboard = require('../utils/keyboard');
var mixin = require('../utils/mixin');
var ListMixin = require('../mixins/list');
var highlightClass = 'highlight';
var highlightSelector = '.' + highlightClass;

function defaultItemRenderer(data) {
  return this.itemToLabel(data);
}

var DropList = Widget.extend({
  options: {
    classPrefix: 'droplist',
    target: null,
    remove: true,
    trigger: 'manual',
    itemRenderer: defaultItemRenderer
  },

  _create: function() {
    this._setDataSource(this.options.dataSource);
    this._setSelectedIndex(this.options.selectedIndex);

    this.$target = this.options.target;
    this.drop = new Drop(this.$target, {
      classPrefix: this.options.classPrefix,
      trigger: this.options.trigger,
      content: this.$element,
      remove: this.options.remove
    });
    this.$element.css('width', this.$target.outerWidth());

    if (!this.options.remove) {
      this.setupEvents();
    }
  },

  _setDataSource: function(value) {
    this._dataSource = new Immutable.List(value);
    this._selectedIndex = -1;
    this._selectedItem = null;

    this.$element.html(this._dataSource.reduce(function(previous, current) {
      return previous + '<li>' + this.options.itemRenderer.bind(this, current)() + '</li>';
    }, '', this));
  },

  _setSelectedIndex: function(index) {
    if (index > -1 && index < this._dataSource.size) {
      this._selectedItem = this._dataSource.get(index);
      this._selectedIndex = index;
      this._trigger('change');
    }
  },

  _onClick: function(e) {
    e.preventDefault();

    this.selectedIndex(this.$element.children().index($(e.currentTarget)));
    this.drop.close();
  },

  setupEvents: function() {
    this._on({
      'click li': '_onClick',
      'mousedown': function(e) {
        // prevent when click droplist trigger blur event, such as typeahead
        e.preventDefault();
      }
    });
  },

  open: function() {
    this.drop.open();

    if (this.options.remove) {
      this.setupEvents();
    }
  },

  close: function() {
    this.$element.find(highlightSelector).removeClass(highlightClass);
    this.drop.close();
  },

  isOpened: function() {
    return this.drop.isOpened();
  },

  moveHighlight: function(directionKeyCode) {
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

  selectHighlightedOption: function() {
    var $highlight = this.$element.find(highlightSelector),
        children = this.$element.children();

    if ($highlight.length === 0) return;

    var highlightedIndex = children.index($highlight);
    this.selectedIndex(highlightedIndex);
  }
});

mixin(DropList, ListMixin);
module.exports = DropList;
