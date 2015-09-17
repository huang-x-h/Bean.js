/**
 * Created by huangxinghui on 2015/8/28.
 */

var _ = require('underscore');

module.exports = {
    substitute: function (str) {
        if (str == null) return '';

        var args = Array.prototype.slice.call(arguments, 1);

        if (args.length == 1 && _.isArray(args[0])) {
            args = args[0];
        }

        str = str.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i]
        });

        return str;
    }
};