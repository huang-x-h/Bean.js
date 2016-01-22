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
var browser = require('../../utils/browser');
var specialKeyCodes = [keyboard.DOWN, keyboard.UP, keyboard.LEFT, keyboard.RIGHT, keyboard.ENTER
  , keyboard.TAB, keyboard.ESC];

function filter_contains(data, input) {
  return RegExp(input, "i").test(this.itemToLabel(data));
}

function withModifier(e) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
}

var Typeahead = Widget.extend({
  options: {
    maxChars: 2,
    maxItems: 10,
    delay: 300,
    filter: filter_contains,
    remote: null
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

    this._setupEvents();
  },

  _setupEvents: function() {
    this._on({
      'click .glyphicon-remove': '_onClickRemove',
      'mousedown .glyphicon-remove': function(e) {
        e.preventDefault();
      }
    });

    var events = {
      'blur': '_onBlur',
      'focus': '_onFocus',
      'keydown': '_onKeydown'
    };

    if (!browser.msie || browser.version > 9) {
      events['input'] = '_onInput';
      this._on(this.$input, events);
    } else {
      // ie9 Doesn't fire an input event when deleting text (via Backspace, Delete, Cut, etc.).
      // http://caniuse.com/#search=input
      events['keyup'] = events['cut'] = events['paste'] = '_onSpecialInput';
      this._on(this.$input, events);

      this._on(this.$input, {
        'keydown': '_onSpecialInput'
      });
    }
  },

  _onBlur: function(e) {
    this.dropList.close();
  },

  _onFocus: function(e) {
    this._evaluate();
  },

  _onSpecialInput: function(e) {
    if (specialKeyCodes.indexOf(e.keyCode)) {
      return;
    }

    _.defer(this._onInput.bind(this)(e));
  },

  _onInput: function(e) {
    this.$close.removeClass('hide');
    this._inputHandler(e);
  },

  _onClickRemove: function(e) {
    this.$input.val('');
    this.$close.addClass('hide');
    this.dropList.close();
  },

  _onKeydown: function(e) {
    var c = e.keyCode;

    // If the dropdown `ul` is in view, then act on keydown for the following keys:
    // Enter / Esc / Up / Down
    if (this.dropList.isOpened()) {
      switch (c) {
        case keyboard.ENTER:
          e.stopPropagation();
          this.dropList.selectHighlightedOption();
          this.dropList.close();
          break;
        case keyboard.ESC:
          e.stopPropagation();
          this.dropList.close();
          break;
        case keyboard.DOWN:
        case keyboard.UP:
          if (!withModifier(e)) {
            e.preventDefault();
            this.dropList.moveHighlight(c);
          }
          break;
      }
    }
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
    var that = this, dataSource = [];

    _.chain(this.options.dataSource)
      .filter(function(item) {
        return that.options.filter.bind(that)(item, input);
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
    this.options.remote(input).then(function(data) {
      that.dropList._setDataSource(data, input);
      that._toggleDrop();
    });
  }
});

mixin(Typeahead, ListMixin);

plugin('typeahead', Typeahead);
