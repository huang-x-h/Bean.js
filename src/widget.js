/**
 * @class Widget
 */

var $ = require('jquery')
var _ = require('underscore')
var Class = require('./clazz')
var Bean = require('./core')
var delegateEventSplitter = /^(\S+)\s*(.*)$/

module.exports = Class.extend({
  options: null,
  events: null,

  init: function(element, options) {
    this.$element = $(element)
    this.options = $.extend({}, this.options, this.$element.data(), options)
    this.bindings = $()
    this.eventNamespace = '.' + this.options.name

    // add data-bean-role attribute on element
    if (!this.$element.attr(Bean.attr('role'))) {
      this.$element.attr(Bean.attr('role'), this.options.name)
    }

    this._create()
    this._on(this.events)
  },

  _create: $.noop,
  _resize: $.noop,
  _destroy: $.noop,

  _on: function(element, events) {
    if (!events) {
      events = element
      element = this.$element
    }

    if (element !== this.$element) this.bindings = this.bindings.add(element)

    var key, method, match
    for (key in events) {
      method = events[key]
      if (!_.isFunction(method)) method = this[events[key]]
      if (!method) continue
      match = key.match(delegateEventSplitter)
      element.on(match[1] + this.eventNamespace, match[2], _.bind(method, this))
    }
  },

  _off: function(element, eventName) {
    eventName = (eventName || '').split(' ').join(this.eventNamespace + ' ') + this.eventNamespace
    element.off(eventName)

    if (arguments.length === 1) this.bindings = $(this.bindings.not(element).get())
  },

  _trigger: function(type, data) {
    var callback = this.options[type]

    var e = $.Event((this.options.name + ':' + type).toLowerCase())
    this.$element.trigger(e, data)

    return !(_.isFunction(callback) &&
    callback.apply(this, [e].concat(data)) === false ||
    e.isDefaultPrevented())
  },

  getSize: function() {
    var domElement = this.$element[0];
    return { width: domElement.offsetWidth, height: domElement.offsetHeight };
  },

  resize: function(force) {
    var size = this.getSize(),
      currentSize = this._size;

    if (force || (size.width > 0 || size.height > 0) && (!currentSize || size.width !== currentSize.width || size.height !== currentSize.height)) {
      this._size = size;
      this._resize(size, force);
      this._trigger("resize", size);
    }
  },

  destroy: function() {
    this._destroy()

    this.$element.removeAttr(Bean.attr('role'));
    this.$element.off(this.eventNamespace)
      .removeData(this.options.name)
    this.bindings.off(this.eventNamespace)
    this.bindings = $()
  }
})
