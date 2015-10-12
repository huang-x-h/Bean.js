/**
 * Created by huangxinghui on 2015/5/15.
 */

var $ = require('jquery');
var plugin = require('../plugin');
var Widget = require('../widget');

var Button = Widget.extend({
  options: {
    loadingText: 'loading...'
  },

  _create: function() {
    this.isLoading = false;
  },

  setState: function(state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state = state + 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function() {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d);
      }
    }, this), 0);
  },

  toggle: function() {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false;
        else $parent.find('.active').removeClass('active');
      }

      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
    }

    if (changed) this.$element.toggleClass('active');
  }
});

plugin('button', Button);

module.exports = Button;