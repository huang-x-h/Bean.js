/**
 * Created by huangxinghui on 2015/6/29.
 */

var _ = require('underscore');
var Bean = require('../core');
var debug = true;

Bean.debugEnabled = function (flag) {
    debug = flag;
};

function formatError(arg) {
    if (arg instanceof Error) {
        if (arg.stack) {
            arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
                ? 'Error: ' + arg.message + '\n' + arg.stack
                : arg.stack;
        } else if (arg.sourceURL) {
            arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
        }
    }
    return arg;
}

function consoleLog(type) {
    var console = window.console || {},
        logFn = console[type] || console.log || noop,
        hasApply = false;

    // Note: reading logFn.apply throws an error in IE11 in IE8 document mode.
    // The reason behind this is that console.log has type "object" in IE8...
    try {
        hasApply = !!logFn.apply;
    } catch (e) {
    }

    if (hasApply) {
        return function () {
            var args = [];
            _.forEach(arguments, function (arg) {
                args.push(formatError(arg));
            });
            return logFn.apply(console, args);
        };
    }

    // we are IE which either doesn't have window.console => this is noop and we do nothing,
    // or we are IE where console.log doesn't have apply so we log at least first 2 args
    return function (arg1, arg2) {
        logFn(arg1, arg2 == null ? '' : arg2);
    };
}

module.exports = Bean.logger = {
    log: consoleLog('log'),
    info: consoleLog('info'),
    warn: consoleLog('warn'),
    error: consoleLog('error'),
    debug: function () {
        var fn = consoleLog('debug'),
            that = this;

        return function () {
            if (debug) {
                fn.apply(that, arguments);
            }
        }
    }
};