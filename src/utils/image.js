/**
 * Created by huangxinghui on 2015/8/20.
 */

// refer to https://github.com/toddmotto/echo
var $ = require('jquery')
var _ = require('underscore')
var util = require('../utils/element')
var Debouncer = require('../debouncer')

function lazyLoad(element) {
  var $element = $(element),
    imageSource = $element.attr('data-lazy'),
    imageLoader = document.createElement('img')

  imageLoader.onload = function() {
    $element.attr('src', imageSource)
    $element.removeAttr('data-lazy')
  }

  imageLoader.src = imageSource
}

function render() {
  $('img[data-lazy]').each(function(index, element) {
    if (util.inViewport(element)) {
      lazyLoad(element)
    }
  })
}

module.exports = Bean.image = {
  scrollLoad: function() {
    var debouncer = new Debouncer(render)
    window.addEventListener('scroll', debouncer, false)

    render()
  },

  lazyLoad: function(selector) {
    if (selector instanceof $) {
      selector.each(function(element) {
        lazyLoad(element)
      })
    } else if (_.isString(selector)) {
      $(selector).each(function(element) {
        lazyLoad(element)
      })
    } else {
      lazyLoad(selector)
    }
  }
}
