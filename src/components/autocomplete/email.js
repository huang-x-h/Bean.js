/**
 * @class EmailAutoComplete
 * @extends Widget
 */

var $ = require('jquery')
var Immutable = require('immutable')
var plugin = require('../../plugin')
var Widget = require('../../widget')
var Typeahead = require('../typeahead')
var DropList = require('../droplist')

var EmailList = DropList.extend({
  _setDataSource: function(value, prefix) {
    this._dataSource = new Immutable.List(value)
    this._selectedIndex = -1
    this._selectedItem = null
    this.prefix = prefix

    this.$element.html(this._dataSource.reduce(function(previous, current) {
      return previous + '<li class="list-item">' + prefix + '@' + current + '</li>'
    }, '', this))
  },

  itemToLabel: function(data) {
    return this.prefix + '@' + data
  }
})

var EmailAutoComplete = Typeahead.extend({
  options: {
    suffixes: ['qq.com', 'gmail.com', '126.com', '163.com', 'hotmail.com', '263.com',
      '21cn.com', 'yahoo.com', 'yahoo.com.cn', 'live.com', 'sohu.com', 'sina.com', 'sina.com.cn'],
    maxChars: 1
  },

  _getDropListClass: function() {
    return EmailList
  },

  _evaluate: function() {
    var text = this.$element.val(),
      arr, suffixes

    if (text) {
      arr = text.split('@')
      if (arr.length === 1 || arr[1] === '') {
        suffixes = this.options.suffixes
      } else {
        suffixes = this.options.suffixes.filter(function(suffix) {
          return suffix.indexOf(arr[1]) !== -1
        })
      }

      this.dropList._setDataSource(suffixes, arr[0])
      this.dropList.open()
    } else {
      this.dropList.close()
    }
  }
})

plugin('emailautocomplete', EmailAutoComplete)
