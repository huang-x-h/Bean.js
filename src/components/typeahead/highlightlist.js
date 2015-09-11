/**
 * Created by huangxinghui on 2015/9/11.
 */

var _ = require('underscore');
var Immutable = require('immutable');
var List = require('../list');

function defaultHighLightItemRenderer (data, input) {
    return '<a href="javascript:;">' + this.itemToLabel(data).replace(RegExp(input, "gi"), "<mark>$&</mark>") + '</a>';
}

var HighlightList = List.extend({
    options: {
        itemRenderer: defaultHighLightItemRenderer
    },

    _setDataSource: function (value, highlight) {
        this._dataSource = new Immutable.List(value);
        this._selectedIndex = -1;
        this._selectedItem = null;

        this.$element.html(this._dataSource.reduce(function (previous, current) {
            return previous + '<li>' + _.bind(this.options.itemRenderer, this, current, highlight)() + '</li>';
        }, '', this));
    }
});

module.exports = HighlightList;