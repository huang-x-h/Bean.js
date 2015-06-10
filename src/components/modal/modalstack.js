/**
 * Created by huangxinghui on 2015/5/28.
 */

var $ = require('jquery');
var $body = require('../../body');
var StackedMap = require('./stackedmap');
var modalTpl = require('./modal.hbs');
var backdropTpl = require('./backdrop.hbs');
var openedWindows = StackedMap.createNew();
var OPENED_MODAL_CLASS = 'modal-open';
var BACKDROP_TRANSITION_DURATION = 150;
var TRANSITION_DURATION = 300;
var $backdropElement;

function backdropIndex() {
    var topBackdropIndex = -1;
    var opened = openedWindows.keys();
    for (var i = 0; i < opened.length; i++) {
        if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
        }
    }
    return topBackdropIndex;
}

function removeModalWindow(modalInstance, callback) {
    var modalWindow = openedWindows.get(modalInstance).value;

    openedWindows.remove(modalInstance);

    //remove window DOM element
    modalWindow.$modalElement.off('.data-api');
    removeAfterAnimate(modalWindow.$modalElement, TRANSITION_DURATION, function () {
        $body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
        checkRemoveBackdrop(callback);
    });
}

function checkRemoveBackdrop(callback) {
    var currBackdropIndex;
    //remove backdrop if no longer needed
    if ($backdropElement) {
        currBackdropIndex = backdropIndex()
        if (currBackdropIndex == -1) {
            removeAfterAnimate($backdropElement, BACKDROP_TRANSITION_DURATION, function () {
                $backdropElement = null;
                callback();
            });
        } else {
            $backdropElement.css('z-index', 1040 + (currBackdropIndex && 1 || 0) + currBackdropIndex * 10);
            callback();
        }
    } else {
        callback();
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

        if (currBackdropIndex >= 0) {
            if (!$backdropElement) {
                $backdropElement = $(backdropTpl());
                $body.append($backdropElement);
            } else {
                $backdropElement.css('z-index', 1040 + (currBackdropIndex && 1 || 0) + currBackdropIndex * 10);
            }
        }

        $modalElement = $(modalTpl({'z-index': 1050 + (openedWindows.length() - 1) * 10
            , 'content': options.content, 'size': options.size}));
        $modalElement
            .on('click.dismiss.data-api', '[data-dismiss]', function (e) {
                modalStack.dismiss(modalInstance, 'dismiss click');
            })
            .on('click.close.data-api', '[data-close]', function (e) {
                modalStack.close(modalInstance, 'close click');
            });

        $body.append($modalElement);

        openedWindows.top().value.$modalElement = $modalElement;
        openedWindows.top().value.modalOpener = modalOpener;

        $body.addClass(OPENED_MODAL_CLASS);
    },

    close: function (modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
            removeModalWindow(modalInstance, function () {
                modalWindow.value.deferred.resolve(result);
            });
            modalWindow.value.modalOpener.focus();
            return true;
        }
        return !modalWindow;

    },

    dismiss: function (modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
            removeModalWindow(modalInstance, function () {
                modalWindow.value.deferred.reject(reason);
            });
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