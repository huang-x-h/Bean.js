/**
 * Created by huangxinghui on 2015/5/15.
 */

var $ = require('jquery');
var plugin = require('../plugin');
var Widget = require('../widget');
var $document = require('../document');
var DISABLED = 'disabled';
var ACTIVE = 'active';

var Button = Widget.extend({
  options: {
    loadingText: 'loading...'
  },

  _create: function() {
    this.isLoading = false;
    this.resetText = this._elementValue();
  },

  loading: function() {
    this.setState('loading');
  },

  reset: function() {
    this.setState('reset');
  },

  setState: function(state) {
    var $el = this.$element;

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function() {
      if (state === 'loading') {
        this._elementValue(this.options.loadingText);
        this.isLoading = true;
        $el.addClass(DISABLED).attr(DISABLED, DISABLED);
      } else if (this.isLoading) {
        this._elementValue(this.resetText);
        this.isLoading = false;
        $el.removeClass(DISABLED).removeAttr(DISABLED);
      }
    }, this), 0);
  },

  _elementValue: function(value) {
    var val = this.$element.is('input') ? 'val' : 'html';

    if (arguments.length === 0) {
      return this.$element[val]();
    } else {
      this.$element[val](value);
    }
  },

  toggle: function() {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass(ACTIVE)) changed = false;
        else $parent.find('.active').removeClass(ACTIVE);
      }

      if (changed) $input.prop('checked', !this.$element.hasClass(ACTIVE)).trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass(ACTIVE));
    }

    if (changed) this.$element.toggleClass(ACTIVE);
  }
});

// data api
$document
    .on('click.button.data-api', '[data-toggle^="button"]', function(e) {
      var $btn = $(e.target);

      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');

      $btn.button('toggle');
      e.preventDefault()
    })
    .on('click');

plugin('button', Button);

module.exports = Button;