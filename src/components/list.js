/**
 * Created by huangxinghui on 2015/5/29.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../plugin');

function itemRendererHandler (data) {
    return '<a href="javascript:;">' + data[this.options.dataTextField] + '</a>';
}

plugin('list', {
    options: {
        dataSource: null,
        dataTextField: 'text',
        dataValueField: 'value',
        selectedIndex: -1,
        itemRenderer: itemRendererHandler
    },

    events: {
        'click li': '_onClick'
    },

    _create: function () {
        this.dataSource(this.options.dataSource);
        this.selectedIndex(this.options.selectedIndex);
    },

    dataSource: function (value) {
        if (arguments.length === 0) {
            return this._dataSource;

        } else if (this._dataSource != value) {
            if (_.isArray(value)) {
                this._dataSource = value;
                this._selectedIndex = -1;

                this.$element.html(_.reduce(this._dataSource, function (result, item) {
                    return result + '<li>' + _.bind(this.options.itemRenderer, this, item)() + '</li>';
                }, '', this));
            }
        }
    },

    selectedIndex: function (value) {
        if (arguments.length === 0) {
            return this._selectedIndex;
        } else if (this._selectedIndex != value) {
            this._selectedIndex = this._checkIndex(value);
            this._setSelectedIndex(this._selectedIndex);
        }
    },

    selectedItem: function (value) {
        if (arguments.length === 0) {
            return this._dataSource[this._selectedIndex];
        } else {
            // TODO
        }
    },

    value: function (value) {
        var item = this.selectedItem();

        if (arguments.length === 0) {
            return item[this.options.dataValueField];
        } else {
            // TODO
        }
    },

    _onClick: function (e) {
        e.stopPropagation();

        var $li = $(e.currentTarget);

        if (!$li.hasClass('active')) {
            this.selectedIndex(this.$element.find('li').index($li));
        }

        this.trigger('click');
    },

    _setSelectedIndex: function (index) {
        this.$element.find('li.active').removeClass('active');
        this.$element.find('li').eq(index).addClass('active');
        this.trigger('change');
    },

    _checkIndex: function (index) {
        if (index < 0) return 0;
        if (this._dataSource && (index >= this._dataSource.length)) return this._dataSource.length - 1;

        return index;
    }
});