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
        'blur input': '_onBlur',
        'keydown': '_onKeyDown',
        'mousedown li': '_onMouseDown',
        'click .glyphicon-remove': '_onClickRemove'
    },

    _create: function () {
        this._inputHandler = _.debounce(this._evaluate, this.options.delay, true);
        this._dataSource = [];

        this.$input = this.$element.find('input').attr({
            autocomplete: "off",
            spellcheck: false
        });
        this.$close = this.$element.find('.glyphicon-remove');
        this.$list = $('<ul class="dropdown-menu"></ul>').appendTo(this.$element);
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
        this.$list.empty();

        if (value.length >= this.options.maxChars) {
            if (this.options.remote) {
                this._remoteQuery(value);
            } else {
                this._localQuery(value);
            }
        }

    },

    _toggleDropdown: function () {
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

        this._toggleDropdown();
    },

    _remoteQuery: function (input) {
        var that = this;
        $.ajax({
            url: this.options.remote,
            type: 'GET'
        }).then(function (data) {
            that._dataSource = data;
            _.map(that._dataSource, function (item) {
                that.$list.append(that.options.itemRenderer(item[that.options.dataTextField], input));
            });

            that._toggleDropdown();
        });
    }
});

mixin(Typeahead, DropDownListMixin);

plugin('typeahead', Typeahead);