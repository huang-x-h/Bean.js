/**
 * Created by huangxinghui on 2015/6/24.
 */

module.exports = {
    options: {
        dataSource: null,
        dataTextField: 'text',
        dataValueField: 'value'
    },

    _create: function () {
        this._opened = false;
        this._selectedIndex = -1;
        this._selectedItem = null;
    },

    selectedItem: function (value) {
        if (arguments.length === 0) {
            return this._selectedItem;
        } else if (this._selectedItem != value) {
            this._selectedItem = value;
            this.trigger('change');
        }
    },

    text: function () {
        var item = this._selectedItem;

        if (arguments.length === 0) {
            return item[this.options.dataTextField];
        } else {
            // TODO
        }
    },

    value: function () {
        var item = this._selectedItem;

        if (arguments.length === 0) {
            return item[this.options.dataValueField];
        } else {
            // TODO
        }
    },

    isOpen: function () {
        return this._opened;
    },

    open: function () {
        this.$element.addClass('open');
        this._opened = true;
        this.trigger('open');
    },

    close: function () {
        this.$element.removeClass('open');
        this._opened = false;
        this.trigger('close');
    }
};