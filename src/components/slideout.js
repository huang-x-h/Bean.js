/**
 * Created by huangxinghui on 2015/5/28.
 */

var $ = require('jquery');
var plugin = require('../plugin');
var TRANSITION_DURATION = 500;
var $body = $(document.body);

plugin('slideout', {
    options: {
        fx: 'ease',
        padding: 256
    },

    _create: function () {
        // Sets default values
        this._opening = false;
        this._opened = false;

        // Sets panel
        this.panel = this.options.panel;

        // Sets options
        this._translateTo = this.options.padding;
        this._orientation = this.options.side === 'right' ? -1 : 1;
        this._translateTo *= this._orientation;
    },

    open: function () {
        var that = this;

        $body.addClass('slideout-open');

        this.panel.addClass('animate');
        this._translateXTo(this._translateTo);
        this._opened = true;

        function complete() {
            that.panel.removeClass('animate');
            $body.on('click.slideout', $.proxy(that._bodyClick, that));
        }
        this.$element.one('bsTransitionEnd', complete)
            .emulateTransitionEnd(TRANSITION_DURATION);

        return this;
    },

    close: function () {
        var that = this;
        if (!this.isOpen() && !this._opening) {
            return this;
        }

        this.panel.addClass('animate');
        this._translateXTo(0);
        this._opened = false;

        function complete() {
            $body.removeClass('slideout-open');
            that.panel.removeClass('animate');
            that.panel[0].style['-webkit-transform'] = that.panel[0].style.transform = '';
        }

        this.$element.one('bsTransitionEnd', complete)
            .emulateTransitionEnd(TRANSITION_DURATION);
        return this;
    },

    toggle: function () {
        this.isOpen() ? this.close() : this.open();
    },

    isOpen: function () {
        return this._opened;
    },

    _translateXTo: function (translateX) {
        this.panel[0].style['-webkit-transform'] = this.panel[0].style.transform = 'translate3d(' + translateX + 'px, 0, 0)';
    },

    _bodyClick: function (e) {
        if (e.target === this.panel[0]) {
            this.close();
            $body.off('.slideout');
        }
    }
});