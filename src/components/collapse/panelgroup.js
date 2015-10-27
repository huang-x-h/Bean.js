/**
 * Created by huangxinghui on 2015/10/21.
 */

var $ = require('jquery');
var Widget = require('../../widget');
var DATA_COLLAPSE = 'bean.collapse';

var PanelGroup = Widget.extend({
  events: {
    'click .panel-heading a': 'toggle'
  },

  _create: function() {
    this.$element.find('.panel-collapse').each(function(index, collapseElement) {
      $(collapseElement).collapse();
    });
  },

  toggle: function(e) {
    var collapse = $(e.currentTarget).parents('.panel').children('.panel-collapse').data(DATA_COLLAPSE).handler,
        activesData;

    if (collapse.isOpen()) {
      collapse.hide();
    } else {
      var actives = this.$element.children('.panel').children('.in, .collapsing');

      if (actives && actives.length) {
        activesData = actives.data(DATA_COLLAPSE).handler;
        if (activesData && activesData.transitioning) return;
      }

      actives.each(function(index, collapseElement) {
        $(collapseElement).data(DATA_COLLAPSE).handler.hide();
      });

      collapse.show();
    }
  }
});

module.exports = PanelGroup;