/**
 * Created by huangxinghui on 2015/8/13.
 */

var plugin = require('../../plugin')
var DatePicker = require('./datepicker')
var util = require('../../utils/string')

var TimePicker = DatePicker.extend({
  options: {
    inline: false,
    startView: 0,
    endView: 0,
    defaultViewDate: new Date(),
    orientation: 'auto',
    rtl: false,
    immediateUpdates: false,
    autoclose: true,
    showOnFocus: true,
    keyboardNavigation: true,
    zIndexOffset: 10,
    format: 'HH:mm:ss',
    container: 'body'
  },

  _buildView: function() {
    this.parseFormat = 'HH:mm:ss'

    this.picker.append('<div><table><tfoot>' + this.getNowTemplate() + '</tfoot></table></div>')
  },

  showMode: function() {
    var d = new Date(this.viewDate),
      hour, minute, second

    hour = util.leftPad('' + d.getHours(), 2, '0')
    minute = util.leftPad('' + d.getMinutes(), 2, '0')
    second = util.leftPad('' + d.getSeconds(), 2, '0')

    this.picker.find('.label-hours').text(hour)
    this.picker.find('.label-minutes').text(minute)
    this.picker.find('.label-seconds').text(second)

    this.picker.children('div').show()
  },

  keydown: function(e) {
    if (!this.picker.is(':visible')) {
      // allow down to re-show picker
      if (e.keyCode === 40 || e.keyCode === 27) this.show()
    }
  }
})

plugin('timepicker', TimePicker)

module.exports = TimePicker
