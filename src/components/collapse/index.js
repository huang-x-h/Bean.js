/**
 * Created by huangxinghui on 2015/10/21.
 */

require('./collapse')
require('./panel')

var Widget = require('../../widget')
var plugin = require('../../plugin')
var $document = require('../../document')
var CollapseHandler = require('./collapse')
var PanelHandler = require('./panel')
var PanelGroupHandler = require('./panelgroup')

var Collapse = Widget.extend({
  _create: function() {
    if (this.$element.hasClass('panel')) {
      this.handler = new PanelHandler(this.$element)
    } else if (this.$element.hasClass('panel-group')) {
      this.handler = new PanelGroupHandler(this.$element)
    } else {
      this.handler = new CollapseHandler(this.$element)
    }
  },

  toggle: function(e) {
    this.handler.toggle(e)
  }
})

plugin('collapse', Collapse)

function getTargetFromTrigger($trigger) {
  var href
  var target = $trigger.attr('data-target')
    || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

  return $(target)
}

$document.on('click.collapse.data-api', '[data-toggle="collapse"]', function(e) {
  var $this = $(this),
    dataTarget = $this.attr('data-target'),
    $target

  if (!dataTarget) e.preventDefault()

  if (dataTarget === 'panel') {
    $target = $this.parents('.panel')
  } else if (dataTarget === 'panelGroup') {
    $target = $this.parents('.panel-group')
  } else {
    $target = getTargetFromTrigger($this)
  }

  $target.collapse('toggle', e)
})
