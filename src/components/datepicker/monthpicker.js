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
var moment = require('moment');

var MonthPicker = Widget.extend({
    options: {
        value: null,
        format: 'YYYY-MM',
        selectedDate: null,
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'auto'
        }
    },

    events: {
        'click .input-group-addon': 'toggle'
    },

    _create: function () {
        if (this.options.date) {
            this.moment = moment(this.options.value, this.options.format);
        }else if (this.options.selectedDate) {
            this.moment = moment(this.options.selectedDate);
        } else {
            this.moment = moment();
        }

        this.widget = $(wrapper()).append(monthTemplate({
            year: this.moment.year(),
            monthsShort: moment.monthsShort()
        }));
    },

    toggle: function () {
        this.show();
    },

    show: function () {
        this.widget.show();
        this.place();
    },

    hide: function () {
        this.widget.hide();
        this.widget.remove();
        this.widget = false;
    },

    place: function () {
        var position = this.$element.position(),
            offset = this.$element.offset(),
            vertical = this.options.widgetPositioning.vertical,
            horizontal = this.options.widgetPositioning.horizontal,
            parent;

        if (this.$element.is('input')) {
            parent = this.$element.parent().append(this.widget);
        } else {
            parent = this.$element;
            this.$element.children().first().after(this.widget);
        }

        // Top and bottom logic
        if (vertical === 'auto') {
            if (offset.top + this.widget.height() * 1.5 >= $(window).height() + $(window).scrollTop() &&
                this.widget.height() + this.$element.outerHeight() < offset.top) {
                vertical = 'top';
            } else {
                vertical = 'bottom';
            }
        }

        // Left and right logic
        if (horizontal === 'auto') {
            if (parent.width() < offset.left + this.widget.outerWidth() / 2 &&
                offset.left + this.widget.outerWidth() > $(window).width()) {
                horizontal = 'right';
            } else {
                horizontal = 'left';
            }
        }

        if (vertical === 'top') {
            this.widget.addClass('top').removeClass('bottom');
        } else {
            this.widget.addClass('bottom').removeClass('top');
        }

        if (horizontal === 'right') {
            this.widget.addClass('pull-right');
        } else {
            this.widget.removeClass('pull-right');
        }

        // find the first parent element that has a relative css positioning
        if (parent.css('position') !== 'relative') {
            parent = parent.parents().filter(function () {
                return $(this).css('position') === 'relative';
            }).first();
        }

        if (parent.length === 0) {
            throw new Error('datetimepicker component should be placed within a relative positioned container');
        }

        this.widget.css({
            top: vertical === 'top' ? 'auto' : position.top + this.$element.outerHeight(),
            bottom: vertical === 'top' ? position.top + this.$element.outerHeight() : 'auto',
            left: horizontal === 'left' ? parent.css('padding-left') : 'auto',
            right: horizontal === 'left' ? 'auto' : parent.width() - this.$element.outerWidth()
        });
    }
});

plugin('monthpicker', MonthPicker);

module.exports = MonthPicker;