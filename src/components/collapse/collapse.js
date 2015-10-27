/**
 * Created by huangxinghui on 2015/5/19.
 */
var $ = require('jquery');
var transition = require('../../transition');
var Widget = require('../../widget');
var TRANSITION_DURATION = 350;

var Collapse = Widget.extend({
  _create: function() {
    this.transitioning = null;
  },

  dimension: function() {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height'
  },

  show: function() {
    if (this.transitioning || this.$element.hasClass('in')) return;

    if (this._trigger('beforeShow')) return;

    var dimension = this.dimension();

    this.$element
        .removeClass('collapse')
        .addClass('collapsing')[dimension](0)
        .attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function() {
      this.$element
          .removeClass('collapsing')
          .addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this._trigger('show');
    };

    if (!transition.supportsTransitionEnd) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element
        .one(transition.TRANSITION_END, $.proxy(complete, this))
        .emulateTransitionEnd(TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  },

  hide: function() {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    if (this._trigger('beforeCollapse')) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element
        .addClass('collapsing')
        .removeClass('collapse in')
        .attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function() {
      this.transitioning = 0;
      this.$element
          .removeClass('collapsing')
          .addClass('collapse');
      this._trigger('hide');
    };

    if (!transition.supportsTransitionEnd) return complete.call(this);

    this.$element
        [dimension](0)
        .one(transition.TRANSITION_END, $.proxy(complete, this))
        .emulateTransitionEnd(TRANSITION_DURATION);
  },

  toggle: function() {
    this[this.isOpen() ? 'hide' : 'show']();
  },

  isOpen: function() {
    return this.$element.hasClass('in');
  }
});

module.exports = Collapse;