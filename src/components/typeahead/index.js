/**
 * Created by huangxinghui on 2015/6/5.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var mixin = require('../../utils/mixin');
var Widget = require('../../widget');
var DropDownMixin = require('../../mixins/dropdown');
var ListMixin = require('../../mixins/list');

function filter_contains(text, input) {
    return RegExp(input, "i").test(text);
}

function defaultItemRenderer (text, input) {
    return '<li><a href="javascript:;">' + text.replace(RegExp(input, "gi"), "<mark>$&</mark>") + '</a></li>';
}

var Typeahead = Widget.extend({
    options: {
        maxChars: 2,
        maxItems: 10,
        delay: 300,
        filter: filter_contains,
        itemRenderer: defaultItemRenderer,
        remote: null
    },

    events: {
        'input': '_onInput',
        'blur input': '_onBlur',
        'keydown': '_onKeyDown',
        'mousedown li': '_onMouseDown',
        'click .glyphicon-remove': '_onClickRemove'
    },

    _create: function () {
        this._inputHandler = _.debounce(this._evaluate, this.options.delay, true);
        this._dataSource = [];
        this.$close = this.$element.find('.glyphicon-remove');
    },

    _onInput: function (e) {
        this.$close.removeClass('hide');
        this._inputHandler(e);
    },

    _onBlur: function (e) {
        this.close();
    },

    _onClickRemove: function (e) {
        this._select(-1);
        this.$close.addClass('hide');
    },

    _evaluate: function () {
        var value = this.$input.val();

        // empty dropdown list
        this.dropdown().empty();

        if (value.length >= this.options.maxChars) {
            if (this.options.remote) {
                this._remoteQuery(value);
            } else {
                this._localQuery(value);
            }
        }

    },

    _toggleDropdown: function () {
        if (this.dropdown().children().length > 0) {
            this.open();
        } else {
            this.close();
        }
    },

    _setSelectedIndex: function (index) {
        if (index > -1 && index < this._dataSource.length) {
            this._selectedItem = this._dataSource[index];
            this._selectedIndex = index;
            this.trigger('change');
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
                that.dropdown().append(that.options.itemRenderer(item[that.options.dataTextField], input));
                return index < that.options.maxItems - 1;
            });

        this._toggleDropdown();
    },

    _remoteQuery: function (input) {
        var that = this;
        $.ajax({
            url: this.options.remote,
            type: 'GET',
            data: {
                qs: input
            }
        }).then(function (data) {
            that._dataSource = data;
            _.map(that._dataSource, function (item) {
                that.dropdown().append(that.options.itemRenderer(item[that.options.dataTextField], input));
            });

            that._toggleDropdown();
        });
    }
});

mixin(Typeahead, ListMixin);
mixin(Typeahead, DropDownMixin);

plugin('typeahead', Typeahead);