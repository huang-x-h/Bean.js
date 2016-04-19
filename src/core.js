/**
 * @global
 */

$ = require('jquery')
var Debouncer = require('./debouncer')

function resizableWidget() {
  var widget = $(this);
  return widget.is(":visible");
}

function containmentComparer(a, b) {
  return $.contains(a, b) ? -1 : 1;
}

var Bean = {
  ns: 'bean-',
  version: '0.0.1',

  attr: function(value) {
    return 'data-' + Bean.ns + value
  },

  widgetInstance: function($el) {
    var widgetName = $el.attr(Bean.attr('role'))

    if (widgetName) {
      return $el.data(Bean.ns + widgetName)
    }
  },

  onResize: function(handler) {
    var debouncer = new Debouncer(handler);
    window.addEventListener('resize', debouncer, false)

    return debouncer
  },

  offResize: function(handler) {
    window.removeEventListener('scroll', handler, false)
  },

  resize: function(element, force) {
    var widgets = $(element).find(Bean.attr('role')).addBack().filter(resizableWidget)

    if (!widgets.length) {
      return;
    }

    // sort widgets based on their parent-child relation
    var widgetsArray = $.makeArray(widgets)
    widgetsArray.sort(containmentComparer)

    // resize widgets
    $.each(widgetsArray, function() {
      var widget = Bean.widgetInstance($(this))
      if (widget) {
        widget.resize(force)
      }
    })
  }
}

module.exports = window.Bean = Bean
