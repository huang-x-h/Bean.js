/**
 * Created by huangxinghui on 2015/5/28.
 */

var $ = require('jquery');
var StackedMap = require('./stackedmap');
var modalTpl = require('./modal.hbs');
var backdropTpl = require('./backdrop.hbs');
var openedWindows = StackedMap.createNew();
var OPENED_MODAL_CLASS = 'modal-open';
var BACKDROP_TRANSITION_DURATION = 150;
var TRANSITION_DURATION = 300;
var $body = $(document.body);
var $backdropElement;

function backdropIndex() {
    var topBackdropIndex = -1;
    var opened = openedWindows.keys();
    for (var i = 0; i < opened.length; i++) {
        if (openedWindows.get(opened[i]).backdrop) {
            topBackdropIndex = i;
        }
    }
    return topBackdropIndex;
}

function removeModalWindow(modalInstance) {
    var modalWindow = openedWindows.get(modalInstance).value;

    openedWindows.remove(modalInstance);

    //remove window DOM element
    modalWindow.$modalElement.off('.data-api');
    removeAfterAnimate(modalWindow.$modalElement, TRANSITION_DURATION, function () {
        $body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
        checkRemoveBackdrop();
    });
}

function checkRemoveBackdrop() {
    //remove backdrop if no longer needed
    if ($backdropElement && backdropIndex() == -1) {
        removeAfterAnimate($backdropElement, BACKDROP_TRANSITION_DURATION, function () {
            $backdropElement = null;
        });
    }
}

function removeAfterAnimate($element, duration, callback) {
    $element.removeClass('in');

    var callbackRemove = function () {
        $element.remove();
        callback();
    };

    $.support.transition && $element.hasClass('fade') ?
        $element
            .one('bsTransitionEnd', callbackRemove)
            .emulateTransitionEnd(duration) :
        callbackRemove()
}

var modalStack = {
    open: function (modalInstance, options) {
        var modalOpener = document.activeElement;

        openedWindows.add(modalInstance, {
            deferred: options.deferred,
            backdrop: options.backdrop,
            keyboard: options.keyboard
        });

        var currBackdropIndex = backdropIndex(), $modalElement;

        if (currBackdropIndex === -1 && !$backdropElement) {
            $backdropElement = $(backdropTpl());
            $body.append($backdropElement);
        } else {
            $backdropElement.css('z-index', 1040 + (currBackdropIndex && 1 || 0) + index * 10);
        }

        $modalElement = $(modalTpl({'z-index': 1050 + (openedWindows.length() - 1) * 10
            , 'content': options.content}));
        $modalElement.on('click.dismiss.data-api', '[data-dismiss]', function (e) {
                modalStack.close(modalInstance, 'dismiss click')
            });

        $body.append($modalElement);

        openedWindows.top().value.$modalElement = $modalElement;
        openedWindows.top().value.modalOpener = modalOpener;

        $body.addClass(OPENED_MODAL_CLASS);
    },

    close: function (modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
            //modalWindow.value.deferred.resolve(result);
            removeModalWindow(modalInstance);
            modalWindow.value.modalOpener.focus();
            return true;
        }
        return !modalWindow;

    },

    dismiss: function (modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
            modalWindow.value.deferred.reject(reason);
            removeModalWindow(modalInstance);
            modalWindow.value.modalOpener.focus();
            return true;
        }
        return !modalWindow;
    }
};

$(document).on('keydown', function (evt) {
    var modal;

    if (evt.which === 27) {
        modal = openedWindows.top();
        if (modal && modal.value.keyboard) {
            evt.preventDefault();
            modalStack.dismiss(modal.key, 'escape key press');
        }
    }
});

module.exports = modalStack;