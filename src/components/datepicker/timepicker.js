/**
 * Created by huangxinghui on 2015/8/13.
 */

var plugin = require('../../plugin');
var Widget = require('../../widget');
var DatePicker = require('./datepicker');
var template = require('./timepicker.hbs');

var TimePicker = DatePicker.extend({
    options: {
        inline: false,
        startView: 0,
        endView: 0,
        defaultViewDate: new Date(),
        orientation: "auto",
        rtl: false,
        immediateUpdates: false,
        autoclose: true,
        showOnFocus: true,
        keyboardNavigation: true,
        zIndexOffset: 10,
        format: 'HH:mm:ss',
        container: 'body'
    },

    _buildView: function () {
        this.parseFormat = 'HH:mm:ss';

        this.picker.append(template());
    },

    showMode: function () {
        var d = new Date(this.viewDate),
            hour, minute, second;

        hour = d.getHours();
        if (hour < 10) hour = '0' + hour;

        minute = d.getMinutes();
        if (minute < 10) minute = '0' + minute;

        second = d.getSeconds();
        if (second < 10) second = '0' + second;

        this.picker.find('.label-hours').text(hour);
        this.picker.find('.label-minutes').text(minute);
        this.picker.find('.label-seconds').text(second);

        this.picker.children('div').show();
    },

    keydown: function () {
        if (!this.picker.is(':visible')) {
            if (e.keyCode === 40 || e.keyCode === 27) // allow down to re-show picker
                this.show();
            return;
        }
    }
});

plugin('timepicker', TimePicker);

module.exports = TimePicker;