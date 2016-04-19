/**
 * Created by huangxinghui on 2015/5/19.
 */
var $ = require('jquery')
var transition = require('../../transition')
var util = require('../../utils/element')
var Widget = require('../../widget')
var TRANSITION_DURATION = 350
var ClassName = {
  IN: 'in',
  COLLAPSE: 'collapse',
  COLLAPSING: 'collapsing',
  COLLAPSED: 'collapsed'
}

var Collapse = Widget.extend({
  _create: function() {
    var element = this.$element[0]

    this.transitioning = null
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
      '[data-toggle="collapse"][data-target="#' + element.id + '"]')
  },

  dimension: function() {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  },

  show: function() {
    if (this.transitioning || this.$element.hasClass(ClassName.IN)) return

    if (!this._trigger('beforeShow')) return

    var dimension = this.dimension()

    this.$element
      .removeClass(ClassName.COLLAPSE)
      .addClass(ClassName.COLLAPSING)[dimension](0)

    this.$trigger.removeClass(ClassName.COLLAPSED)

    this.transitioning = 1

    var complete = function() {
      this.$element
        .removeClass(ClassName.COLLAPSING)
        .addClass(ClassName.COLLAPSE)
        .addClass(ClassName.IN)[dimension]('')
      this.transitioning = 0
      this._trigger('show')
    }

    if (!transition.supportsTransitionEnd) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one(transition.TRANSITION_END, $.proxy(complete, this))
      .emulateTransitionEnd(TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  },

  hide: function() {
    if (this.transitioning || !this.$element.hasClass(ClassName.IN)) return

    if (!this._trigger('beforeCollapse')) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())
    util.reflow(this.$element)

    this.$element
      .addClass(ClassName.COLLAPSING)
      .removeClass(ClassName.COLLAPSE)
      .removeClass(ClassName.IN)

    this.$trigger.addClass(ClassName.COLLAPSED)

    this.transitioning = 1

    var complete = function() {
      this.transitioning = 0
      this.$element
        .removeClass(ClassName.COLLAPSING)
        .addClass(ClassName.COLLAPSE)
      this._trigger('hide')
    }

    if (!transition.supportsTransitionEnd) return complete.call(this)

    this.$element
      [dimension](0)
      .one(transition.TRANSITION_END, $.proxy(complete, this))
      .emulateTransitionEnd(TRANSITION_DURATION)
  },

  toggle: function(e) {
    this[this.isOpen() ? 'hide' : 'show']()
  },

  isOpen: function() {
    return this.$element.hasClass(ClassName.IN)
  }
})

module.exports = Collapse
