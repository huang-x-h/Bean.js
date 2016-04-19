/**
 * Created by huangxinghui on 2015/10/21.
 */

var $ = require('jquery')
var Widget = require('../../widget')
var DATA_COLLAPSE = 'bean.collapse'
var Selector = {
  Panel: '.panel'
}

var PanelGroup = Widget.extend({
  _create: function() {
    this.$element.find('.panel-collapse').each(function(index, collapseElement) {
      $(collapseElement).collapse()
    })
  },

  toggle: function(e) {
    var $target = $(e.currentTarget),
      $collapse = $target.parents(Selector.Panel),
      collapse = $collapse.collapse().data(DATA_COLLAPSE).handler,
      activesData

    if (collapse.isOpen()) {
      collapse.hide()
    } else {
      var actives = this.$element.children(Selector.Panel).children('.in, .collapsing')

      if (actives && actives.length) {
        activesData = actives.parents(Selector.Panel).data(DATA_COLLAPSE)
        if (activesData && activesData.handler.collapse.transitioning) return
      }

      this.$element.children(Selector.Panel).collapse('hide')

      collapse.show()
    }
  }
})

module.exports = PanelGroup
