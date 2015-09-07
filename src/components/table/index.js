/**
 * Created by huangxinghui on 2015/8/25.
 */

var $ = require('jquery');
var plugin = require('../../plugin');
var Widget = require('../../widget');
var headerTemplate = require('./header.hbs');

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
        this.dataSource = this.options.dataSource;
        this._setColumns(this.options.columns);

        this._renderHeader();
        this._renderBody();

        this.$tbody = this.$element.children('tbody');
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

        this.selectedItem = this.dataSource[this.$tbody.children().index($tr)];
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

    _renderHeader: function () {
        this.$element.append(headerTemplate({columns: this.columns}));
    },

    _renderBody: function () {
        var html = '<tbody>',
            that = this;

        this.dataSource.forEach(function (data) {
            html += that._makeRow(data);
        });

        html += '</tbody>';

        this.$element.append(html);
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