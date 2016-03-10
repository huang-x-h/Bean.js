/**
 * Created by huangxinghui on 2016/3/10.
 */

// refer to https://github.com/cowboy/jquery-resize/blob/master/jquery.ba-resize.js
var $ = require('jquery');
var elements = $();
var RESIZE = 'resize';
var DATA_RESIZE = RESIZE + '-special-event';
var resizeRAF;

function dirtyCheck() {
  elements.each(function() {
    var rect = this.getBoundingClientRect(),
        data = $.data(this, DATA_RESIZE);

    if (rect.width !== data.w || rect.height !== data.h) {
      $(this).trigger(RESIZE, [data.w = rect.width, data.h = rect.height]);
    }
  });

  resizeRAF = requestAnimationFrame(dirtyCheck);
}

// custom resize event
$.event.special.resize = {
  setup: function(data, namespaces, eventHandle) {
    var rect = this.getBoundingClientRect();

    elements = elements.add($(this));
    $.data(this, DATA_RESIZE, {w: rect.width, h: rect.height});

    if (elements.length === 1) {
      resizeRAF = requestAnimationFrame(dirtyCheck);
    }
  },

  teardown: function() {
    elements = elements.not($(this));
    $.removeData(this, DATA_RESIZE);

    if (elements.length === 0) {
      cancelAnimationFrame(resizeRAF);
    }
  }
};
