/**
 * Created by huangxinghui on 2015/9/10.
 */

var $ = require('jquery');
var Immutable = require('immutable');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var mixin = require('../../utils/mixin');
var DropDownMixin = require('../../mixins/dropdown');
var List = require('../list');

var EmailList = List.extend({
    _setDataSource: function (value, prefix) {
        this._dataSource = new Immutable.List(value);
        this._selectedIndex = -1;
        this._selectedItem = null;
        this.prefix = prefix;

        this.$element.html(this._dataSource.reduce(function (previous, current) {
            return previous + '<li><a href="javascript:;">' + prefix + '@' + current + '</a></li>';
        }, '', this));
    },

    itemToLabel: function (data) {
        return this.prefix + '@' + data;
    }
});

var EmailAutoComplete = Widget.extend({
    options: {
        suffixes: ["qq.com", "gmail.com", "126.com", "163.com", "hotmail.com", "263.com", "21cn.com", "yahoo.com", "yahoo.com.cn", "live.com", "sohu.com", "sina.com", "sina.com.cn"]
    },

    events: {
        'input': '_onInput',
        'blur input': '_onBlur',
        'keydown': '_onKeyDown',
        'mousedown li': '_onMouseDown'
    },

    dropdown: function () {
        if (!this.$dropdown) {
            this.$dropdown = new EmailList($('<ul class="dropdown-menu"></ul>'));
        }

        return this.$dropdown;
    },

    _onInput: function () {
        var text = this.$input.val(),
            arr = text.split('@'),
            suffixes;

        if (arr.length === 1 || arr[1] === '') {
            suffixes = this.options.suffixes;
        } else {
            suffixes = this.options.suffixes.filter(function (suffix) {
                return suffix.indexOf(arr[1]) !== -1;
            });
        }

        this.dropdown()._setDataSource(suffixes, arr[0]);
        this.open();
    },

    _onBlur: function (e) {
        this.close();
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
});

mixin(EmailAutoComplete, DropDownMixin);

plugin('emailautocomplete', EmailAutoComplete);

module.exports = EmailAutoComplete;