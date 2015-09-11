/**
 * Created by huangxinghui on 2015/6/24.
 */

module.exports = {
    options: {
        dataTextField: 'text',
        dataValueField: 'value'
    },

    _create: function () {
        this._opened = false;
        this.$input = this.$element.find('input').attr({
            autocomplete: "off",
            spellcheck: false
        });
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

    dropdown: function () {
        if (!this.$dropdown) {
            this.$dropdown = $('<ul class="dropdown-menu"></ul>');
        }

        return this.$dropdown;
    },

    isOpen: function () {
        return this._opened;
    },

    open: function () {
        if (this.isOpen()) return;

        this.$element.append(this.dropdown());
        this.$element.addClass('open');
        this._opened = true;
        this.trigger('open');
    },

    close: function () {
        if (!this.isOpen()) return;

        this.dropdown().detach();
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
        this._setSelectedIndex(index);
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
            index = this.dropdown().find('li').index($li);

        this._select(index);
    },

    _onEnter: function () {
        var index = this.dropdown().find('.active').index();

        this._select(index);
    },

    _select: function (index) {
        this._setSelectedIndex(index);
        this.$input.val(this.text());
        this.close();
    }
};