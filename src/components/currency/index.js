/**
 * Created by huangxinghui on 2015/8/27.
 */

var plugin = require('../../plugin');
var Widget = require('../../widget');
var util = require('../../utils/currency');

var Currency = Widget.extend({
    options: {
        thousandsSeparator: ',',
        precision: 2,
        value: ''
    },

    events: {
        'focus': 'onFocus',
        'blur': 'onBlur'
    },

    _create: function () {
        this.setValue(this.options.value);
    },

    onFocus: function (e) {
        this.$element.val(this.currencyValue);
    },

    onBlur: function (e) {
        this.setValue(this.$element.val());
    },

    value: function (value) {
        if (arguments.length === 0) {
            return this.currencyValue;
        } else {
            this.setValue(value);
        }
    },

    setValue: function (value) {
        this.currencyValue = value;
        this.$element.val(util.format(value, this.options.precision, this.options.thousandsSeparator));
    }
});

plugin('currency', Currency);

module.exports = Currency;