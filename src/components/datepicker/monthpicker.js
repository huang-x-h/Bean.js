/**
 * Created by huangxinghui on 2015/8/6.
 */
/**
 * Created by huangxinghui on 2015/6/8.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var monthTemplate = require('./month.hbs');
var wrapper = require('./datepicker.hbs');

var MonthPicker = Widget.extend({
    options: {
        format: 'YYYY-MM'
    }

});

plugin('monthpicker', MonthPicker);

module.exports = MonthPicker;