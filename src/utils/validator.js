/**
 * Created by huangxinghui on 2015/8/10.
 */

// copy from https://github.com/chriso/validator.js
var Bean = require('../core');

var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
    , ipv6Block = /^[0-9A-F]{1,4}$/i
    , numeric = /^[-+]?[0-9]+$/
    , decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/
    , int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/
    , float = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
    , email = /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9\-])+\.)+[a-zA-Z0-9]{2,4}$/;

var validator = Bean.validator = {};

validator.extend = function (name, fn) {
    validator[name] = function () {
        var args = Array.prototype.slice.call(arguments);
        args[0] = validator.toString(args[0]);
        return fn.apply(validator, args);
    };
};

validator.toString = function (input) {
    if (typeof input === 'object' && input !== null && input.toString) {
        input = input.toString();
    } else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
        input = '';
    } else if (typeof input !== 'string') {
        input += '';
    }
    return input;
};

validator.toDate = function (date) {
    if (Object.prototype.toString.call(date) === '[object Date]') {
        return date;
    }
    date = Date.parse(date);
    return !isNaN(date) ? new Date(date) : null;
};

validator.equals = function (str, comparison) {
    return str === validator.toString(comparison);
};

validator.contains = function (str, elem) {
    return str.indexOf(validator.toString(elem)) >= 0;
};

validator.matches = function (str, pattern, modifiers) {
    if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
        pattern = new RegExp(pattern, modifiers);
    }
    return pattern.test(str);
};

validator.isBlank = function (str) {
    return '' !== str.replace(/^\s+/g, '').replace(/\s+$/g, '');
};

validator.isIP = function (str, version) {
    version = validator.toString(version);
    if (!version) {
        return validator.isIP(str, 4) || validator.isIP(str, 6);
    } else if (version === '4') {
        if (!ipv4Maybe.test(str)) {
            return false;
        }
        var parts = str.split('.').sort(function (a, b) {
            return a - b;
        });
        return parts[3] <= 255;
    } else if (version === '6') {
        var blocks = str.split(':');
        var foundOmissionBlock = false; // marker to indicate ::

        // At least some OS accept the last 32 bits of an IPv6 address
        // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
        // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
        // and '::a.b.c.d' is deprecated, but also valid.
        var foundIPv4TransitionBlock = validator.isIP(blocks[blocks.length - 1], 4);
        var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

        if (blocks.length > expectedNumberOfBlocks)
            return false;

        // initial or final ::
        if (str === '::') {
            return true;
        } else if (str.substr(0, 2) === '::') {
            blocks.shift();
            blocks.shift();
            foundOmissionBlock = true;
        } else if (str.substr(str.length - 2) === '::') {
            blocks.pop();
            blocks.pop();
            foundOmissionBlock = true;
        }

        for (var i = 0; i < blocks.length; ++i) {
            // test for a :: which can not be at the string start/end
            // since those cases have been handled above
            if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
                if (foundOmissionBlock)
                    return false; // multiple :: in address
                foundOmissionBlock = true;
            } else if (foundIPv4TransitionBlock && i == blocks.length - 1) {
                // it has been checked before that the last
                // block is a valid IPv4 address
            } else if (!ipv6Block.test(blocks[i])) {
                return false;
            }
        }

        if (foundOmissionBlock) {
            return blocks.length >= 1;
        } else {
            return blocks.length === expectedNumberOfBlocks;
        }
    }
    return false;
};

validator.isNumeric = function (str) {
    return numeric.test(str);
};

validator.isEmail = function (str) {
    return email.test(str);
};

validator.isInt = function (str, options) {
    options = options || {};
    return int.test(str)
        && (!options.hasOwnProperty('min') || str >= options.min)
        && (!options.hasOwnProperty('max') || str <= options.max);
};

validator.isDecimal = function (str, options) {
    options = options || {};

    return decimal.test(str)
        && (!options.hasOwnProperty('min') || str >= options.min)
        && (!options.hasOwnProperty('max') || str <= options.max);
};

validator.isFloat = function (str) {
    return str !== '' && float.test(str);
};

validator.isLength = function (str, min, max) {
    var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
    var len = str.length - surrogatePairs.length;
    return len >= min && (typeof max === 'undefined' || len <= max);
};

validator.isAfter = function (str, date) {
    var comparison = validator.toDate(date || new Date())
        , original = validator.toDate(str);
    return !!(original && comparison && original > comparison);
};

validator.isBefore = function (str, date) {
    var comparison = validator.toDate(date || new Date())
        , original = validator.toDate(str);
    return original && comparison && original < comparison;
};

!function init() {
    for (var name in validator) {
        if (typeof validator[name] !== 'function' || name === 'toString' ||
            name === 'toDate' || name === 'extend') {
            continue;
        }
        validator.extend(name, validator[name]);
    }
}();

module.exports = validator;