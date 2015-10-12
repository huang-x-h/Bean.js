/**
 * Created by huangxinghui on 2015/8/20.
 */

var $ = require('jquery');
var _ = require('underscore');
var transition = require('../transition');

function lazyLoad(element) {
  var $element = $(element),
      imageSource = $element.attr('data-lazy'),
      imageLoader = document.createElement('img');

  imageLoader.onload = function() {
    $element.addClass('fade');
    $element.attr('src', imageSource);
    $element.addClass('in').one(transition.eventType, function() {
      $element.removeAttr('data-lazy');
      $element.removeClass('fade in');
    }).emulateTransitionEnd();
  };

  imageLoader.src = imageSource;
}
module.exports = Bean.image = {
  lazyLoad: function(selector) {
    if (selector instanceof $) {
      selector.each(function(element) {
        lazyLoad(element);
      });
    } else if (_.isString(selector)) {
      $(selector).each(function(element) {
        lazyLoad(element);
      });
    } else {
      lazyLoad(selector);
    }
  }
};