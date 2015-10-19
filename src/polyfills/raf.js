/**
 * Created by huangxinghui on 2015/10/19.
 */

// see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
var lastTime = 0;
var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;

if (!requestAnimationFrame) {
  requestAnimationFrame = function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

if (!cancelAnimationFrame) {
  cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}