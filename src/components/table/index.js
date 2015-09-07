/**
 * Created by huangxinghui on 2015/8/25.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var template = require('./table.hbs');

function defaultItemRenderer(data, column) {
    return data[column.dataField];
}

var Table = Widget.extend({
    options: {
        columns: [],
        dataSource: []
    },

    events: {
        'click tbody>tr': '_onClick'
    },

    _create: function () {
        this._setDataSource(this.options.dataSource);
        this._setColumns(this.options.columns);

        this._renderTable();
        this.$tbody = this.$element.children('tbody');
        this._renderBody();
    },

    dataSource: function (value) {
        if (arguments.length === 0) {
            return this._dataSource;
        } else {
            this._setDataSource(value);
            this._renderBody();
        }
    },

    addItem: function (data, index) {

    },

    removeItem: function (data) {

    },

    updateItem: function (data) {

    },

    _onClick: function (e) {
        var $tr = $(e.currentTarget);

        this.$tbody.children('.active').removeClass('active');
        $tr.addClass('active');

        this.selectedItem = this._dataSource[this.$tbody.children().index($tr)];
    },

    _setColumns: function (columns) {
        this.columns = columns.map(function (column) {
            var data = {};
            data.headerText = column.headerText || column.dataField;
            data.dataField = column.dataField;
            data.itemRenderer = column.itemRenderer || defaultItemRenderer;
            return data;
        });
    },

    _setDataSource: function (dataSource) {
        this._dataSource = dataSource;
    },

    _renderTable: function () {
        this.$element.append(template({columns: this.columns}));
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

        this.columns.forEach(function (column) {
            html += that._makeColumn(data, column);
        });
        html += '</tr>';

        return html;
    },

    _makeColumn: function (data, column) {
        return '<td>' + column.itemRenderer(data, column) + '</td>';
    }
});

plugin('table', Table);

module.exports = Table;