/**
 * Created by huangxinghui on 2015/6/26.
 */

var $ = require('jquery')
var Widget = require('../../widget')

var prevTemplate = require('./prev.hbs')()
var nextTemplate = require('./next.hbs')()

var Carousel = Widget.extend({
  options: {
    dots: true,
    dotsClass: 'carousel-indicators',
    autoplay: false,
    autoplaySpeed: 3000,
    infinite: true,
    draggable: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: false,
    prevArrow: null,
    nextArrow: null,
    customPaging: function(slider, i) {
      return ''
    },
  },
  events: {},

  _create: function() {
    this.$list = this.$element.children().eq[0]
    this.items = this.$list.children()
  },
})
