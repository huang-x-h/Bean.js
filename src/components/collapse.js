/**
 * Created by huangxinghui on 2015/5/19.
 */
var $ = require('jquery');
var plugin = require('../plugin');
var transition = require('../transition');
var Widget = require('../widget');
var $document = require('../document');
var TRANSITION_DURATION = 350;

var Collapse = Widget.extend({
  options: {
    toggle: true
  },

  _create: function() {
    this.$trigger = $('[data-toggle="collapse"][href="#' + this.$element[0].id + '"],' +
        '[data-toggle="collapse"][data-target="#' + this.$element[0].id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  },

  dimension: function() {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height'
  },

  show: function() {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('collapse');
      if (activesData && activesData.transitioning) return
    }

    if (this._trigger('beforeShow')) return;

    if (actives && actives.length) {
      actives.collapse('hide');
    }

    var dimension = this.dimension();

    this.$element
        .removeClass('collapse')
        .addClass('collapsing')[dimension](0)
        .attr('aria-expanded', true);

    this.$trigger
        .removeClass('collapsed')
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
    if (this.transitioning || !this.$element.hasClass('in')) return

    if (this._trigger('beforeCollapse'))
      return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element
        .addClass('collapsing')
        .removeClass('collapse in')
        .attr('aria-expanded', false);

    this.$trigger
        .addClass('collapsed')
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
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  },

  getParent: function() {
    return $(this.options.parent)
        .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
        .each($.proxy(function(i, element) {
          var $element = $(element);
          this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
        }, this))
        .end();
  },

  addAriaAndCollapsedClass: function($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger
        .toggleClass('collapsed', !isOpen)
        .attr('aria-expanded', isOpen);
  }
});

plugin('collapse', Collapse);

module.exports = Collapse;

function getTargetFromTrigger($trigger) {
  var href;
  var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

  return $(target)
}

$document.on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function(e) {
  var $this = $(this);

  if (!$this.attr('data-target')) e.preventDefault();

  var $target = getTargetFromTrigger($this);
  var data = $target.data('collapse');

  data ? data.toggle() : $target.collapse($this.data());
});