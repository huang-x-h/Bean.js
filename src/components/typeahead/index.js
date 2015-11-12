/**
 * Created by huangxinghui on 2015/6/5.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var mixin = require('../../utils/mixin');
var Widget = require('../../widget');
var Drop = require('../drop');
var ListMixin = require('../../mixins/list');
var HighlightList = require('./highlightlist');
var classPrefix = 'select';

function filter_contains(data, input) {
  return RegExp(input, "i").test(this.itemToLabel(data));
}

var Typeahead = Widget.extend({
  options: {
    maxChars: 2,
    maxItems: 10,
    delay: 300,
    filter: filter_contains,
    remote: null
  },

  events: {
    'input': '_onInput',
    'blur input': '_onBlur',
    'keydown input': '_onKeyDown',
    'click .glyphicon-remove': '_onClickRemove'
  },

  _create: function() {
    var that = this;
    this.__valueChange__ = false;
    this.$input = this.$element.find('input').attr({
      autocomplete: "off",
      spellcheck: false
    });
    this.$close = this.$element.find('.glyphicon-remove');
    this._inputHandler = _.debounce(this._evaluate, this.options.delay, true);

    this.list = new HighlightList($('<ul></ul>'), $.extend({
      click: function () {
        that._onEnter();
      },
      change: function (e) {
        that._selectedItem = this.selectedItem();
        that.__valueChange__ = true;
      }
    }, this.options));

    this.drop = new Drop(this.$element, {
      classPrefix: classPrefix,
      content: this.list.$element,
      trigger: 'manual',
      close: function () {
        if (that.__valueChange__) {
          that.__valueChange__ = false;
          that.$input.val(that.value());
          that._trigger('change');
        }
      }
    });
  },

  _onInput: function(e) {
    this.$close.removeClass('hide');
    this._inputHandler(e);
  },

  _onBlur: function(e) {
    this.drop.close();
  },

  _onClickRemove: function(e) {
    this.$input.val('');
    this.$close.addClass('hide');
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
  },

  _evaluate: function() {
    var value = this.$input.val();

    if (value.length >= this.options.maxChars) {
      if (this.options.remote) {
        this._remoteQuery(value);
      } else {
        this._localQuery(value);
      }
    }
  },

  _toggleDrop: function() {
    if (this.list.dataSource().size > 0) {
      this.drop.open();
    } else {
      this.drop.close();
    }
  },

  _localQuery: function(input) {
    var that = this,
        dataSource = [];

    _.chain(this.options.dataSource)
        .filter(function(item) {
          return _.bind(that.options.filter, that, item, input)();
        })
        .every(function(item, index) {
          dataSource.push(item);
          return index < that.options.maxItems - 1;
        });

    this.list._setDataSource(dataSource, input);
    this._toggleDrop();
  },

  _remoteQuery: function(input) {
    var that = this;
    $.ajax({
      url: this.options.remote,
      type: 'POST',
      data: {
        qs: input
      }
    }).then(function(data) {
      that.list._setDataSource(data, input);
      that._toggleDrop();
    });
  }
});

mixin(Typeahead, ListMixin);

plugin('typeahead', Typeahead);