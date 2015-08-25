/**
 * Created by huangxinghui on 2015/8/10.
 */

// copy from https://github.com/eternicode/bootstrap-datepicker
var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var locale = require('../../locale');
var util = require('../../utils/date');
var $document = require('../../document');
var timeTemplate = require('./time.hbs');
var dayTemplate = require('./day.hbs');
var monthTemplate = require('./month.hbs');
var yearTemplate = require('./year.hbs');
var wrapperTemplate = require('./wrapper.hbs');
var todayTemplate = require('./today.hbs');
var nowTemplate = require('./now.hbs');
var dates;
locale.get(function (value) {
    dates = value.datepicker;
});

var modes = [
    {
        clsName: 'days',
        navFnc: 'Month',
        navStep: 1
    },
    {
        clsName: 'months',
        navFnc: 'FullYear',
        navStep: 1
    },
    {
        clsName: 'years',
        navFnc: 'FullYear',
        navStep: 10
    }];

function isDateEquals(date1, date2) {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}

var DatePicker = Widget.extend({
    options: {
        inline: false,
        startView: 0,
        endView: 2,
        calendarWeeks: false,
        defaultViewDate: new Date(),
        datesDisabled: [],
        daysOfWeekDisabled: [],
        daysOfWeekHighlighted: [],
        endDate: '',
        startDate: '',
        orientation: "auto",
        rtl: false,
        immediateUpdates: false,
        autoclose: true,
        showOnFocus: true,
        keyboardNavigation: true,
        zIndexOffset: 10,
        format: '',
        showTime: false,
        todayBtn: true,
        todayHighlight: true,
        weekStart: 0,
        container: 'body'
    },

    _create: function () {
        this.picker = $(wrapperTemplate());

        this.viewDate = this.options.defaultViewDate;
        this.focusDate = null;

        var plc = String(this.options.orientation).toLowerCase().split(/\s+/g),
            _plc = this.options.orientation.toLowerCase();

        if (!_plc || _plc === 'auto')
            this.options.orientation = {x: 'auto', y: 'auto'};
        else {
            this.options.orientation.x = plc[0] || 'auto';
            this.options.orientation.y = plc[0] || 'auto';
        }

        if (!this.options.format) {
            this.options.format = this.options.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
        }

        this.viewMode = this.options.startView;
        this.isInline = this.options.inline;
        this.isInput = this.$element.is('input');
        this.component = this.$element.hasClass('date') ? this.$element.find('.add-on, .input-group-addon, .btn') : false;
        this.hasInput = this.component && this.$element.find('input').length;
        if (this.component && this.component.length === 0)
            this.component = false;

        this.options.weekStart %= 7;
        this.options.weekEnd = ((this.options.weekStart + 6) % 7);

        if (this.isInline) {
            this.picker.addClass('datepicker-inline').appendTo(this.$element);
        } else {
            this.picker.addClass('datepicker-dropdown dropdown-menu');
        }

        if (this.options.rtl) {
            this.picker.addClass('datepicker-rtl');
        }

        if (this.options.calendarWeeks)
            this.picker.find('tfoot .today, tfoot')
                .attr('colspan', function (i, val) {
                    return parseInt(val) + 1;
                });

        this._allow_update = false;

        this._buildView();
        this._bindEvent();

        this._allow_update = true;

        this.update();

        if (this.isInline) {
            this.show();
        }
    },

    _buildView: function () {
        this.parseFormat = this.options.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';

        this.setStartDate(this.options.startDate);
        this.setEndDate(this.options.endDate);
        this.setDaysOfWeekDisabled(this.options.daysOfWeekDisabled);
        this.setDaysOfWeekHighlighted(this.options.daysOfWeekHighlighted);
        this.setDatesDisabled(this.options.datesDisabled);

        this._buildMonthAndYearView();
        this._buildDayView();
    },

    _buildMonthAndYearView: function () {
        this.picker.append(yearTemplate());
        this.picker.append(monthTemplate(dates));
    },

    _buildDayView: function () {
        this.picker.append(dayTemplate());

        this.fillDow();
    },

    _bindEvent: function () {
        var events;

        if (this.isInput) { // single input
            events = {
                'keyup': _.bind(function (e) {
                    if (_.indexOf([27, 37, 39, 38, 40, 32, 13, 9], e.keyCode) === -1)
                        this.update();
                }, this),
                'keydown': 'keydown',
                'blur': _.bind(function (e) {
                    this._focused_from = e.target;
                }, this)
            };
        }
        else if (this.component && this.hasInput) { // component: input + button
            events = {
                'keyup input': _.bind(function (e) {
                    if (_.indexOf([27, 37, 39, 38, 40, 32, 13, 9], e.keyCode) === -1)
                        this.update();
                }, this),
                'keydown input': 'keydown',
                'blur *': _.bind(function (e) {
                    this._focused_from = e.target;
                }, this),
                'click .input-group-addon': 'show'
            };
        }
        else {
            events = {
                'click': 'show'
            };
        }

        if (this.options.showOnFocus === true) {
            events.focus = 'show';
        }

        if (this.options.immediateUpdates) {
            _.extend(events, {
                'changeYear': '_changeDate',
                'changeMonth': '_changeDate',
                'changeHour': '_changeDate',
                'changeMinute': '_changeDate',
                'changeSecond': '_changeDate'
            });
        }

        this._on(events);

        this._secondaryEvents = [
            [this.picker, {
                click: _.bind(this.click, this)
            }],
            [$document, {
                mousedown: _.bind(function (e) {
                    // Clicked outside the datepicker, hide it
                    if (!(this.$element.is(e.target)
                        || this.$element.find(e.target).length
                        || this.picker.is(e.target)
                        || this.picker.find(e.target).length
                        || this.picker.hasClass('datepicker-inline'))) {
                        this.viewDate = this.date || this.options.defaultViewDate;
                        this.hide();
                    }
                }, this)
            }]
        ];
    },

    _applyEvents: function (evs) {
        for (var i = 0, el, ch, ev; i < evs.length; i++) {
            el = evs[i][0];
            if (evs[i].length === 2) {
                ch = undefined;
                ev = evs[i][1];
            }
            else if (evs[i].length === 3) {
                ch = evs[i][1];
                ev = evs[i][2];
            }
            el.on(ev, ch);
        }
    },
    _unapplyEvents: function (evs) {
        for (var i = 0, el, ev, ch; i < evs.length; i++) {
            el = evs[i][0];
            if (evs[i].length === 2) {
                ch = undefined;
                ev = evs[i][1];
            }
            else if (evs[i].length === 3) {
                ch = evs[i][1];
                ev = evs[i][2];
            }
            el.off(ev, ch);
        }
    },

    _attachSecondaryEvents: function () {
        this._detachSecondaryEvents();
        this._applyEvents(this._secondaryEvents);
    },

    _detachSecondaryEvents: function () {
        this._unapplyEvents(this._secondaryEvents);
    },

    _changeDate: function (e, date) {
        this.update(date);
    },

    update: function (date) {
        if (!this._allow_update)
            return this;

        var oldDates = this.date instanceof Date ? new Date(this.date) : undefined,
            fromArgs = false;
        if (date) {
            fromArgs = true;
        }
        else {
            date = this.isInput ? this.$element.val() : this.$element.data('date') || this.$element.find('input').val();
        }

        this.date = util.parse(date, this.parseFormat);

        if (this.date)
            this.viewDate = new Date(this.date);
        else if (this.viewDate < this.options.startDate)
            this.viewDate = new Date(this.options.startDate);
        else if (this.viewDate > this.options.endDate)
            this.viewDate = new Date(this.options.endDate);
        else
            this.viewDate = this.options.defaultViewDate;

        if (fromArgs) {
            // setting date by clicking
            this.setValue();
        }
        else if (date) {
            // setting date by typing
            if (String(oldDates) !== String(this.date))
                this.trigger('change');
        }
        if (!this.date && oldDates)
            this.trigger('clear');

        this.showMode();
        this.$element.change();
        return this;
    },

    showMode: function (dir) {
        if (dir) {
            this.viewMode = Math.max(this.options.startView, Math.min(this.options.endView, this.viewMode + dir));
        }

        this.picker.children('div').hide().filter('.datepicker-' + modes[this.viewMode].clsName).show();

        switch (this.viewMode) {
            case 0:
                this.updateDays();
                break;
            case 1:
                this.updateMonths();
                break;
            case 2:
                this.updateYears();
                break;
        }

        this.updateNavArrows();
    },

    fillDow: function () {
        var dowCnt = this.options.weekStart,
            html = '<tr>';
        if (this.options.calendarWeeks) {
            this.picker.find('.datepicker-days .datepicker-switch')
                .attr('colspan', function (i, val) {
                    return parseInt(val) + 1;
                });
            html += '<th class="cw">&#160;</th>';
        }
        while (dowCnt < this.options.weekStart + 7) {
            html += '<th class="dow">' + dates.daysMin[(dowCnt++) % 7] + '</th>';
        }
        html += '</tr>';
        this.picker.find('.datepicker-days thead').append(html);

        if (this.options.showTime) {
            this.picker.find('.datepicker-days tfoot').append(this.getNowTemplate());
        } else {
            this.picker.find('.datepicker-days tfoot').append(todayTemplate(dates));
        }
    },

    getNowTemplate: function () {
        return nowTemplate(dates);
    },

    getClassNames: function (date) {
        var cls = [],
            year = this.viewDate.getFullYear(),
            month = this.viewDate.getMonth(),
            today = new Date();

        if (date.getFullYear() < year || (date.getFullYear() === year && date.getMonth() < month)) {
            cls.push('old');
        }
        else if (date.getFullYear() > year || (date.getFullYear() === year && date.getMonth() > month)) {
            cls.push('new');
        }
        if (this.focusDate && isDateEquals(date, this.focusDate))
            cls.push('focused');
        // Compare internal  date with local today, not  today
        if (this.options.todayHighlight &&
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()) {
            cls.push('today');
        }
        if (this.date && isDateEquals(this.date, date))
            cls.push('active');
        if (date.valueOf() < this.options.startDate || date.valueOf() > this.options.endDate ||
            _.indexOf(this.options.daysOfWeekDisabled, date.getDay()) !== -1) {
            cls.push('disabled');
        }
        if (_.indexOf(this.options.daysOfWeekHighlighted, date.getDay()) !== -1) {
            cls.push('highlighted');
        }
        if (this.options.datesDisabled.length > 0 &&
            _.find(this.options.datesDisabled, function (d) {
                return isDateEquals(date, d);
            })) {
            cls.push('disabled', 'disabled-date');
        }

        if (this.range) {
            if (date > this.range[0] && date < this.range[this.range.length - 1]) {
                cls.push('range');
            }
            if (_.indexOf(this.range, date.valueOf()) !== -1) {
                cls.push('selected');
            }
        }
        return cls;
    },

    updateYears: function () {
        var d = new Date(this.viewDate),
            year = d.getFullYear(),
            startYear = this.options.startDate !== -Infinity ? this.options.startDate.getFullYear() : -Infinity,
            endYear = this.options.endDate !== Infinity ? this.options.endDate.getFullYear() : Infinity,
            html = '';

        year = parseInt(year / 10, 10) * 10;
        var yearCont = this.picker.find('.datepicker-years')
            .find('.datepicker-switch')
            .text(year + '-' + (year + 9))
            .end()
            .find('td');
        year -= 1;
        var dateY = this.date && this.date.getFullYear(),
            classes;
        for (var i = -1; i < 11; i++) {
            classes = ['year'];

            if (i === -1)
                classes.push('old');
            else if (i === 10)
                classes.push('new');
            if (year === dateY)
                classes.push('active');
            if (year < startYear || year > endYear)
                classes.push('disabled');

            html += '<span class="' + classes.join(' ') + '">' + year + '</span>';
            year += 1;
        }
        yearCont.html(html);
    },

    updateMonths: function () {
        var d = new Date(this.viewDate),
            year = d.getFullYear(),
            startYear = this.options.startDate !== -Infinity ? this.options.startDate.getFullYear() : -Infinity,
            startMonth = this.options.startDate !== -Infinity ? this.options.startDate.getMonth() : -Infinity,
            endYear = this.options.endDate !== Infinity ? this.options.endDate.getFullYear() : Infinity,
            endMonth = this.options.endDate !== Infinity ? this.options.endDate.getMonth() : Infinity;

        var months = this.picker.find('.datepicker-months')
            .find('.datepicker-switch')
            .text(year)
            .end()
            .find('span').removeClass('active');

        if (this.date) {
            if (this.date.getFullYear() === year)
                months.eq(this.date.getMonth()).addClass('active');
        }

        if (year < startYear || year > endYear) {
            months.addClass('disabled');
        }
        if (year === startYear) {
            months.slice(0, startMonth).addClass('disabled');
        }
        if (year === endYear) {
            months.slice(endMonth + 1).addClass('disabled');
        }
    },

    updateDays: function () {
        var d = new Date(this.viewDate),
            year = d.getFullYear(),
            month = d.getMonth(),
            hour, minute, second;

        if (isNaN(year) || isNaN(month))
            return;

        this.picker.find('.datepicker-days thead .datepicker-switch')
            .text(util.format(new Date(year, month), 'YYYY-MM'));
        this.picker.find('tfoot .today')
            .toggle(this.options.todayBtn !== false);

        var prevMonth = new Date(year, month - 1, 28),
            day = util.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
        prevMonth.setDate(day);
        prevMonth.setDate(day - (prevMonth.getDay() - this.options.weekStart + 7) % 7);

        var nextMonth = new Date(prevMonth);
        nextMonth.setDate(nextMonth.getDate() + 42);
        nextMonth = nextMonth.valueOf();
        var html = [];
        var clsName;
        while (prevMonth.valueOf() < nextMonth) {
            if (prevMonth.getDay() === this.options.weekStart) {
                html.push('<tr>');
                if (this.options.calendarWeeks) {
                    // ISO 8601: First week contains first thursday.
                    // ISO also states week starts on Monday, but we can be more abstract here.
                    var
                    // Start of current week: based on weekstart/current date
                        ws = new Date(+prevMonth + (this.options.weekStart - prevMonth.getDay() - 7) % 7 * 864e5),
                    // Thursday of this week
                        th = new Date(Number(ws) + (7 + 4 - ws.getDay()) % 7 * 864e5),
                    // First Thursday of year, year from thursday
                        yth = new Date(Number(yth = new Date(th.getFullYear(), 0, 1)) + (7 + 4 - yth.getDay()) % 7 * 864e5),
                    // Calendar week: ms between thursdays, div ms per day, div 7 days
                        calWeek = (th - yth) / 864e5 / 7 + 1;
                    html.push('<td class="cw">' + calWeek + '</td>');

                }
            }
            clsName = this.getClassNames(prevMonth);
            clsName.push('day');

            clsName = _.unique(clsName);
            html.push('<td class="' + clsName.join(' ') + '">' + prevMonth.getDate() + '</td>');
            if (prevMonth.getDay() === this.options.weekEnd) {
                html.push('</tr>');
            }
            prevMonth.setDate(prevMonth.getDate() + 1);
        }
        this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

        if (this.options.showTime) {
            hour = d.getHours();
            if (hour < 10) hour = '0' + hour;

            minute = d.getMinutes();
            if (minute < 10) minute = '0' + minute;

            second = d.getSeconds();
            if (second < 10) second = '0' + second;

            this.picker.find('.datepicker-days .label-hours').text(hour);
            this.picker.find('.datepicker-days .label-minutes').text(minute);
            this.picker.find('.datepicker-days .label-seconds').text(second);
        }
    },

    updateHours: function () {
        var d = new Date(this.viewDate),
            hour = d.getHours(),
            html = '',
            i = 0,
            clsName,
            $template;

        $template = $(timeTemplate({
            title: 'Choose Hour'
        }));

        for (; i < 24; i++) {
            clsName = ['hour'];
            if (i === hour) {
                clsName.push('active');
            }
            html += '<span class="' + clsName.join(' ') + '">' + i + '</span>';
        }
        $template.find('td').append(html);

        this.picker.append($template);
        this.picker.children('div').hide().filter('.datepicker-times').show();
    },

    updateMinutes: function () {
        var d = new Date(this.viewDate),
            minute = d.getMinutes(),
            html = '',
            i = 0,
            j, v, clsName, $template;

        $template = $(timeTemplate({
            title: 'Choose Minute'
        }));

        for (; i < 6; i++) {
            for (j = 0; j < 10; j++) {
                clsName = ['minute'];
                v = j + i * 10;
                if (v === minute) {
                    clsName.push('active');
                }
                html += '<span class="' + clsName.join(' ') + '">' + v + '</span>';
            }
        }
        $template.find('td').append(html);

        this.picker.append($template);
        this.picker.children('div').hide().filter('.datepicker-times').show();
    },

    updateSeconds: function () {
        var d = new Date(this.viewDate),
            second = d.getSeconds(),
            html = '',
            i = 0,
            j, v, clsName, $template;

        $template = $(timeTemplate({
            title: 'Choose Second'
        }));

        for (; i < 6; i++) {
            for (j = 0; j < 10; j++) {
                clsName = ['second'];
                v = j + i * 10;
                if (v === second) {
                    clsName.push('active');
                }
                html += '<span class="' + clsName.join(' ') + '">' + v + '</span>';
            }
        }
        $template.find('td').append(html);

        this.picker.append($template);
        this.picker.children('div').hide().filter('.datepicker-times').show();
    },

    show: function () {
        if (!this.isInline)
            this.picker.appendTo(this.options.container);
        this.place();
        this.picker.show();
        this._attachSecondaryEvents();
        this.trigger('show');
        return this;
    },

    hide: function () {
        if (this.isInline)
            return this;
        if (!this.picker.is(':visible'))
            return this;
        this.picker.hide().detach();
        this._detachSecondaryEvents();
        this.viewMode = this.options.startView;
        this.showMode();

        if (this.isInput && this.$element.val() || this.hasInput && this.$element.find('input').val())
            this.setValue();

        this.trigger('hide');
        return this;
    },

    setValue: function () {
        var formatted = this.getFormattedDate();
        if (!this.isInput) {
            if (this.component) {
                this.$element.find('input').val(formatted);
            }
        }
        else {
            this.$element.val(formatted);
        }
        return this;
    },

    getFormattedDate: function (format) {
        if (format === undefined)
            format = this.options.format;

        return util.format(this.date, format);
    },

    clearDate: function () {
        var element;
        if (this.isInput) {
            element = this.$element;
        } else if (this.component) {
            element = this.$element.find('input');
        }

        if (element) {
            element.val('');
        }

        this.update();
        this.trigger('changeDate');

        if (this.options.autoclose) {
            this.hide();
        }
    },

    setRange: function (range) {
        if (!range || !range.length)
            delete this.range;
        else
            this.range = _.map(range, function (d) {
                return d.valueOf();
            });
        this.showMode();
    },

    setDate: function (date) {
        this.update(date);
        this.trigger('changeDate');
        this.setValue();
        return this;
    },

    setStartDate: function (startDate) {
        this.options.startDate = util.parse(startDate, this.parseFormat);
        this.options.startDate = this.options.startDate || -Infinity;
        this.update();
        this.updateNavArrows();
        return this;
    },

    setEndDate: function (endDate) {
        this.options.endDate = util.parse(endDate, this.parseFormat);
        this.options.endDate = this.options.endDate || Infinity;
        this.update();
        this.updateNavArrows();
        return this;
    },

    setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
        if (!_.isArray(daysOfWeekDisabled))
            daysOfWeekDisabled = daysOfWeekDisabled.split(/[,\s]*/);
        daysOfWeekDisabled = _.map(daysOfWeekDisabled, function (d) {
            return parseInt(d, 10);
        });

        this.options.daysOfWeekDisabled = daysOfWeekDisabled;
        this.update();
        this.updateNavArrows();
        return this;
    },

    setDaysOfWeekHighlighted: function (daysOfWeekHighlighted) {
        if (!_.isArray(daysOfWeekHighlighted))
            daysOfWeekHighlighted = daysOfWeekHighlighted.split(/[,\s]*/);
        daysOfWeekHighlighted = _.map(daysOfWeekHighlighted, function (d) {
            return parseInt(d, 10);
        });

        this.options.daysOfWeekHighlighted = daysOfWeekHighlighted;
        this.update();
        return this;
    },

    setDatesDisabled: function (datesDisabled) {
        if (_.isArray(datesDisabled)) {
            this.options.datesDisabled = _.map(datesDisabled, function (d) {
                return util.parse(d, this.parseFormat);
            });
        } else {
            this.options.datesDisabled.push(util.parse(datesDisabled, this.parseFormat));
        }

        this.update();
        this.updateNavArrows();
    },

    place: function () {
        if (this.isInline)
            return this;
        var calendarWidth = this.picker.outerWidth(),
            calendarHeight = this.picker.outerHeight(),
            visualPadding = 10,
            container = $(this.options.container),
            windowWidth = container.width(),
            windowHeight = container.height(),
            scrollTop = container.scrollTop(),
            appendOffset = container.offset();

        var parentsZindex = [];
        this.$element.parents().each(function () {
            var itemZIndex = $(this).css('z-index');
            if (itemZIndex !== 'auto' && itemZIndex !== 0) parentsZindex.push(parseInt(itemZIndex));
        });
        var zIndex = Math.max.apply(Math, parentsZindex) + this.options.zIndexOffset;
        var offset = this.component ? this.component.parent().offset() : this.$element.offset();
        var height = this.component ? this.component.outerHeight(true) : this.$element.outerHeight(false);
        var width = this.component ? this.component.outerWidth(true) : this.$element.outerWidth(false);
        var left = offset.left - appendOffset.left,
            top = offset.top - appendOffset.top;

        this.picker.removeClass(
            'datepicker-orient-top datepicker-orient-bottom ' +
            'datepicker-orient-right datepicker-orient-left'
        );

        if (this.options.orientation.x !== 'auto') {
            this.picker.addClass('datepicker-orient-' + this.options.orientation.x);
            if (this.options.orientation.x === 'right')
                left -= calendarWidth - width;
        }
        // auto x orientation is best-placement: if it crosses a window
        // edge, fudge it sideways
        else {
            if (offset.left < 0) {
                // component is outside the window on the left side. Move it into visible range
                this.picker.addClass('datepicker-orient-left');
                left -= offset.left - visualPadding;
            } else if (left + calendarWidth > windowWidth) {
                // the calendar passes the widow right edge. Align it to component right side
                this.picker.addClass('datepicker-orient-right');
                left = offset.left + width - calendarWidth;
            } else {
                // Default to left
                this.picker.addClass('datepicker-orient-left');
            }
        }

        // auto y orientation is best-situation: top or bottom, no fudging,
        // decision based on which shows more of the calendar
        var yorient = this.options.orientation.y,
            top_overflow, bottom_overflow;
        if (yorient === 'auto') {
            top_overflow = -scrollTop + top - calendarHeight;
            bottom_overflow = scrollTop + windowHeight - (top + height + calendarHeight);
            if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
                yorient = 'bottom';
            else
                yorient = 'top';
        }
        this.picker.addClass('datepicker-orient-' + yorient);
        if (yorient === 'top')
            top -= calendarHeight + parseInt(this.picker.css('padding-top'));
        else
            top += height;

        if (this.options.rtl) {
            var right = windowWidth - (left + width);
            this.picker.css({
                top: top,
                right: right,
                zIndex: zIndex
            });
        } else {
            this.picker.css({
                top: top,
                left: left,
                zIndex: zIndex
            });
        }
        return this;
    },

    updateNavArrows: function () {
        if (!this._allow_update)
            return;

        var d = new Date(this.viewDate),
            year = d.getFullYear(),
            month = d.getMonth();
        switch (this.viewMode) {
            case 0:
                if (this.options.startDate !== -Infinity && year <= this.options.startDate.getFullYear()
                    && month <= this.options.startDate.getMonth()) {
                    this.picker.find('.prev').css({visibility: 'hidden'});
                }
                else {
                    this.picker.find('.prev').css({visibility: 'visible'});
                }
                if (this.options.endDate !== Infinity && year >= this.options.endDate.getFullYear()
                    && month >= this.options.endDate.getMonth()) {
                    this.picker.find('.next').css({visibility: 'hidden'});
                }
                else {
                    this.picker.find('.next').css({visibility: 'visible'});
                }
                break;
            case 1:
            case 2:
                if (this.options.startDate !== -Infinity && year <= this.options.startDate.getFullYear()) {
                    this.picker.find('.prev').css({visibility: 'hidden'});
                }
                else {
                    this.picker.find('.prev').css({visibility: 'visible'});
                }
                if (this.options.endDate !== Infinity && year >= this.options.endDate.getFullYear()) {
                    this.picker.find('.next').css({visibility: 'hidden'});
                }
                else {
                    this.picker.find('.next').css({visibility: 'visible'});
                }
                break;
        }
    },

    click: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var target = $(e.target).closest('span, td, th, a'),
            year, month, day, hour, minute, second;
        if (target.length === 1) {
            switch (target[0].nodeName.toLowerCase()) {
                case 'th':
                    this._thClick(target);
                    break;
                case 'span':
                    this._spanClick(target);
                    break;
                case 'td':
                    this._tdClick(target);
                    break;
                case 'a':
                    if (target.hasClass('datepicker-now')) {
                        this.viewDate = new Date();
                        this.showMode();
                    } else {
                        this._setDate(this.viewDate, 'date');
                    }
            }
        }
        if (this.picker.is(':visible') && this._focused_from) {
            $(this._focused_from).focus();
        }
        delete this._focused_from;
    },

    _thClick: function (target) {
        switch (target[0].className) {
            case 'datepicker-switch':
                this.showMode(1);
                break;
            case 'prev':
            case 'next':
                var dir = modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
                switch (this.viewMode) {
                    case 0:
                        this.viewDate = util.addMonths(this.viewDate, dir);
                        this.showMode();
                        this.trigger('changeMonth', this.viewDate);
                        break;
                    case 1:
                    case 2:
                        this.viewDate = util.addYears(this.viewDate, dir);
                        this.showMode();
                        if (this.viewMode === 1)
                            this.trigger('changeYear', this.viewDate);
                        break;
                }
                break;
            case 'today':
                var date = util.startOfDay(new Date());
                var which = this.options.todayBtn ? null : 'view';
                this._setDate(date, which);
                break;
            case 'clear':
                this.clearDate();
                break;
        }
    },

    _spanClick: function (target) {
        var year, month, day, hour, minute, second;

        if (!target.hasClass('disabled')) {
            this.viewDate.setDate(1);
            if (target.hasClass('month')) {
                month = target.parent().find('span').index(target);
                this.viewDate.setMonth(month);
                this.showMode(-1);
                this.trigger('changeMonth', this.viewDate);
            } else if (target.hasClass('year')) {
                year = parseInt(target.text(), 10) || 0;
                this.viewDate.setFullYear(year);
                this.showMode(-1);
                this.trigger('changeYear', this.viewDate);
            } else if (target.hasClass('label')) {
                if (target.hasClass('label-hours')) {
                    this.updateHours();
                } else if (target.hasClass('label-minutes')) {
                    this.updateMinutes();
                } else {
                    this.updateSeconds();
                }
            } else {
                if (target.hasClass('hour')) {
                    hour = parseInt(target.text(), 10) || 0;
                    this.viewDate.setHours(hour);
                    this.trigger('changeHour', this.viewDate);
                    this.picker.find('.datepicker-times').remove();
                    this.viewMode = 0;
                } else if (target.hasClass('minute')) {
                    minute = parseInt(target.text(), 10) || 0;
                    this.viewDate.setMinutes(minute);
                    this.trigger('changeMinute', this.viewDate);
                    this.picker.find('.datepicker-times').remove();
                    this.viewMode = 0;
                } else if (target.hasClass('second')) {
                    second = parseInt(target.text(), 10) || 0;
                    this.viewDate.setSeconds(second);
                    this.trigger('changeSecond', this.viewDate);
                    this.picker.find('.datepicker-times').remove();
                    this.viewMode = 0;
                }

                this.showMode();
            }
        }
    },

    _tdClick: function (target) {
        var year, month, day, hour, minute, second;

        if (target.hasClass('day') && !target.hasClass('disabled')) {
            day = parseInt(target.text(), 10) || 1;
            year = this.viewDate.getFullYear();
            month = this.viewDate.getMonth();

            if (target.hasClass('old')) {
                if (month === 0) {
                    month = 11;
                    year -= 1;
                }
                else {
                    month -= 1;
                }
            }
            else if (target.hasClass('new')) {
                if (month === 11) {
                    month = 0;
                    year += 1;
                }
                else {
                    month += 1;
                }
            }

            if (this.options.showTime) {
                hour = parseInt(this.picker.find('.datepicker-days .label-hours').text(), 10);
                minute = parseInt(this.picker.find('.datepicker-days .label-minutes').text(), 10);
                second = parseInt(this.picker.find('.datepicker-days .label-seconds').text(), 10);

                this._setDate(new Date(year, month, day, hour, minute, second));
            }
            else
                this._setDate(new Date(year, month, day));
        }
    },

    _setDate: function (date, which) {
        if (!which || which === 'date')
            this.date = new Date(date);
        if (!which || which === 'view')
            this.viewDate = date && new Date(date);

        this.showMode();
        this.setValue();
        if (!which || which !== 'view') {
            this.trigger('changeDate');
        }
        var element;
        if (this.isInput) {
            element = this.$element;
        }
        else if (this.component) {
            element = this.$element.find('input');
        }
        if (element) {
            element.change();
        }
        if (this.options.autoclose && (!which || which === 'date')) {
            this.hide();
        }
    },

    dateWithinRange: function (date) {
        return date >= this.options.startDate && date <= this.options.endDate;
    },

    keydown: function (e) {
        if (!this.picker.is(':visible')) {
            if (e.keyCode === 40 || e.keyCode === 27) // allow down to re-show picker
                this.show();
            return;
        }
        var dateChanged = false,
            dir, newViewDate,
            focusDate = this.focusDate || this.viewDate;

        switch (e.keyCode) {
            case 27: // escape
                if (this.focusDate) {
                    this.focusDate = null;
                    this.viewDate = this.date || this.viewDate;
                    this.showMode();
                }
                else
                    this.hide();
                e.preventDefault();
                break;
            case 37: // left
            case 39: // right
                if (!this.options.keyboardNavigation)
                    break;
                dir = e.keyCode === 37 ? -1 : 1;
                if (e.ctrlKey) {
                    newViewDate = util.addYears(focusDate, dir);
                    this.trigger('changeYear', newViewDate);
                }
                else if (e.shiftKey) {
                    newViewDate = util.addMonths(focusDate, dir);
                    this.trigger('changeMonth', newViewDate);
                }
                else {
                    newViewDate = util.addDays(focusDate, dir);
                }
                if (this.dateWithinRange(newViewDate)) {
                    this.focusDate = this.viewDate = newViewDate;
                    this.showMode();
                    this.setValue();
                    e.preventDefault();
                }
                break;
            case 38: // up
            case 40: // down
                if (!this.options.keyboardNavigation)
                    break;
                dir = e.keyCode === 38 ? -1 : 1;
                if (e.ctrlKey) {
                    newViewDate = util.addYears(focusDate, dir);
                    this.trigger('changeYear', newViewDate);
                }
                else if (e.shiftKey) {
                    newViewDate = util.addMonths(focusDate, dir);
                    this.trigger('changeMonth', newViewDate);
                }
                else {
                    newViewDate = util.addDays(focusDate, dir * 7);
                }
                if (this.dateWithinRange(newViewDate)) {
                    this.focusDate = this.viewDate = newViewDate;
                    this.showMode();
                    this.setValue();
                    e.preventDefault();
                }
                break;
            case 32: // spacebar
                // Spacebar is used in manually typing dates in some formats.
                // As such, its behavior should not be hijacked.
                break;
            case 13: // enter
                if (this.options.keyboardNavigation) {
                    dateChanged = true;
                }
                this._setDate(this.focusDate, 'date');
                this.focusDate = null;
                e.preventDefault();
                break;
            case 9: // tab
                this.focusDate = null;
                this.viewDate = this.date || this.viewDate;
                this.showMode();
                this.hide();
                break;
        }
        if (dateChanged) {
            if (this.date)
                this.trigger('changeDate');
            else
                this.trigger('clearDate');

            var element;
            if (this.isInput) {
                element = this.$element;
            }
            else if (this.component) {
                element = this.$element.find('input');
            }
            if (element) {
                element.change();
            }
        }
    }
});

plugin('datepicker', DatePicker);

module.exports = DatePicker;