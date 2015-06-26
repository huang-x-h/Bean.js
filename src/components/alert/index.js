/**
 * Created by huangxinghui on 2015/5/20.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var Bean = require('../../core');
var $body = require('../../body');
var template = require('./alert.hbs');

var TRANSITION_DURATION = 150;
var dismiss = '[data-dismiss="alert"]';

var Alert = Widget.extend({
    options: {
        duration: 2000,
        dismissible: false
    },

    _create: function () {
        if (this.options.dismissible)
            this.$element.on('click', dismiss, $.proxy(this.close, this));
        else
            setTimeout($.proxy(this.close, this), this.options.duration);
    },

    close: function (e) {
        var $el = this.$element;

        this.trigger('close');

        $el.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $el.removeClass('in')

        function removeElement() {
            // detach from parent, fire event then clean up data
            this.destroy();
            this.trigger('closed');
            $el.remove();
        }

        $.support.transition && $el.hasClass('fade') ?
            $el.one('bsTransitionEnd', $.proxy(removeElement, this))
                .emulateTransitionEnd(TRANSITION_DURATION) :
            removeElement()
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

Bean.success = function (message) {
    appendToToast($(template({
        type: 'alert-success',
        message: message,
        dismissible: false
    })).alert());
};

Bean.warn = function (message) {
    appendToToast($(template({
        type: 'alert-warning',
        message: message,
        dismissible: false
    })).alert());
};

Bean.info = function (message) {
    appendToToast($(template({
        type: 'alert-info',
        message: message,
        dismissible: false
    })).alert());
};

Bean.error = function (message) {
    appendToToast($(template({
        type: 'alert-danger',
        message: message,
        dismissible: true
    })).alert({
        dismissible: true
    }));
};