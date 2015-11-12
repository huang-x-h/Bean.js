/**
 * Created by huangxinghui on 2015/6/1.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var mixin = require('../../utils/mixin');
var Widget = require('../../widget');
var ListMixin = require('../../mixins/list');
var Drop = require('../drop');
var List = require('../list');
var template = require('./select.hbs');
var classPrefix = 'select';

var Select = Widget.extend({
  options: {
    placeholder: 'Please Select...',
    selectedIndex: -1
  },

  _create: function () {
    var that = this;

    this.__valueChange__ = false;
    this.$element.addClass(classPrefix + '-select');
    this.$target = $(template({placeholder: this.options.placeholder})).insertAfter(this.$element);

    this.drop = new Drop(this.$target, {
      classPrefix: classPrefix,
      remove: false,
      close: function () {
        if (that.__valueChange__) {
          that.__valueChange__ = false;
          that.$element.val(that.value());
          that._trigger('change');
        }
      }
    });

    this._setDataSource(this.setupDataSource());
    this._setSelectedIndex(this.options.selectedIndex);

    this.setupEvents();
  },

  setupEvents: function () {
    this._on(this.$target, {
      'keydown': '_onKeyDown'
    });
  },

  _parseSelect: function() {
    this.options.placeholder = this.$element.text();
  },

  setupDataSource: function () {
    var that = this;

    if (this.$element.is('select')) {
      var dataSource = [];
      this.$element.children().each(function (index, option) {
        var item = {};
        item[that.options.dataTextField] = option.textContent;
        item[that.options.dataValueField] = option.value;
        dataSource.push(item);
      });

      return dataSource;
    } else {
      var placeholderOption = {};
      placeholderOption[this.options.dataTextField] = this.options.placeholder;
      placeholderOption[this.options.dataValueField] = null;

      return [placeholderOption].concat(this.options.dataSource);
    }
  },

  _setDataSource: function (value) {
    var that = this;

    this._selectedIndex = -1;
    this._selectedItem = null;

    this.list = new List($('<ul></ul>'), {
      dataSource: value,
      click: function () {
        that._onEnter();
      },
      change: function (e) {
        that._selectedIndex = this.selectedIndex();
        that._selectedItem = this.selectedItem();
        that.__valueChange__ = true;
      }
    });
    this.drop.$drop.html(this.list.$element);
  },

  _setSelectedIndex: function (index) {
    this.list.selectedIndex(index);
  },

  _onKeyDown: function (e) {
    var c = e.keyCode;

    // If the dropdown `ul` is in view, then act on keydown for the following keys:
    // Enter / Esc / Up / Down
    if (this.drop.isOpened()) {
      if (c === 13) { // Enter
        e.preventDefault();
        this._onEnter();
      }
      else if (c === 27) { // Esc
        this.drop.close();
      }
      else if (c === 38 || c === 40) { // Down/Up arrow
        e.preventDefault();
        this.list[c === 38 ? "previous" : "next"]();
      }
    }
  },

  _onEnter: function () {
    this.$target.text(this.list.text());
    this.drop.close();
  }
});

mixin(Select, ListMixin);
plugin('select', Select);

module.exports = Select;