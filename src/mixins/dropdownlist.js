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

    selectedIndex: function (value) {
        if (arguments.length === 0) {
            return this._selectedIndex;
        } else if (this._selectedIndex != value) {
            this._selectedIndex = this._checkIndex(value);
            this._activeSelectedIndex(this._selectedIndex);
        }
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
            return item ? item[this.options.dataTextField] : '';
        } else {
            // TODO
        }
    },

    value: function () {
        var item = this._selectedItem;

        if (arguments.length === 0) {
            return item ? item[this.options.dataValueField] : null;
        } else {
            // TODO
        }
    },

    isOpen: function () {
        return this._opened;
    },

    open: function () {
        if (this.isOpen()) return;

        this.$element.addClass('open');
        this._opened = true;
        this.trigger('open');
    },

    close: function () {
        if (!this.isOpen()) return;

        this.$element.removeClass('open');
        this._opened = false;
        this.trigger('close');
    },

    previous: function () {
        this.goto(this._selectedIndex - 1);
    },

    next: function () {
        this.goto(this._selectedIndex + 1);
    },

    goto: function (index) {
        this.selectedIndex(index);
    },

    _onKeyDown: function (e) {
        var c = e.keyCode;

        // If the dropdown `ul` is in view, then act on keydown for the following keys:
        // Enter / Esc / Up / Down
        if (this.isOpen()) {
            if (c === 13) { // Enter
                e.preventDefault();
                this._onEnter();
            }
            else if (c === 27) { // Esc
                this.close();
            }
            else if (c === 38 || c === 40) { // Down/Up arrow
                e.preventDefault();
                this[c === 38 ? "previous" : "next"]();
            }
        }
    },

    _onMouseDown: function (e) {
        var $li = $(e.currentTarget),
            index = this.$list.find('li').index($li);

        this._select(index);
    },

    _onEnter: function () {
        var index = this.$list.find('.active').index();

        this._select(index);
    },

    _select: function (index) {
        this.selectedIndex(index);
        this.selectedItem(this._dataSource[index]);
        this.$input.val(this.text());
        this.close();
    },

    _checkIndex: function (index) {
        if (index < 0) return this._dataSource.length - 1;
        if ((index >= this._dataSource.length)) return 0;

        return index;
    },

    _activeSelectedIndex: function (index) {
        this.$list.find('li.active').removeClass('active');
        this.$list.find('li').eq(index).addClass('active');
    }
};