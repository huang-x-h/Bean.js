/**
 * Created by huangxinghui on 2015/6/5.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var DropDownListMixin = require('../../mixins/dropdownlist');
var mixin = require('../../utils/mixin');

function filter_contains(text, input) {
    return RegExp(input, "i").test(text);
}

var Typeahead = Widget.extend({
    options: {
        maxChars: 2,
        maxItems: 10,
        delay: 300,
        filter: filter_contains,
        itemRenderer: function (text, input) {
            return '<li><a href="javascript:;">' + text.replace(RegExp(input, "gi"), "<mark>$&</mark>") + '</a></li>';
        },
        remote: null
    },

    events: {
        'input': '_onInput',
        'keydown': '_onKeyDown',
        'mousedown li': '_onMouseDown'
    },

    _create: function () {
        this._inputHandler = _.debounce(this._evaluate, this.options.delay, true);
        this._dataSource = [];

        this.$input = this.$element.find('input');
        this.$close = this.$element.find('.glyphicon-remove');
        this.$list = $('<ul class="dropdown-menu"></ul>').appendTo(this.$element);
    },

    _onInput: function (e) {
        this.$close.removeClass('hide');
        this._inputHandler(e);
    },

    _onMouseDown: function (e) {
        var $li = $(e.currentTarget),
            index = this.$list.find('li').index($li);

        this._selectedIndex = index;
        this._select();
    },

    _select: function () {
        this.selectedItem(this._dataSource[this._selectedIndex]);
        this._selectedIndex = -1; // reset _selectedIndex
        this.$input.val(this.text());
        this.close();
    },

    _evaluate: function () {
        var value = this.$input.val();

        // empty dropdown list
        this.$list.empty();

        if (value.length >= this.options.maxChars) {
            if (this.options.remote) {
                this._remoteQuery(value);
            } else {
                this._localQuery(value);
            }
        }

        if (this.$list.children().length > 0) {
            this.open();
        } else {
            this.close();
        }
    },

    _localQuery: function (input) {
        var that = this;

        this._dataSource.length = 0;
        _.chain(this.options.dataSource)
            .filter(function (item) {
                return that.options.filter(item[that.options.dataTextField], input);
            })
            .every(function (item, index) {
                that._dataSource.push(item);
                that.$list.append(that.options.itemRenderer(item[that.options.dataTextField], input));
                return index < that.options.maxItems - 1;
            });
    },

    _remoteQuery: function (input) {
        var that = this;
        $.ajax({
            url: this.options.remote,
            type: 'POST'
        }).then(function (data) {
            that._dataSource = data;
        });
    }
});

mixin(Typeahead, DropDownListMixin);

plugin('typeahead', Typeahead);