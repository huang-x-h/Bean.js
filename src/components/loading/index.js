/**
 * Created by huangxinghui on 2015/5/25.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var template = require('./loading.hbs');

plugin('loading', {
    options: {
        customClass: null
    },

    _create: function () {
        this.$loading = $(template({
            customClass: this.options.customClass
        }));
        this.$element.append(this.$loading);
    },

    finish: function () {
        this.$loading.remove();

        // remove widget
        this.destroy();
    }
});