/**
 * @module Alert
 * @extends Widget
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var transition = require('../../transition');
var Widget = require('../../widget');
var Bean = require('../../core');
var $body = require('../../body');
var template = require('./alert.hbs');

var TRANSITION_DURATION = 150;
var dismiss = '[data-dismiss="alert"]';

var Alert = Widget.extend({
  /**
   * @property {Object} options 参数信息
   * @property {Number} [options.duration=2000] 延迟关闭，默认延迟2000ms
   * @property {Boolean} [options.dismissible=false] 可点击关闭，默认false
   */
  options: {
    duration: 2000,
    dismissible: false
  },

  _create: function() {
    if (this.options.dismissible) {
      var events = {};
      events['click ' + dismiss] = 'close';

      this._on(events);
    }
    else
      setTimeout($.proxy(this.close, this), this.options.duration);
  },

  /**
   * 关闭提示信息
   */
  close: function(e) {
    var $el = this.$element;

    if (e) e.preventDefault();

    if (!this._trigger('beforeClose')) return;

    $el.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      this.destroy();
      $el.remove();
    }

    transition.supportsTransitionEnd && $el.hasClass('fade') ?
        $el.one(transition.TRANSITION_END, $.proxy(removeElement, this))
            .emulateTransitionEnd(TRANSITION_DURATION) :
        removeElement();
  }
});

plugin('alert', Alert);

var $toast;

function appendToToast($el) {
  if (!$toast) {
    $toast = $('<div class="alert-toast"></div>').appendTo($body);
  }

  $toast.append($el);
}

/**
 * 成功提示
 * @memberOf Bean
 * @param {String} message 提示信息
 */
Bean.success = function(message) {
  appendToToast($(template({
    type: 'alert-success',
    message: message,
    dismissible: false
  })).alert());
};

/**
 * 告警提示
 * @memberOf Bean
 * @param {String} message 提示信息
 */
Bean.warn = function(message) {
  appendToToast($(template({
    type: 'alert-warning',
    message: message,
    dismissible: false
  })).alert());
};

/**
 * 信息提示
 * @memberOf Bean
 * @param {String} message 提示信息
 */
Bean.info = function(message) {
  appendToToast($(template({
    type: 'alert-info',
    message: message,
    dismissible: false
  })).alert());
};

/**
 * 错误提示
 * @memberOf Bean
 * @param {String} message 提示信息
 */
Bean.error = function(message) {
  appendToToast($(template({
    type: 'alert-danger',
    message: message,
    dismissible: true
  })).alert({
    dismissible: true
  }));
};
