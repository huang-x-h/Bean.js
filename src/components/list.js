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

function itemRendererHandler (data) {
    var content = '';
    if (_.isString(data)) {
        content = data;
    } else {
        content = data[this.options.dataTextField];
    }

    return '<a href="javascript:;">' + content + '</a>';
}

var List = Widget.extend({
    options: {
        dataTextField: 'text',
        dataValueField: 'value',
        itemRenderer: itemRendererHandler
    },

    events: {
        'click li': '_onClick'
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
            return result + '<li>' + _.bind(this.options.itemRenderer, this, item)() + '</li>';
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

    _setSelection: function () {
        this.$element.find('li.active').removeClass('active');
        this.$element.find('li').eq(this._selectedIndex).addClass('active');
    }
});

mixin(List, ListMixin);
plugin('list', List);

module.exports = List;