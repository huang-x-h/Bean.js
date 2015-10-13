/**
 * Created by huangxinghui on 2015/6/1.
 */

var $ = require('jquery');
var _ = require('underscore');
var Immutable = require('immutable');
var plugin = require('../../plugin');
var mixin = require('../../utils/mixin');
var Widget = require('../../widget');
var DropDownMixin = require('../../mixins/dropdown');
var ListMixin = require('../../mixins/list');
var template = require('./combobox.hbs');

function itemRendererHandler(data) {
  return '<a href="javascript:;">' + data[this.options.dataTextField] + '</a>';
}

var ComboBox = Widget.extend({
  options: {
    placeholder: 'Please Select...',
    selectedIndex: -1,
    itemRenderer: itemRendererHandler
  },

  events: {
    'click button': '_onButtonClick',
    'keydown': '_onKeyDown',
    'mousedown li': '_onMouseDown'
  },

  _create: function() {
    this.$element.append(template());

    this._setDataSource(this.options.dataSource);
    this._setSelectedIndex(this.options.selectedIndex);
  },

  _setDataSource: function(value) {
    this._dataSource = new Immutable.List(value);
    this._selectedIndex = -1;
    this._selectedItem = null;

    this.$element.html(this._dataSource.reduce(function(result, item) {
      return result + '<li>' + _.bind(this.options.itemRenderer, this, item)() + '</li>';
    }, '', this));
  },

  _setSelectedIndex: function(index) {
    if (index > -1 && index < this._dataSource.size) {
      this._selectedItem = this._dataSource.get(index);
      this._selectedIndex = index;
      this._trigger('change');
    }
  },

  toggle: function() {
    this.isOpen() ? this.close() : this.open();
  },

  _onButtonClick: function(e) {
    this.toggle();
  }
});

mixin(ComboBox, ListMixin);
mixin(ComboBox, DropDownMixin);
plugin('combobox', ComboBox);

module.exports = ComboBox;