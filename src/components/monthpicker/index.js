/**
 * Created by huangxinghui on 2015/6/8.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var template = require('./month.hbs');
var moment = require('moment');

plugin('monthpicker', {
    options: {
        date: null,
        selectedDate: null,
        locale: moment.locale(),
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'auto'
        }
    },

    _create: function () {
        if (this.options.date) {
            this.moment = moment(this.options.date, 'YYYY-MM');
        }else if (this.options.selectedDate) {
            this.moment = moment(this.options.selectedDate);
        } else {
            this.moment = moment();
        }

        this.widget = $(template({
            year: this.moment.years(),
            monthsShort: moment.monthsShort()
        }));
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
            vertical = options.widgetPositioning.vertical,
            horizontal = options.widgetPositioning.horizontal,
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