/**
 * Created by huangxinghui on 2015/9/11.
 */

var Immutable = require('immutable')
var DropList = require('../droplist')

var HighlightList = DropList.extend({
  _setDataSource: function(value, highlight) {
    var that = this
    this._dataSource = new Immutable.List(value)
    this._selectedIndex = -1
    this._selectedItem = null

    this.$element.html(this._dataSource.reduce(function(previous, current) {
      return previous + '<li class="list-item">'
        + that.itemToLabel(current).replace(RegExp(highlight, "gi"), "<mark>$&</mark>")
        + '</li>'
    }, '', this))
  }
})

module.exports = HighlightList
