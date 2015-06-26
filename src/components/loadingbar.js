/**
 * Created by huangxinghui on 2015/5/25.
 */

// copy from https://github.com/chieffancypants/angular-loading-bar
var $ = require('jquery');

var spinner = $('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>'),
    loadingBarContainer = $('<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>'),
    loadingBar = loadingBarContainer.find('.bar'),
    started = false,
    status = 0,
    incTimeout, completeTimeout;

module.exports = {
    start: function () {
        var $parent = $('body');

        clearTimeout(completeTimeout);

        if (started) {
            return;
        }

        started = true;

        $parent.append(loadingBarContainer);
        $parent.append(spinner);

        this.progress(status);
    },

    progress: function (value) {
        if (!started) {
            return;
        }
        var pct = (value * 100) + '%';
        loadingBar.css('width', pct);
        status = value;

        clearTimeout(incTimeout);
        incTimeout = setTimeout($.proxy(this.increment, this), 250);
    },

    increment: function () {
        if (status >= 1) {
            return;
        }

        var rnd = 0,
            stat = status;

        if (stat >= 0 && stat < 0.25) {
            // Start out between 3 - 6% increments
            rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        } else if (stat >= 0.25 && stat < 0.65) {
            // increment between 0 - 3%
            rnd = (Math.random() * 3) / 100;
        } else if (stat >= 0.65 && stat < 0.9) {
            // increment between 0 - 2%
            rnd = (Math.random() * 2) / 100;
        } else if (stat >= 0.9 && stat < 0.99) {
            // finally, increment it .5 %
            rnd = 0.005;
        } else {
            // after 99%, don't increment:
            rnd = 0;
        }

        var pct = status + rnd;
        this.progress(pct);
    },
    
    finish: function () {
        this.progress(1);

        clearTimeout(completeTimeout);

        completeTimeout = setTimeout(function() {
            loadingBarContainer.remove();
            spinner.remove();

            status = 0;
            started = false;
        }, 500);
    }
};