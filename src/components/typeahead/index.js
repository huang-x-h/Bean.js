/**
 * Created by huangxinghui on 2015/6/5.
 */

var $ = require('jquery');
var _ = require('underscore');
var plugin = require('../../plugin');
var mixin = require('../../utils/mixin');
var Widget = require('../../widget');
var DropDownMixin = require('../../mixins/dropdown');

function filter_contains(data, input) {
    return RegExp(input, "i").test(this.itemToLabel(data));
}

var Typeahead = Widget.extend({
    options: {
        maxChars: 2,
        maxItems: 10,
        delay: 300,
        dataTextField: 'text',
        dataValueField: 'value',
        dataSource: [],
        filter: filter_contains,
        remote: null
    },

    events: {
        'input': '_onInput',
        'blur input': '_onBlur',
        'keydown input': '_onKeyDown',
        'mousedown li': '_onMouseDown',
        'click .glyphicon-remove': '_onClickRemove'
    },

    _create: function () {
        this._inputHandler = _.debounce(this._evaluate, this.options.delay, true);
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
        this.$input.val('');
        this.$close.addClass('hide');
    },

    _evaluate: function () {
        var value = this.$input.val();

        if (value.length >= this.options.maxChars) {
            if (this.options.remote) {
                this._remoteQuery(value);
            } else {
                this._localQuery(value);
            }
        }
    },

    _toggleDropdown: function () {
        if (this.dropdown().$element.children().length > 0) {
            this.open();
        } else {
            this.close();
        }
    },

    _localQuery: function (input) {
        var that = this,
            dataSource = [],
            dropDownInstance = this.dropdown();

        _.chain(this.options.dataSource)
            .filter(function (item) {
                return _.bind(that.options.filter, that, item, input)();
            })
            .every(function (item, index) {
                dataSource.push(item);
                return index < that.options.maxItems - 1;
            });

        dropDownInstance.highlight(input);
        dropDownInstance._setDataSource(dataSource);
        this._toggleDropdown();
    },

    _remoteQuery: function (input) {
        var that = this;
        $.ajax({
            url: this.options.remote,
            type: 'POST',
            data: {
                qs: input
            }
        }).then(function (data) {
            var dropDownInstance = this.dropdown();
            dropDownInstance.highlight(input);
            dropDownInstance._setDataSource(data);
            that._toggleDropdown();
        });
    },

    itemToLabel: function (data) {
        var label = '';
        if (_.isString(data)) {
            label = data;
        } else if (_.isObject(data)) {
            label = data[this.options.dataTextField];
        }

        return label;
    }
});

mixin(Typeahead, DropDownMixin);

plugin('typeahead', Typeahead);