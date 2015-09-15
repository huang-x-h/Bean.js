/**
 * Created by huangxinghui on 2015/5/20.
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
    options: {
        duration: 2000,
        dismissible: false
    },

    _create: function () {
        if (this.options.dismissible) {
            var events = {};
            events['click ' + dismiss] = 'close';

            this._on(events);
        }
        else
            setTimeout($.proxy(this.close, this), this.options.duration);
    },

    close: function (e) {
        var $el = this.$element;

        if (e) e.preventDefault();

        e = this.trigger('beforeClose');

        if (e.isDefaultPrevented()) return;

        $el.removeClass('in');

        function removeElement() {
            // detach from parent, fire event then clean up data
            this.destroy();
            $el.remove();
        }

        transition.supportsTransitionEnd && $el.hasClass('fade') ?
            $el.one(transition.TRANSITION_END, $.proxy(removeElement, this))
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