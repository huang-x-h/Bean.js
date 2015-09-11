/**
 * Created by huangxinghui on 2015/6/24.
 */

var _ = require('underscore');
var HighlightList = require('../components/highlightlist');

module.exports = {
    _create: function () {
        this._opened = false;

        this.$input = this.$element.find('input').attr({
            autocomplete: "off",
            spellcheck: false
        });
    },

    dropdown: function () {
        if (!this.$dropdown) {
            this.$dropdown = new HighlightList($('<ul class="dropdown-menu"></ul>'), this.options);
        }

        return this.$dropdown;
    },

    isOpen: function () {
        return this._opened;
    },

    open: function () {
        if (this.isOpen()) return;

        this.$element.append(this.dropdown().$element);
        this.$element.addClass('open');
        this._opened = true;
        this.trigger('open');
    },

    close: function () {
        if (!this.isOpen()) return;

        this.dropdown().$element.detach();
        this.$element.removeClass('open');
        this._opened = false;
        this.trigger('close');
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
                this.dropdown()[c === 38 ? "previous" : "next"]();
            }
        }
    },

    _onMouseDown: function (e) {
        var $li = $(e.currentTarget),
            dropDownInstance = this.dropdown(),
            index = dropDownInstance.$element.find('li').index($li);

        var item = dropDownInstance.dataSource().get(index);
        this.$input.val(dropDownInstance.itemToLabel(item));
        this.close();
    },

    _onEnter: function () {
        this.$input.val(this.dropdown().text());
        this.close();
    }
};