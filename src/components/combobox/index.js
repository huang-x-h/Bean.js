/**
 * Created by huangxinghui on 2015/6/1.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var DropDownListMixin = require('../../mixins/dropdownlist');
var mixin = require('../../utils/mixin');
var template = require('./combobox.hbs');

function itemRendererHandler(data) {
    return '<a href="javascript:;">' + data[this.options.dataTextField] + '</a>';
}

var ComboBox = Widget.extend({
    options: {
        placeholder: 'Please Select...',
        selectedIndex: -1,
        itemRenderer: itemRendererHandler
    },

    events: {
        'click button': '_onButtonClick',
        'keydown': '_onKeyDown',
        'mousedown li': '_onMouseDown'
    },

    _create: function () {
        this.$element.append(template());

        this.$input = this.$element.find('input');
        this.$list = this.$element.find('.dropdown-menu');

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

                this.$list.html(_.reduce(this._dataSource, function (result, item) {
                    return result + '<li>' + _.bind(this.options.itemRenderer, this, item)() + '</li>';
                }, '', this));
            }
        }
    },

    toggle: function () {
        this.isOpen() ? this.close() : this.open();
    },

    _onButtonClick: function (e) {
        this.toggle();
    }
});

mixin(ComboBox, DropDownListMixin);
plugin('combobox', ComboBox);

module.exports = ComboBox;