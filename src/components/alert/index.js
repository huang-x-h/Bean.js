/**
 * Created by huangxinghui on 2015/5/20.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var ztesoft = require('../../core');
var TRANSITION_DURATION = 150;
var dismiss = '[data-dismiss="alert"]';
var template = require('./alert.hbs');
require('../../transition');

plugin('alert', {
    options: {
        duration: 2000,
        dismissible: false
    },

    _create: function () {
        if (this.options.dismissible)
            this.$element.on('click', dismiss, $.proxy(this.close, this));
        else
            this.timer = setTimeout($.proxy(this.close, this), this.options.dismissible);
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
            $el.one('bsTransitionEnd', removeElement)
                .emulateTransitionEnd(TRANSITION_DURATION) :
            removeElement()
    }
});

ztesoft.warn = function (message) {
    var $alert = $(template({
        type: 'alert-warning',
        message: message,
        dismissible: false
    })).alert().appendTo(document.body);
};

ztesoft.info = function (message) {
    var $alert = $(template({
        type: 'alert-info',
        message: message,
        dismissible: false
    })).alert().appendTo(document.body);
};

ztesoft.error = function (message) {
    var $alert = $(template({
        type: 'alert-error',
        message: message,
        dismissible: true
    })).alert().appendTo(document.body);
};