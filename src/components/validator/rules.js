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
    domain: 'int', // int/decimal
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
            return substitute(ruleMessage.equalError, display, options.display);
            break;
        case 'le':
            return substitute(ruleMessage.lessEqualError, display, options.display);
            break;
        case 'ge':
            return substitute(ruleMessage.greaterEqualError, display, options.display);
            break;
        case 'lt':
            return substitute(ruleMessage.lessError, display, options.display);
            break;
        case 'gt':
            return substitute(ruleMessage.greaterError, display, options.display);
            break;
        case 'ne':
            return substitute(ruleMessage.notEqualError, display, options.display);
            break;
        default:
            return '';
    }
});

addRule('number', function (str, options) {
    options = _.extend({}, numberOptions, options);

    var result = true;
    if (str === '') return result;

    str = +str;
    if (options.domain === 'int') {
        result = util.isInt(str, options);
    } else {
        result = util.isDecimal(str, options);
    }
    return result;
}, function (display, options) {
    var definition = options.domain === 'int' ? ruleMessage.integerDefinition : ruleMessage.numberDefinition;

    if (options.min && options.max) {
        return substitute(ruleMessage.numberBetweenError, display, definition, options.min, options.max);
    } else if (options.min) {
        return substitute(ruleMessage.numberGreaterError, display, definition, options.min);
    } else if (options.max) {
        return substitute(ruleMessage.numberLessError, display, definition, options.max);
    } else {
        return substitute(ruleMessage.numberError, display, definition);
    }
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