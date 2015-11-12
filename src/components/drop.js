/**
 * Created by huangxinghui on 2015/10/30.
 */

var Tether = require('tether');
var Widget = require('../widget');
var plugin = require('../plugin');
var $document = require('../document');
var $body = require('../body');
var MIRROR_ATTACH = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
  middle: 'middle',
  center: 'center'
};
var classPrefix = 'drop';

/*
 attachment: A string of the form 'vert-attachment horiz-attachment'
 vert-attachment can be any of 'top', 'middle', 'bottom'
 horiz-attachment can be any of 'left', 'center', 'right'
 */
function sortAttach(str) {
  var arr = str.split(' ');
  if (['left', 'right'].indexOf(arr[0]) >= 0) {
    return arr.reverse().join(' ');
  }
  return str;
}

var Drop = Widget.extend({
  options: {
    classPrefix: classPrefix,
    position: 'bottom left',
    trigger: 'click',
    content: '',
    classes: '',
    constrainToScrollParent: false,
    constrainToWindow: true,
    remove: true,
    tetherOptions: {}
  },

  _create: function() {
    this._setupElement();
    this._setupTether();
    this._setupEvents();
  },

  _destroy: function() {
    this.remove();
    this.tether.destroy();
  },

  _setupElement: function() {
    this.$drop = $('<div></div>').html(this.options.content);
    this.$drop.addClass(this.options.classPrefix);
    this.$drop.addClass(this.options.classes);
  },

  _setupTether: function() {
    var position = this.options.position,
        dropAttach;

    if (/top|bottom/.test(position)) {
      position += ' center';
    } else if(/left|right/.test(position)) {
      position += ' middle';
    }

    dropAttach = position.split(' ');
    dropAttach[0] = MIRROR_ATTACH[dropAttach[0]];
    dropAttach = dropAttach.join(' ');

    var constraints = [];
    if (this.options.constrainToScrollParent) {
      constraints.push({
        to: 'scrollParent',
        pin: 'top, bottom',
        attachment: 'together none'
      });
    } else {
      // To get 'out of bounds' classes
      constraints.push({
        to: 'scrollParent'
      });
    }

    if (this.options.constrainToWindow !== false) {
      constraints.push({
        to: 'window',
        attachment: 'together'
      });
    } else {
      // To get 'out of bounds' classes
      constraints.push({
        to: 'window'
      });
    }

    var opts = {
      element: this.$drop,
      target: this.$element,
      attachment: sortAttach(dropAttach),
      targetAttachment: sortAttach(position),
      classPrefix: this.options.classPrefix,
      offset: '0 0',
      targetOffset: '0 0',
      enabled: false,
      constraints: constraints,
      addTargetClasses: this.options.addTargetClasses
    };

    if (this.options.tetherOptions !== false) {
      this.tether = new Tether($.extend({}, opts, this.options.tetherOptions));
    }
  },

  _setupEvents: function() {
    if (this.options.trigger === 'sticky') {
      setTimeout(this.open.bind(this), 0);
      return;
    }

    var triggers = this.options.trigger.split(' ');

    if (triggers.indexOf('click') >= 0) {
      this._on({
        'click': 'openHandler'
      });

      this._on($document, {
        'click': 'closeHandler'
      });
    }

    if (triggers.indexOf('hover') >= 0) {
      this.onUs = false;
      this.outTimeout = null;

      this._on({
        'mouseenter': 'enter',
        'mouseleave': 'leave'
      });

      this._on(this.$drop, {
        'mouseenter': 'enter',
        'mouseleave': 'leave'
      });
    }
  },

  openHandler: function(e) {
    this.toggle(e);
    e.preventDefault();
  },

  closeHandler: function(e) {
    if (!this.isOpened()) {
      return;
    }

    // Clicking inside tips
    var drop = this.$drop[0];
    if (e.target === drop || drop.contains(e.target)) {
      return;
    }

    var element = this.$element[0];
    // Clicking target
    if (e.target === element || element.contains(e.target)) {
      return;
    }

    this.close();
  },

  enter: function(e) {
    this.onUs = true;
    this.open();
  },

  leave: function(e) {
    var that = this;
    this.onUs = false;

    if (typeof this.outTimeout !== 'undefined') {
      clearTimeout(this.outTimeout);
    }

    this.outTimeout = setTimeout(function() {
      if (!that.onUs)
        that.close();
      that.outTimeout = null;
    }, 50);
  },

  toggle: function() {
    this.isOpened() ? this.close() : this.open();
  },

  open: function() {
    if (this.isOpened()) {
      return;
    }

    if (this.$drop.parent().length === 0) {
      $body.append(this.$drop);
    }

    if (typeof this.tether !== 'undefined') {
      this.tether.enable();
    }

    this.$drop.addClass(this.options.classPrefix + '-open');

    if (typeof this.tether !== 'undefined') {
      this.tether.position();
    }

    this._trigger('open');
  },

  close: function() {
    if (!this.isOpened()) {
      return;
    }

    if (!this._trigger('beforeClose')) {
      return;
    }

    this.$drop.removeClass(this.options.classPrefix + '-open');

    this._trigger('close');

    if (typeof this.tether !== 'undefined') {
      this.tether.disable();
    }

    if (this.options.remove) {
      this.remove();
    }
  },

  remove: function() {
    this.close();
    this.$drop.remove();
  },

  isOpened: function() {
    if (this.$drop) {
      return this.$drop.hasClass(this.options.classPrefix + '-open');
    }
  }
});

plugin('drop', Drop);

module.exports = Drop;