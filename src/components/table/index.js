/**
 * Created by huangxinghui on 2015/8/25.
 */

var $ = require('jquery');
var _ = require('underscore');
var Immutable = require('immutable');
var plugin = require('../../plugin');
var mixin = require('../../utils/mixin');
var Widget = require('../../widget');
var ListMixin = require('../../mixins/list');
var template = require('./table.hbs');

function defaultItemRenderer(data, column) {
    return data[column.dataField];
}

var Table = Widget.extend({
    options: {
        columns: []
    },

    events: {
        'click tbody>tr': '_onClick'
    },

    _create: function () {
        this._selectedIndex = -1;
        this._selectedItem = null;
        this._setColumns(this.options.columns);

        this._renderTable();
        this.$tbody = this.$element.children('tbody');
        this._setDataSource(this.options.dataSource);
        this._setSelectedIndex(this.options.selectedIndex);
    },

    addItem: function (data, index) {
        var $tr = this._makeRow(data);

        if (_.isUndefined(index) || index > this._dataSource.size) {
            index = this._dataSource.size;
        }

        if (index === 0) {
            this.$tbody.prepend($tr);
        } else if (index === this._dataSource.size) {
            this.$tbody.append($tr);
        } else {
            this.$tbody.children().eq(index).before($tr);
        }
        this._dataSource = this._dataSource.splice(index, 0, data);
        this.trigger('add', data, index);
    },

    removeItem: function (data) {
        var index = this._dataSource.indexOf(data);

        if (index !== -1) {
            this._dataSource = this._dataSource.delete(index);
            this.$tbody.children().eq(index).remove();
            this.trigger('remove', data);
        }
    },

    updateItem: function (data, index) {
        var that = this;
        this._dataSource = this._dataSource.update(index, function (value) {
            return _.extend(value, data);
        });

        var item = this._dataSource.get(index);
        _.forEach(data, function (value, key) {
            that._updateCell(item, index, key);
        });
    },

    _onClick: function (e) {
        var $tr = $(e.currentTarget);
        this._setSelectedIndex(this.$tbody.children().index($tr));
    },

    _setColumns: function (columns) {
        this._columns = columns.map(function (column) {
            var data = {};
            data.headerText = column.headerText || column.dataField;
            data.dataField = column.dataField;
            data.itemRenderer = column.itemRenderer || defaultItemRenderer;
            return data;
        });
    },

    _setDataSource: function (dataSource) {
        this._dataSource = new Immutable.List(dataSource);
        this._renderBody();
    },

    _setSelectedIndex: function (index) {
        if (index > -1 && index < this._dataSource.size) {
            this._selectedItem = this._dataSource.get(index);
            this._selectedIndex = index;
            this._setSelection();
            this.trigger('change');
        }
    },

    _setSelectedItem: function (item) {
        var index = this._dataSource.indexOf(item);

        if (index !== -1) {
            this._selectedItem = item;
            this._selectedIndex = index;
            this._setSelection();
            this.trigger('change');
        }
    },

    _setSelection: function () {
        var $tr = this.$tbody.children().eq(this._selectedIndex);
        this.$tbody.children('.active').removeClass('active');
        $tr.addClass('active');
    },

    _renderTable: function () {
        this.$element.append(template({columns: this._columns}));
    },

    _renderBody: function () {
        var html = '',
            that = this;

        this._dataSource.forEach(function (data) {
            html += that._makeRow(data);
        });

        this.$tbody.html(html);
    },

    _makeRow: function (data) {
        var html = '<tr>',
            that = this;

        this._columns.forEach(function (column) {
            html += that._makeColumn(data, column);
        });
        html += '</tr>';

        return html;
    },

    _makeColumn: function (data, column) {
        return '<td data-column-field="' + column.dataField + '">' + column.itemRenderer(data, column) + '</td>';
    },

    _updateCell: function (data, rowIndex, dataField) {
        var $tr = this.$tbody.children().eq(rowIndex);
        var $td = $tr.children('[data-column-field="' + dataField + '"]');
        var columnIndex = $tr.children().index($td);
        var column = this._columns[columnIndex];
        $td.html(column.itemRenderer(data, column));
    }
});

mixin(Table, ListMixin);
plugin('table', Table);

module.exports = Table;