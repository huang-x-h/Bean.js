/**
 * Created by huangxinghui on 2015/5/18.
 */

var $ = require('jquery');
var TRANSITION_END = 'bsTransitionEnd';
var transition = false;
var supportsTransitionEnd = false;
var transEndEventNames = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
  transition: 'transitionend'
};

function transitionEndTest() {
  var el = document.createElement('bootstrap');

  for (var name in transEndEventNames) {
    if (el.style[name] !== undefined) {
      return {end: transEndEventNames[name]}
    }
  }

  return false; // explicit for ie8 (  ._.)
}

// http://blog.alexmaccaw.com/css-transitions
function transitionEndEmulator(duration) {
  var _this = this;

  var called = false;

  $(this).one(TRANSITION_END, function() {
    called = true;
  });

  setTimeout(function() {
    if (!called) {
      triggerTransitionEnd(_this);
    }
  }, duration);

  return this;
}

function triggerTransitionEnd(element) {
  $(element).trigger(transition.end);
}

function setTransitionEndSupport() {
  transition = transitionEndTest();
  supportsTransitionEnd = Boolean(transition);

  $.fn.emulateTransitionEnd = transitionEndEmulator;

  if (supportsTransitionEnd) {
    $.event.special[TRANSITION_END] = {
      bindType: transition.end,
      delegateType: transition.end,
      handle: function(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  }
}

setTransitionEndSupport();

module.exports = {
  TRANSITION_END: TRANSITION_END,
  supportsTransitionEnd: supportsTransitionEnd,
  reflow: function reflow(element) {

  }
};