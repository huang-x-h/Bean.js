/**
 * Created by huangxinghui on 2015/9/10.
 */

var $ = require('jquery');
var Immutable = require('immutable');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var DropList = require('../droplist');
var keyboard = require('../../utils/keyboard');

var EmailList = DropList.extend({
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
    'keydown': '_onKeyDown'
  },

  _create: function () {
    var that = this;
    this.$element.attr({
      autocomplete: "off",
      spellcheck: false
    });

    this.dropList = new EmailList($('<ul></ul>'), {
      target: this.$element,
      remove: true,
      change: function (e) {
        that._selectedItem = this.selectedItem();
        that.$element.val(this.text());
        that._trigger('change', that._selectedItem);
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

    this.dropList._setDataSource(suffixes, arr[0]);
    this.dropList.open();
  },

  _onKeyDown: function (e) {
    var c = e.keyCode;

    if (this.dropList.isOpened()) {
      if (c === keyboard.ENTER) { // Enter
        e.preventDefault();
        this.dropList.selectHighlightedOption();
        this.dropList.close();
      }
      else if (c === keyboard.ESC) { // Esc
        this.dropList.close();
      }
      else if (c === keyboard.DOWN || c === keyboard.UP) { // Down/Up arrow
        e.preventDefault();
        this.dropList.moveHighlight(c);
      }
    }
  }
});

plugin('emailautocomplete', EmailAutoComplete);

module.exports = EmailAutoComplete;