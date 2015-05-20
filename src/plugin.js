/**
 * Created by huangxinghui on 2015/5/15.
 */

var $ = require('jquery');
var Widget = require('./widget');

module.exports = plugin;

function plugin(widgetName, prototype) {
    var widgetClass = Widget.extend($.extend(prototype, {
        widgetName: widgetName
    }));

    function Plugin(option) {
        var isMethodCall = typeof option === "string",
            args = Array.prototype.slice.call(arguments, 1);

        if (isMethodCall) {
            return this.each(function () {
                var $this = $(this);
                var data = $this.data(widgetName);

                if (!data) $this.data(widgetName, data = new widgetClass(this));
                data[option].apply(data, args);
            });
        } else {
            return this.each(function () {
                var $this = $(this);
                var options = typeof option == 'object' && option;

                $this.data(widgetName, new widgetClass(this, options));
            });
        }
    }

    var old = $.fn[widgetName];

    $.fn[widgetName] = Plugin;

    // Widget NO CONFLICT
    // ====================

    $.fn[widgetName].noConflict = function () {
        $.fn[widgetName] = old;
        return this;
    }

    return widgetClass;
}