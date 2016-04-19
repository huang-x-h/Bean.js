/**
 * Created by huangxinghui on 2015/10/20.
 */

var Widget = require('../../widget')
var Collapse = require('./collapse')

var Panel = Widget.extend({
  _create: function() {
    this.collapse = new Collapse(this.$element.find('.panel-collapse'))
    this.collapse.$trigger = this.$element.find('[data-toggle="collapse"]')
  },

  toggle: function(e) {
    this.collapse.toggle()
  },

  isOpen: function() {
    return this.collapse.isOpen()
  }
})

module.exports = Panel
