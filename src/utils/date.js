/**
 * Created by huangxinghui on 2015/8/10.
 */

var Bean = require('../core');
var locale = require('../locale');
var dates;
locale(function (value) {
    dates = value.datepicker;
});

var validParts = /ss?|mm?|HH?|dd{1,3}|DD?|MM{0,3}|YY(?:YY)?/g;
var nonpunctuation = /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g;

var MILLIS_PER_SECOND = 1000;
var MILLIS_PER_MINUTE = 60 * MILLIS_PER_SECOND;
var MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE;
var MILLIS_PER_DAY = 24 * MILLIS_PER_HOUR;

function parseFormat(format) {
    var separators = format.replace(validParts, '\0').split('\0'),
        parts = format.match(validParts);
    if (!separators || !separators.length || !parts || parts.length === 0) {
        throw new Error("Invalid date format.");
    }
    return {separators: separators, parts: parts};
}

function add(date, multiplier, num) {
    var resultTime = date.getTime() + multiplier * num;
    return new Date(resultTime);
}

function addDays(date, days) {
    return add(date, MILLIS_PER_DAY, days);
}

function handleShorterMonth(originalDate, newDate) {
    var result = newDate;
    var originalDayOfMonth = originalDate.getDate();
    if (originalDayOfMonth > result.getDate()) {
        result = addDays(newDate, -(newDate.getDate()));
    }
    return result;
}

function isLeapYear(year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
}

module.exports = Bean.date = {
    format: function (date, format) {
        if (!date)
            return '';

        format = parseFormat(format);
        var val = {
            s: date.getSeconds(),
            m: date.getMinutes(),
            H: date.getHours(),
            D: date.getDate(),
            dd: dates.daysMin[date.getDay()],
            ddd: dates.daysShort[date.getDay()],
            dddd: dates.days[date.getDay()],
            M: date.getMonth() + 1,
            MMM: dates.monthsShort[date.getMonth()],
            MMMM: dates.months[date.getMonth()],
            YY: date.getFullYear().toString().substring(2),
            YYYY: date.getFullYear()
        };
        val.ss = (val.s < 10 ? '0' : '') + val.s;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        val.HH = (val.H < 10 ? '0' : '') + val.H;
        val.DD = (val.D < 10 ? '0' : '') + val.D;
        val.MM = (val.M < 10 ? '0' : '') + val.M;

        date = [];
        var seps = format.separators.slice();
        for (var i = 0, cnt = format.parts.length; i <= cnt; i++) {
            if (seps.length)
                date.push(seps.shift());
            date.push(val[format.parts[i]]);
        }
        return date.join('');
    },

    parse: function (date, format) {
        if (!date)
            return undefined;
        if (date instanceof Date)
            return date;
        if (typeof format === 'string')
            format = parseFormat(format);

        var parts = date && date.match(nonpunctuation) || [],
            part, i;

        date = new Date();
        var parsed = {},
            setters_order = ['YYYY', 'YY', 'MM', 'M', 'DD', 'D', 'HH', 'H', 'mm', 'm', 'ss', 's'],
            setters_map = {
                YYYY: function (d, v) {
                    return d.setFullYear(v);
                },
                YY: function (d, v) {
                    return d.setFullYear(2000 + v);
                },
                M: function (d, v) {
                    if (isNaN(d))
                        return d;
                    v -= 1;
                    while (v < 0) v += 12;
                    v %= 12;
                    d.setMonth(v);
                    while (d.getMonth() !== v)
                        d.setDate(d.getDate() - 1);
                    return d;
                },
                D: function (d, v) {
                    return d.setDate(v);
                },
                H: function (d, v) {
                    return d.setHours(v);
                },
                m: function (d, v) {
                    return d.setMinutes(v);
                },
                s: function (d, v) {
                    return d.setSeconds(v);
                }
            },
            val;

        setters_map['MM'] = setters_map['M'];
        setters_map['DD'] = setters_map['D'];
        setters_map['HH'] = setters_map['H'];
        setters_map['mm'] = setters_map['m'];
        setters_map['ss'] = setters_map['s'];

        var fparts = format.parts.slice();
        if (parts.length === fparts.length) {
            var cnt, _date, s;
            for (i=0, cnt = fparts.length; i < cnt; i++) {
                val = parseInt(parts[i], 10);
                part = fparts[i];
                parsed[part] = val;
            }

            for (i = 0; i < setters_order.length; i++) {
                s = setters_order[i];
                if (s in parsed && !isNaN(parsed[s])) {
                    _date = new Date(date);
                    setters_map[s](_date, parsed[s]);
                    if (!isNaN(_date))
                        date = _date;
                }
            }
        }
        return date;
    },

    utc2local: function (utc) {
        return utc && new Date(utc.getTime() + (utc.getTimezoneOffset() * 60000));
    },

    local2utc: function (local) {
        return local && new Date(local.getTime() - (local.getTimezoneOffset() * 60000));
    },

    startOfDay: function (date, utc) {
        if (utc)
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());

        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },

    endOfDay: function (date, utc) {
        if (utc)
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    },

    addDays: addDays,

    addHours: function (date, hours) {
        return add(date, MILLIS_PER_HOUR, hours);
    },

    addMinutes: function (date, minutes) {
        return add(date, MILLIS_PER_MINUTE, minutes);
    },

    addMonths: function (date, months) {
        var result = new Date(date);
        result.setMonth(date.getMonth() + months);
        result = handleShorterMonth(date, result);
        return result;
    },

    addYears: function (date, years) {
        var result = new Date(date);
        result.setFullYear(date.getFullYear() + years);
        return result;
    },

    getDaysInMonth: function (year, month) {
        return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }
};