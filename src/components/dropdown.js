/**
 * Created by huangxinghui on 2015/5/19.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../plugin');
var toggle = '[data-toggle="dropdown"]';

plugin('dropdown', {
    options: {
        triggerEvent: 'click',
        target: null
    },

    _create: function () {
        this.delegate(this.options.triggerEvent, null, _.bind(this.toggle, this));

        this.$parent = this.getParent();
    },

    open: function () {
        if (this.isOpen()) return;

        this._opened = true;
        this.$parent.addClass('open');
        this.trigger('open');
    },

    close: function () {
        if (!this.isOpen()) return;

        this._opened = false;
        this.$parent.removeClass('open');
        this.trigger('close');
    },

    toggle: function (e) {
        this.isOpen() ? this.close() : this.open();
        return false;
    },

    isOpen: function () {
        return this._opened;
    },

    getParent: function () {
        if (this.options.target) {
            return (this.options.target instanceof $ ? this.options.target : $(this.options.target)).parent();
        } else {
            return this.$element.parent();
        }
    }
});

function clearMenus(e) {
    if (e && e.which === 3) return;

    $(toggle).dropdown('close');
}

$(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '[data-toggle="dropdown"]', function (e) {
        $(this).dropdown('toggle');
    });