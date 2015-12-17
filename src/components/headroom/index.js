/**
 * Created by huangxinghui on 2015/10/19.
 */

//refer from https://github.com/WickyNilliams/headroom.js
var $ = require('jquery');
var Widget = require('../../widget');
var plugin = require('../../plugin');
var Debouncer = require('../../debouncer');
var $window = $(window);

function normalizeTolerance(t) {
  return t === Object(t) ? t : {down: t, up: t};
}

var Headroom = Widget.extend({
  options: {
    tolerance: {
      up: 0,
      down: 0
    },
    offset: 0,
    classes: {
      pinned: 'headroom--pinned',
      unpinned: 'headroom--unpinned',
      top: 'headroom--top',
      notTop: 'headroom--notTop',
      initial: 'headroom'
    }
  },

  _create: function() {
    this.$element.addClass(this.options.classes.initial);
    this.debouncer = new Debouncer(this._update.bind(this));
    this.tolerance = normalizeTolerance(this.options.tolerance);

    window.addEventListener('scroll', this.debouncer, false);
    this.debouncer.handleEvent();
  },

  _update: function() {
    var currentScrollY = $window.scrollTop(),
        scrollDirection = currentScrollY > this.lastKnownScrollY ? 'down' : 'up',
        toleranceExceeded = this._toleranceExceeded(currentScrollY, scrollDirection);

    if (currentScrollY <= this.options.offset) {
      this.top();
    } else {
      this.notTop();
    }

    if (this._shouldPin(currentScrollY, toleranceExceeded)) {
      this.pin();
    }

    if (this._shouldUnpin(currentScrollY, toleranceExceeded)) {
      this.unpin();
    }

    this.lastKnownScrollY = currentScrollY;
  },

  _toleranceExceeded: function(scrollY, direction) {
    return Math.abs(scrollY - this.lastKnownScrollY) >= this.tolerance[direction];
  },

  _shouldPin: function(currentScrollY, toleranceExceeded) {
    var scrollingUp = currentScrollY < this.lastKnownScrollY,
        pastOffset = currentScrollY <= this.options.offset;

    return (scrollingUp && toleranceExceeded) || pastOffset;
  },

  _shouldUnpin: function(currentScrollY, toleranceExceeded) {
    var scrollingDown = currentScrollY > this.lastKnownScrollY,
        pastOffset = currentScrollY >= this.options.offset;

    return scrollingDown && pastOffset && toleranceExceeded;

  },

  top: function() {
    this.$element.addClass(this.options.classes.top);
    this.$element.removeClass(this.options.classes.notTop);
    this._trigger('top');
  },

  notTop: function() {
    this.$element.removeClass(this.options.classes.top);
    this.$element.addClass(this.options.classes.notTop);
    this._trigger('notTop');
  },

  pin: function() {
    this.$element.addClass(this.options.classes.pinned);
    this.$element.removeClass(this.options.classes.unpinned);
    this._trigger('pin');
  },

  unpin: function() {
    this.$element.removeClass(this.options.classes.pinned);
    this.$element.addClass(this.options.classes.unpinned);
    this._trigger('unpin');
  }
});

plugin('headroom', Headroom);