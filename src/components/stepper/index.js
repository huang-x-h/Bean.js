/**
 * Created by huangxinghui on 2015/6/17.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var template = require('./stepper.hbs');

var Stepper = Widget.extend({
  options: {
    min: 1,
    max: 10,
    value: 1
  },

  _create: function() {
    this.$element.hide();

    var $stepper = $(template());
    $stepper.insertAfter(this.$element);

    this.$input = $stepper.find('input');
    this.$minusButton = $stepper.find('.js-minus');
    this.$plusButton = $stepper.find('.js-plus');
    this.value(this.options.value);

    this._on($stepper, {
      'click .js-minus': 'minus',
      'click .js-plus': 'plus'
    });
  },

  minus: function() {
    if (this.$minusButton.hasClass('disabled')) return;

    this._setValue(this._value - 1);
  },

  plus: function() {
    if (this.$plusButton.hasClass('disabled')) return;

    this._setValue(this._value + 1);
  },

  value: function(value) {
    if (arguments.length === 0) {
      return this._value;
    } else if (this._value != value) {
      this._setValue(value);
    }
  },

  _setValue: function(value) {
    if (value < this.options.min) {
      value = this.options.min;
    }

    if (value > this.options.max) {
      value = this.options.max;
    }

    this._value = value;
    this.$input.val(this._value);
    this.$element.val(this._value);

    this.$minusButton.toggleClass('disabled', this._value === this.options.min);
    this.$plusButton.toggleClass('disabled', this._value === this.options.max);

    this._trigger('change', this._value)
  }
});

plugin('stepper', Stepper);

module.exports = Stepper;
