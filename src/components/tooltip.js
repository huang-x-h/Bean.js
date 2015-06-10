/**
 * Created by huangxinghui on 2015/5/18.
 */

var $ = require('jquery');
var _ = require('underscore');
var Widget = require('../widget');
var plugin = require('../plugin');
var TRANSITION_DURATION = 150;

var ToolTip = Widget.extend({
    options: {
        animation: true,
        placement: 'top',
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover',
        title: '',
        html: false,
        container: false
    },

    _create: function () {
        this.enabled = true;
        this.timeout = null;
        this.hoverState = null;
        this.showState = false;

        var triggers = this.options.trigger.split(' ');

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];

            if (trigger == 'click') {
                this.delegateEvents({
                    'click': 'toggle'
                });
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';
                var events = {};
                events[eventIn] = 'enter';
                events[eventOut] = 'leave';
                this.delegateEvents(events);
            }
        }

        this.fixTitle();
    },

    enter: function (e) {
        if (this.hoverState == 'in') {
            return;
        }

        var that = this;
        this.hoverState = 'in';

        setTimeout(function() {
            that.show();
        }, 100);
    },

    leave: function (e) {
        if (this.hoverState == 'out') {
            return;
        }

        var that = this;
        this.hoverState = 'out';

        setTimeout(function() {
            that.hide();
        }, 100);
    },

    show: function () {
        if (this.showState || this.hoverState == 'out') return;

        if (this.hasContent() && this.enabled) {
            this.trigger('show');

            var that = this;

            var $tip = this.tip();

            var tipId = _.uniqueId(this.widgetName);

            this.setContent();
            $tip.attr('id', tipId);
            this.$element.attr('aria-describedby', tipId);

            if (this.options.animation) $tip.addClass('fade');

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement;

            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

            $tip
                .detach()
                .css({top: 0, left: 0, display: 'block'})
                .addClass(placement);

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);

            var pos = this.getPosition();
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;

            if (autoPlace) {
                var orgPlacement = placement;
                var $container = this.options.container ? $(this.options.container) : this.$element.parent();
                var containerDim = this.getPosition($container);

                placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top' :
                    placement == 'top' && pos.top - actualHeight < containerDim.top ? 'bottom' :
                        placement == 'right' && pos.right + actualWidth > containerDim.width ? 'left' :
                            placement == 'left' && pos.left - actualWidth < containerDim.left ? 'right' :
                                placement;

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement);
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

            this.applyPlacement(calculatedOffset, placement);

            var complete = function () {
                that.trigger('shown');
                that.hoverState = null;
                that.showState = true;
            };

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                    .one('bsTransitionEnd', complete)
                    .emulateTransitionEnd(TRANSITION_DURATION) :
                complete();
        }
    },

    applyPlacement: function (offset, placement) {
        var $tip = this.tip();
        var height = $tip[0].offsetHeight;

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10);
        var marginLeft = parseInt($tip.css('margin-left'), 10);

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;

        offset.top = offset.top + marginTop;
        offset.left = offset.left + marginLeft;

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0);

        $tip.addClass('in');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualHeight = $tip[0].offsetHeight;

        if (/top/.test(placement) && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        $tip.offset(offset);
    },

    setContent: function () {
        var $tip = this.tip();
        var title = this.getTitle();

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
        $tip.removeClass('fade in top bottom left right');
    },

    hide: function () {
        if (!this.showState || this.hoverState == 'in') return;

        var that = this;
        var $tip = this.tip();

        function complete() {
            that.hoverState = null;
            that.showState = false;
            $tip.detach();
            that.$element
                .removeAttr('aria-describedby');
            that.trigger('hidden');
        }

        this.trigger('hide');

        $tip.removeClass('in');

        $.support.transition && this.$tip.hasClass('fade') ?
            $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(TRANSITION_DURATION) :
            complete();

        return this;
    },

    fixTitle: function () {
        var $e = this.$element;
        if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
        }
    },

    hasContent: function () {
        return this.getTitle();
    },

    getPosition: function ($element) {
        $element = $element || this.$element;

        var el = $element[0];
        var isBody = el.tagName == 'BODY';

        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, {width: elRect.right - elRect.left, height: elRect.bottom - elRect.top})
        }
        var elOffset = isBody ? {top: 0, left: 0} : $element.offset();
        var scroll = {scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()}
        var outerDims = isBody ? {width: $(window).width(), height: $(window).height()} : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset);
    },

    getCalculatedOffset: function (placement, pos, actualWidth, actualHeight) {
        var offset;
        switch (placement) {
            case 'bottom':
                offset = {
                    top: pos.top + pos.height,
                    left: pos.left + pos.width / 2 - actualWidth / 2
                };
                break;
            case 'top':
                offset = {
                    top: pos.top - actualHeight,
                    left: pos.left + pos.width / 2 - actualWidth / 2
                };
                break;
            case 'left':
                offset =  {
                    top: pos.top + pos.height / 2 - actualHeight / 2,
                    left: pos.left - actualWidth
                };
                break;
            case 'right':
                offset = {
                    top: pos.top + pos.height / 2 - actualHeight / 2,
                    left: pos.left + pos.width
                };
                break;
            case 'bottom-left':
                offset = {
                    top: pos.top + pos.height,
                    left: pos.left + pos.width - actualWidth
                };
                break;
            case 'bottom-right':
                offset = {
                    top: pos.top + pos.height,
                    left: pos.left
                };
                break;
            case 'top-left':
                offset = {
                    top: pos.top - actualHeight,
                    left: pos.left + pos.width - actualWidth
                };
                break;
            case 'top-right':
                offset = {
                    top: pos.top - actualHeight,
                    left: pos.left
                };
                break;
        }

        return offset;
    },

    getTitle: function () {
        var title;
        var $e = this.$element;
        var o = this.options;

        title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

        return title;
    },

    tip: function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template);

            //if (this.options.trigger.indexOf('hover') >= 0) {
            //    this._on(this.$tip, {
            //        'mouseenter': 'enter',
            //        'mouseleave': 'leave'
            //    })
            //}
        }
        return this.$tip;
    },

    arrow: function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'));
    },

    enable: function () {
        this.enabled = true;
    },

    disable: function () {
        this.enabled = false;
    },

    toggle: function (e) {
        this.tip().hasClass('in') ? this.leave(e) : this.enter(e);
    },

    destroy: function () {
        var that = this;
        clearTimeout(this.timeout);
        this.hide(function () {
            that._super.destroy();
        })
    }
});

plugin('tooltip', ToolTip);

module.exports = ToolTip;