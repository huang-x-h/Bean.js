/**
 * Created by huangxinghui on 2015/8/6.
 */
/**
 * Created by huangxinghui on 2015/6/8.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var locale = require('../../locale');
var util = require('../../utils/date');
var monthTemplate = require('./month.hbs');
var yearTemplate = require('./year.hbs');
var DatePicker = require('./datepicker');
var dates = locale.value.datepicker;

var MonthPicker = DatePicker.extend({
    options: {
        inline: false,
        startView: 1,
        endView: 2,
        defaultViewDate: new Date(),
        orientation: "auto",
        rtl: false,
        immediateUpdates: false,
        autoclose: true,
        showOnFocus: true,
        keyboardNavigation: true,
        zIndexOffset: 10,
        format: 'YYYY-MM',
        endDate: null,
        startDate: null,
        container: 'body'
    },

    _buildView: function () {
        this.parseFormat = 'YYYY-MM';

        this.setStartDate(this.options.startDate);
        this.setEndDate(this.options.endDate);

        this._buildMonthAndYearView();
    },

    _spanClick: function (target) {
        var year, month;

        if (!target.hasClass('disabled')) {
            this.viewDate.setDate(1);
            if (target.hasClass('month')) {
                month = target.parent().find('span').index(target);
                year = this.viewDate.getFullYear();
                this.viewDate.setMonth(month);
                this._setDate(new Date(year, month));
                this.trigger('changeMonth', this.viewDate);
            } else if (target.hasClass('year')) {
                year = parseInt(target.text(), 10) || 0;
                this.viewDate.setFullYear(year);
                this.showMode(-1);
                this.trigger('changeYear', this.viewDate);
            }
        }
    }
});

plugin('monthpicker', MonthPicker);

module.exports = MonthPicker;