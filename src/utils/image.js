/**
 * Created by huangxinghui on 2015/8/20.
 */

var $ = require('jquery');
var _ = require('underscore');
var transition = require('../transition');
var util = require('../utils/element');
var Debouncer = require('../debouncer');

function lazyLoad(element) {
  var $element = $(element),
      imageSource = $element.attr('data-lazy'),
      imageLoader = document.createElement('img');

  imageLoader.onload = function() {
    $element.addClass('fade');
    $element.attr('src', imageSource);
    $element.addClass('in').one(transition.TRANSITION_END, function() {
      $element.removeAttr('data-lazy');
      $element.removeClass('fade in');
    }).emulateTransitionEnd();
  };

  imageLoader.src = imageSource;
}

function render() {
  $('img[data-lazy]').each(function(index, element) {
    if (util.inViewport(element)) {
      lazyLoad(element);
    }
  })
}

module.exports = Bean.image = {
  lazyLoad: function(options) {
    var debouncer = new Debouncer(render);
    window.addEventListener('scroll', debouncer, false);

    render();
  }
};