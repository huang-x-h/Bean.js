/**
 * Created by huangxinghui on 2015/5/25.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var template = require('./loading.hbs');

plugin('loading', {
    start: function () {
        this.$element.append(template);
    },

    finish: function () {
        this.$element.find('.loading-screen').remove();
    }
});