/**
 * Created by huangxinghui on 2015/9/7.
 */

var _ = require('underscore')
var $ = require('jquery')

module.exports = {
  options: {
    dataTextField: 'text',
    dataValueField: 'value',
    selectedIndex: -1,
    dataSource: []
  },

  selectedIndex: function(index) {
    if (_.isUndefined(index)) {
      return this._selectedIndex
    } else if (this._selectedIndex != index) {
      this._setSelectedIndex(index)
    }
  },

  _setSelectedIndex: $.noop,

  selectedItem: function(item) {
    if (_.isUndefined(item)) {
      return this._selectedItem
    } else {
      this._setSelectedItem(item)
    }
  },

  _setSelectedItem: $.noop,

  dataSource: function(value) {
    if (_.isUndefined(value)) {
      return this._dataSource
    } else {
      this._setDataSource(value)
    }
  },

  _setDataSource: $.noop,

  itemToLabel: function(data) {
    var label = ''
    if (_.isString(data)) {
      label = data
    } else if (_.isObject(data)) {
      label = data[this.options.dataTextField]
    }

    return label
  },

  itemToValue: function(data) {
    var label = ''
    if (_.isString(data)) {
      label = data
    } else if (_.isObject(data)) {
      label = data[this.options.dataValueField]
    }

    return label
  },

  text: function() {
    return this.itemToLabel(this._selectedItem)
  },

  value: function() {
    return this.itemToValue(this._selectedItem)
  }
}
