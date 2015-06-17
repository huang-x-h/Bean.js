/**
 * Created by huangxinghui on 2015/6/17.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');

var Stepper = Widget.extend({
    options: {
        minValue: 1,
        maxValue: 10,
        value: 1
    },

    events: {
        'click .ns-minus-button': 'minus',
        'click .ns-plus-button': 'plus'
    },

    _create: function () {
        this.$input = this.$element.find('input');
        this.$minusButton = this.$element.find('.ns-minus-button');
        this.$plusButton = this.$element.find('.ns-plus-button');
        this.value(this.options.value);
    },

    minus: function () {
        if (this.$minusButton.hasClass('disabled')) return;

        this._setValue(this._value - 1);
    },

    plus: function () {
        if (this.$plusButton.hasClass('disabled')) return;

        this._setValue(this._value + 1);
    },

    value: function (value) {
        if (arguments.length === 0) {
            return this._value;
        } else if (this._value != value) {
            this._setValue(value);
        }
    },

    _setValue: function (value) {
        if (value < this.options.minValue) {
            value = this.options.minValue;
        }

        if (value > this.options.maxValue) {
            value = this.options.maxValue;
        }

        this._value = value;
        this.$input.val(this._value);

        this.$minusButton.toggleClass('disabled', this._value == this.options.minValue);
        this.$plusButton.toggleClass('disabled', this._value == this.options.maxValue);

        this.trigger('change', this._value)
    }
});

plugin('stepper', Stepper);

module.exports = Stepper;