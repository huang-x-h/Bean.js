/**
 * Created by huangxinghui on 2015/5/18.
 */

var $ = require('jquery');
var plugin = require('../plugin');
var transition = require('../transition');
var Widget = require('../widget');
var $document = require('../document');
var TRANSITION_DURATION = 150;

var Tab = Widget.extend({
  show: function() {
    var $this = this.$element
    var $ul = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function() {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  },

  activate: function(element, container, callback) {
    var $active = container.find('> .active')
    var isTransitioning = callback
        && transition.supportsTransitionEnd
        && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')
          .end()
          .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
          .addClass('active')
          .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (isTransitioning) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
            .closest('li.dropdown')
            .addClass('active')
            .end()
            .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && isTransitioning ?
        $active
            .one(transition.TRANSITION_END, next)
            .emulateTransitionEnd(TRANSITION_DURATION) :
        next();

    $active.removeClass('in')
  }
});

plugin('tab', Tab);

module.exports = Tab;

var clickHandler = function(e) {
  e.preventDefault();
  $(this).tab('show');
};

$document
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);