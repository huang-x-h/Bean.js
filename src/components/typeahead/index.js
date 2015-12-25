/**
 * Created by huangxinghui on 2015/6/5.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var mixin = require('../../utils/mixin');
var Widget = require('../../widget');
var ListMixin = require('../../mixins/list');
var HighlightList = require('./highlightlist');
var keyboard = require('../../utils/keyboard');

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
    'keydown input': '_onKeyDown',
    'click .glyphicon-remove': '_onClickRemove'
  },

  _create: function() {
    var that = this;
    this.$input = this.$element.find('input').attr({
      autocomplete: "off",
      spellcheck: false
    });
    this.$close = this.$element.find('.glyphicon-remove');
    this._inputHandler = _.debounce(this._evaluate, this.options.delay);

    this.dropList = new HighlightList($('<ul></ul>'), {
      target: this.$element,
      remove: true,
      change: function(e) {
        that._selectedItem = this.selectedItem();
        that.$input.val(this.text());
        that._trigger('change', that._selectedItem);
      }
    });
  },

  _onInput: function(e) {
    this.$close.removeClass('hide');
    this._inputHandler(e);
  },

  _onClickRemove: function(e) {
    this.$input.val('');
    this.$close.addClass('hide');
  },

  _onKeyDown: function(e) {
    var c = e.keyCode;

    // If the dropdown `ul` is in view, then act on keydown for the following keys:
    // Enter / Esc / Up / Down
    if (this.dropList.isOpened()) {
      switch (c) {
        case keyboard.ENTER:
          e.preventDefault();
          this.dropList.selectHighlightedOption();
          this.dropList.close();
          return;
        case keyboard.ESC:
          this.dropList.close();
          return;
        case keyboard.DOWN:
        case keyboard.UP:
          this.dropList.moveHighlight(c);
          return;
      }
    }

    this._onInput(e);
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
    if (this.dropList.dataSource().size > 0) {
      this.dropList.open();
    } else {
      this.dropList.close();
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

    this.dropList._setDataSource(dataSource, input);
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
      that.dropList._setDataSource(data, input);
      that._toggleDrop();
    });
  }
});

mixin(Typeahead, ListMixin);

plugin('typeahead', Typeahead);