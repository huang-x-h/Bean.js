/**
 * Created by huangxinghui on 2015/9/10.
 */

var $ = require('jquery');
var Immutable = require('immutable');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var Drop = require('../drop');
var List = require('../list');
var classPrefix = 'typeahead';

var EmailList = List.extend({
  _setDataSource: function (value, prefix) {
    this._dataSource = new Immutable.List(value);
    this._selectedIndex = -1;
    this._selectedItem = null;
    this.prefix = prefix;

    this.$element.html(this._dataSource.reduce(function (previous, current) {
      return previous + '<li class="list-item">' + prefix + '@' + current + '</li>';
    }, '', this));
  },

  itemToLabel: function (data) {
    return this.prefix + '@' + data;
  }
});

var EmailAutoComplete = Widget.extend({
  options: {
    suffixes: ["qq.com", "gmail.com", "126.com", "163.com", "hotmail.com", "263.com", "21cn.com", "yahoo.com", "yahoo.com.cn", "live.com", "sohu.com", "sina.com", "sina.com.cn"]
  },

  events: {
    'input': '_onInput',
    'blur': '_onBlur',
    'keydown': '_onKeyDown'
  },

  _create: function () {
    var that = this;
    this.__valueChange__ = false;
    this.$element.attr({
      autocomplete: "off",
      spellcheck: false
    });

    this.list = new EmailList($('<ul"></ul>'), {
      click: function () {
        that._onEnter();
      },
      change: function (e) {
        that._selectedItem = this.selectedItem();
        that.__valueChange__ = true;
      }
    });

    this.drop = new Drop(this.$element, {
      classPrefix: classPrefix,
      content: this.list.$element,
      trigger: 'manual',
      close: function () {
        if (that.__valueChange__) {
          that.__valueChange__ = false;
          that.$element.val(that.list.text());
          that._trigger('change');
        }
      }
    });
  },

  _onInput: function () {
    var text = this.$element.val(),
        arr = text.split('@'),
        suffixes;

    if (arr.length === 1 || arr[1] === '') {
      suffixes = this.options.suffixes;
    } else {
      suffixes = this.options.suffixes.filter(function (suffix) {
        return suffix.indexOf(arr[1]) !== -1;
      });
    }

    this.list._setDataSource(suffixes, arr[0]);
    this.drop.open();
  },

  _onBlur: function (e) {
    this.drop.close();
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
    this.drop.close();
  }
});

plugin('emailautocomplete', EmailAutoComplete);

module.exports = EmailAutoComplete;