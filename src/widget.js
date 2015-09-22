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
        this.bindings = $();
        this.eventNamespace = "." + this.widgetName;

        this._create();
        this._on(this.events);
    },

    _create: $.noop,

    _destroy: $.noop,

    _on: function (element, events) {
        if (!events) {
            events = element;
            element = this.$element;
        }

        if (element !== this.$element)
            this.bindings.add(element);

        var key, method, match;
        for (key in events) {
            method = events[key];
            if (!_.isFunction(method)) method = this[events[key]];
            if (!method) continue;
            match = key.match(delegateEventSplitter);
            element.on(match[1] + this.eventNamespace, match[2], _.bind(method, this));
        }
    },

    _off: function (element, eventName) {
        eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
        element.off(eventName);

        this.bindings = $(this.bindings.not(element).get());
    },

    trigger: function (type, data) {
        var e = $.Event((this.widgetName + ':' + type).toLowerCase());
        this.$element.trigger(e, data);
        return e;
    },

    destroy: function () {
        this._destroy();

        this.$element.off(this.eventNamespace)
            .removeData(this.widgetName);
        this.bindings.off(this.eventNamespace);
        this.bindings = $();
    }
});