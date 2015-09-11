/**
 * Created by huangxinghui on 2015/5/29.
 */

var $ = require('jquery');
var _ = require('underscore');
var Immutable = require('immutable');
var plugin = require('../plugin');
var mixin = require('../utils/mixin');
var ListMixin = require('../mixins/list');
var Widget = require('../widget');

function defaultItemRenderer (data) {
    return '<a href="javascript:;">' + this.itemToLabel(data) + '</a>';
}

var List = Widget.extend({
    options: {
        dataTextField: 'text',
        dataValueField: 'value',
        itemRenderer: defaultItemRenderer
    },

    events: {
        'click li': '_onClick',
        'keydown': '_onKeyDown'
    },

    _create: function () {
        this._setDataSource(this.options.dataSource);
        this._setSelectedIndex(this.options.selectedIndex);
    },

    _setDataSource: function (value) {
        this._dataSource = new Immutable.List(value);
        this._selectedIndex = -1;
        this._selectedItem = null;

        this.$element.html(this._dataSource.reduce(function (result, item) {
            return result + '<li>' + _.bind(this.options.itemRenderer, this, item, this.options.highlight)() + '</li>';
        }, '', this));
    },

    _setSelectedIndex: function (index) {
        if (index > -1 && index < this._dataSource.size) {
            this._selectedItem = this._dataSource.get(index);
            this._selectedIndex = index;
            this._setSelection();
            this.trigger('change');
        }
    },

    _onClick: function (e) {
        e.preventDefault();

        var $li = $(e.currentTarget);

        if (!$li.hasClass('active')) {
            this._setSelectedIndex(this.$element.find('li').index($li));
        }

        this.trigger('click');
    },

    _onKeyDown: function (e) {
        var c = e.keyCode;

        if (c === 38 || c === 40) { // Down/Up arrow
            e.preventDefault();
            this[c === 38 ? "previous" : "next"]();
        }
    },

    previous: function () {
        this.goto(this._selectedIndex - 1);
    },

    next: function () {
        this.goto(this._selectedIndex + 1);
    },

    goto: function (index) {
        this._setSelectedIndex(index);
    },

    itemToLabel: function (data) {
        var label = '';
        if (_.isString(data)) {
            label = data;
        } else if (_.isObject(data)) {
            label = data[this.options.dataTextField];
        }

        return label;
    },

    itemToValue: function (data) {
        var label = '';
        if (_.isString(data)) {
            label = data;
        } else if (_.isObject(data)) {
            label = data[this.options.dataValueField];
        }

        return label;
    },

    text: function () {
        return this.itemToLabel(this._selectedItem);
    },

    value: function () {
        return this.itemToValue(this._selectedItem);
    },

    _setSelection: function () {
        this.$element.find('li.active').removeClass('active');
        this.$element.find('li').eq(this._selectedIndex).addClass('active');
    }
});

mixin(List, ListMixin);
plugin('list', List);

module.exports = List;