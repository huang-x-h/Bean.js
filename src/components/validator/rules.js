/**
 * Created by huangxinghui on 2015/8/25.
 */

var _ = require('underscore');
var util = require('../../utils/validator');
var substitute = require('../../utils/string').substitute;
var locale = require('../../locale');
var ruleMessage;
var rules = {};
var numberOptions = {
    domain: 'int',
    max: Infinity,
    min: -Infinity
};
var compareOptions = {
    numeric: false,
    comparison: '',
    operation: ''
};

locale.get(function (data) {
    ruleMessage = data.validator;
});

function addValidator (name, fn) {

}

function addAsyncValidator (name, fn) {

}

function addRule(name, validate, message) {
    rules[name] = {
        validate: validate,
        message: message
    };
}

addRule('required', util.isBlank, function (display) {
    return substitute(ruleMessage.requiredError, display);
});

addRule('pattern', util.matches, function () {
    return ruleMessage.patternError;
});

addRule('email', util.isEmail, function () {
    return ruleMessage.emailError;
});

addRule('length', util.isLength, function (display, min, max) {
    if (min && max) {
        return substitute(ruleMessage.notBetweenError, display, min, max);
    } else if (min) {
        return substitute(ruleMessage.tooShortError, display, min);
    } else {
        return substitute(ruleMessage.tooLongError, display, max);
    }
});

addRule('ip', util.isIP, function (display, version) {
    if (version === '6') {
        return ruleMessage.ip6Error;
    } else {
        return ruleMessage.ip4Error;
    }
});

addRule('compare', function (str, options) {
    options = _.extend({}, compareOptions, options);

    var comparison = options.comparison;

    if (options.numeric) {
        str = +str;
        comparison = +comparison;
    }

    var result = true;
    switch (options.operation) {
        case 'eq':
            if (str !== comparison)
                result = false;
            break;
        case 'le':
            if (str > comparison)
                result = false;
            break;
        case 'ge':
            if (str < comparison)
                result = false;
            break;
        case 'lt':
            if (str >= comparison)
                result = false;
            break;
        case 'gt':
            if (str <= comparison)
                result = false;
            break;
        case 'ne':
            if (str === comparison)
                result = false;
            break;
        default:
    }

    return result;
}, function (display, options) {
    var operation = options.operation;
    switch (operation) {
        case 'eq':
            return ruleMessage.equalError;
            break;
        case 'le':
            return ruleMessage.lessEqualError;
            break;
        case 'ge':
            return ruleMessage.greaterEqualError;
            break;
        case 'lt':
            return ruleMessage.lessError;
            break;
        case 'gt':
            return ruleMessage.greaterError;
            break;
        case 'ne':
            return ruleMessage.notEqualError;
            break;
        default:
            return '';
    }
});

addRule('number', function (str, options) {
    options = _.extend({}, numberOptions, options);

    if (options.domain === 'int') {
        util.isInt(str, options);
    } else {
        util.isDecimal(str, options);
    }
}, function (display, options) {

});

module.exports = {
    getRule: function (name) {
        return rules[name];
    },

    getMessage: function (name) {
        var args = Array.prototype.slice.call(arguments, 1),
            message = rules[name].message;

        if (_.isFunction(message)) {
            return message.apply(null, args);
        }

        return message;
    }
};