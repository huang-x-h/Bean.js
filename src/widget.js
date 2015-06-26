/**
 * Created by huangxinghui on 2015/5/15.
 */

var $ = require('jquery');
var _ = require('underscore');
var Class = require('./clazz');
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

module.exports = Class.extend({
    options: null,
    events: null,

    init: function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, this.options, this.$element.data(), options);

        this._create();
        this.delegateEvents();
    },

    _create: $.noop,

    _destroy: $.noop,

    delegateEvents: function (events) {
        if (!(events || (events = this.events))) return;

        this.undelegateEvents();
        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) method = this[events[key]];
            if (!method) continue;
            var match = key.match(delegateEventSplitter);
            this.delegate(match[1], match[2], _.bind(method, this));
        }
    },

    delegate: function (eventName, selector, listener) {
        this.$element.on(eventName + '.' + this.widgetName, selector, listener);
    },

    undelegateEvents: function () {
        if (this.$element)
            this.$element.off('.' + this.widgetName);
    },

    undelegate: function (eventName, selector, listener) {
        this.$element.off(eventName + '.' + this.widgetName, selector, listener);
    },

    trigger: function (type, data) {
        this.$element.trigger((type + ':' + this.widgetName).toLowerCase(), data);
    },

    destroy: function () {
        this._destroy();

        this.undelegateEvents();
        this.$element.removeData(this.widgetName);
    }
});