/**
 * Created by huangxinghui on 2015/5/15.
 */

var $ = require('jquery');

module.exports = plugin;

function plugin(widgetName, widgetClass) {
  // add widgetName to widget prototype
  widgetClass.prototype.widgetName = widgetName;

  function Plugin(option) {
    var isMethodCall = typeof option === "string",
        args = Array.prototype.slice.call(arguments, 1),
        returnValue = this;

    if (isMethodCall) {
      this.each(function() {
        var $this = $(this);
        var data = $this.data(widgetName);

        if (!data) $this.data(widgetName, data = new widgetClass(this));
        returnValue = data[option].apply(data, args);
      });
    } else {
      this.each(function() {
        var $this = $(this);
        var options = typeof option == 'object' && option;

        $this.data(widgetName, new widgetClass(this, options));
      });
    }

    return returnValue;
  }

  var old = $.fn[widgetName];

  $.fn[widgetName] = Plugin;

  // Widget NO CONFLICT
  // ====================

  $.fn[widgetName].noConflict = function() {
    $.fn[widgetName] = old;
    return this;
  };
}