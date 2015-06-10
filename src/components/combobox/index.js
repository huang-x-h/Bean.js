/**
 * Created by huangxinghui on 2015/6/1.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var template = require('./combobox.hbs');
require('../list');

function itemRendererHandler (data) {
    return '<a href="javascript:;">' + data[this.options.dataTextField] + '</a>';
}

var ComboBox = Widget.extend({
    options: {
        placeholder: 'Please Select...',
        dataSource: null,
        dataTextField: 'text',
        dataValueField: 'value',
        selectedIndex: -1,
        itemRenderer: itemRendererHandler
    },

    events: {
        'click button': '_onButtonClick',
        'change.list ul': '_onListChange',
        'click.list ul': '_onListClick'
    },

    _create: function () {
        this.$element.append(template(this.options));
        this._opened = false;

        this.$text = this.$element.find('input');
        this.$list = this.$element.find('.dropdown-menu').list(this.options);
    },

    dataSource: function (value) {
        if (arguments.length === 0) {
            return this.$list.list('dataSource');

        } else if (this._dataSource != value) {
            if (_.isArray(value)) {
                this.$list.list('dataSource', value);
            }
        }
    },

    selectedIndex: function (value) {
        if (arguments.length === 0) {
            return this.$list.list('selectedIndex');
        } else if (this._selectedIndex != value) {
            this.$list.list('selectedIndex', value);
        }
    },

    selectedItem: function (value) {
        if (arguments.length === 0) {
            return this.$list.list('selectedItem');
        } else {
            // TODO
        }
    },

    value: function (value) {
        if (arguments.length === 0) {
            return this.$list.list('value');
        } else {
            this.$list.list('value', value);
        }
    },

    open: function () {
        if (this.isOpen()) return;

        this._opened = true;
        this.$element.addClass('open');
        this.trigger('open');
    },

    close: function () {
        if (!this.isOpen()) return;

        this._opened = false;
        this.$element.removeClass('open');
        this.trigger('close');
    },

    toggle: function () {
        this.isOpen() ? this.close() : this.open();
    },

    isOpen: function () {
        return this._opened;
    },

    _destroy: function () {
        this.$list.destroy();
    },

    _onButtonClick: function (e) {
        this.toggle();
    },

    _onListChange: function (e) {
        var item = this.selectedItem();

        this.$text.val(item[this.options.dataTextField]);
        this.close();
        this.trigger('change');
    },

    _onListClick: function (e) {
        this.close();
    }
});

plugin('combobox', ComboBox);

module.exports = ComboBox;