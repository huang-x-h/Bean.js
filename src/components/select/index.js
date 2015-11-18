/**
 * Created by huangxinghui on 2015/6/1.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var mixin = require('../../utils/mixin');
var Widget = require('../../widget');
var ListMixin = require('../../mixins/list');
var keyboard = require('../../utils/keyboard');
var DropList = require('../droplist');
var template = require('./select.hbs');
var classPrefix = 'select';

var Select = Widget.extend({
  options: {
    placeholder: 'Please Select...',
    selectedIndex: 0
  },

  _create: function () {
    var that = this;
    this.$element.addClass(classPrefix + '-select');
    this.setupDataSource();

    this.$target = $(template({placeholder: this.options.placeholder})).insertAfter(this.$element);

    this.dropList = new DropList($('<ul></ul>'), $.extend({
      target: this.$target,
      remove: false,
      trigger: 'click',
      change: function (e) {
        that._selectedIndex = this.selectedIndex();
        that._selectedItem = this.selectedItem();
        that.$target.text(this.text());
        that._trigger('change', that._selectedItem);
      }
    }, this.options));

    this.setupEvents();
  },

  setupEvents: function () {
    this._on(this.$target, {
      'keydown': '_onKeyDown'
    });
  },

  setupDataSource: function () {
    var that = this,
        selectOption;

    if (this.$element.is('select')) {
      selectOption = this.$element.find('[selected]');

      if (selectOption.length === 0) {
        selectOption = this.$element.children()[0];
      } else {
        selectOption = selectOption[0];
        this.options.selectedIndex = this.$element.children().index(selectOption);
      }
      this.options.placeholder = selectOption.textContent;
      this.options.dataSource = [];
      this.$element.children().each(function (index, option) {
        var item = {};
        item[that.options.dataTextField] = option.textContent;
        item[that.options.dataValueField] = option.value;
        that.options.dataSource.push(item);
      });
    } else {
      var placeholderOption = {};
      placeholderOption[this.options.dataTextField] = this.options.placeholder;
      placeholderOption[this.options.dataValueField] = null;

      this.options.dataSource = [placeholderOption].concat(this.options.dataSource);
    }
  },

  _setDataSource: function (value) {
    this._selectedIndex = -1;
    this._selectedItem = null;

    this.dropList.dataSource(value);
  },

  _setSelectedIndex: function (index) {
    this.dropList.selectedIndex(index);
  },

  _onKeyDown: function (e) {
    var c = e.keyCode;

    if (this.dropList.isOpened()) {
      if (c === keyboard.ENTER) {
        e.preventDefault();
        this.dropList.selectHighlightedOption();
        this.dropList.close();
      }
      else if (c === keyboard.ESC) { // Esc
        this.dropList.close();
      }
      else if (c === keyboard.UP || c === keyboard.DOWN) { // Down/Up arrow
        e.preventDefault();
        this.dropList.moveHighlight(c);
      }
    } else {
      if (c === keyboard.UP || c === keyboard.DOWN || c === keyboard.SPACE) {
        this.dropList.open();
      }
    }
  }
});

mixin(Select, ListMixin);
plugin('select', Select);

module.exports = Select;