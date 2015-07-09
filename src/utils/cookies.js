/**
 * Created by huangxinghui on 2015/6/29.
 */

var $ = require('jquery');
var _ = require('underscore');
var log = require('./log');
var Bean = require('../core');

var lastCookies = {};
var lastCookieString = '';
var $base = $(document).find('base');

function baseHref() {
    var href = $base.attr('href');
    return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
}

function cookieReader() {
    var currentCookieString = document.cookie,
        cookieArray, cookie, i, index, name;

    if (currentCookieString !== lastCookieString) {
        lastCookieString = currentCookieString;
        cookieArray = lastCookieString.split('; ');
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
            cookie = cookieArray[i];
            index = cookie.indexOf('=');
            if (index > 0) { //ignore nameless cookies
                name = decodeURIComponent(cookie.substring(0, index));
                // the first value that is seen for a cookie is the most
                // specific one.  values for the same cookie name that
                // follow are for less specific paths.
                if (lastCookies[name] === undefined) {
                    lastCookies[name] = decodeURIComponent(cookie.substring(index + 1));
                }
            }
        }
    }
    return lastCookies;
}

function cookieWriter(name, value, options) {
    var cookiePath = baseHref(),
        path, expires;

    options = options || {};
    expires = options.expires;

    path = _.isUndefined(options.path) ? cookiePath : options.path;
    if (value === undefined) {
        expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
        value = '';
    }
    if (_.isString(expires)) {
        expires = new Date(expires);
    }

    var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    str += path ? ';path=' + path : '';
    str += options.domain ? ';domain=' + options.domain : '';
    str += expires ? ';expires=' + expires.toUTCString() : '';
    str += options.secure ? ';secure' : '';

    // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
    // - 300 cookies
    // - 20 cookies per unique domain
    // - 4096 bytes per cookie
    var cookieLength = str.length + 1;
    if (cookieLength > 4096) {
        log.warn("Cookie '" + name +
        "' possibly not set or overflowed because it was too large (" +
        cookieLength + " > 4096 bytes)!");
    }

    return str;
}

module.exports = Bean.Cookie = {
    get: function (key) {
        return cookieReader()[key];
    },

    getObject: function (key) {
        var value = this.get(key);
        return value ? JSON.parse(value) : value;
    },

    put: function (key, value, options) {
        cookieWriter(key, value, options);
    },

    putObject: function (key, value, options) {
        this.put(key, JSON.stringify(value), options);
    }
};