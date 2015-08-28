/**
 * Created by huangxinghui on 2015/8/28.
 */

var _ = require('underscore');

module.exports = {
    substitute: function (str) {
        if (str == null) return '';

        var rest = Array.prototype.slice(arguments, 1);
        var len = rest.length,
            args, i;

        if (len == 1 && _.isArray(rest[0])) {
            args = rest[0];
            len = args.length;
        }
        else
            args = rest;

        for (i = 0; i < len; i++){
            str = str.replace(new RegExp("\\{"+i+"\\}", "g"), args[i]);
        }

        return str;
    }
};