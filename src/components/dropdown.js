/**
 * Created by huangxinghui on 2015/5/19.
 */

var $ = require('jquery');
var plugin = require('../plugin');

plugin('dropdown', {
    _create: function () {
        
    },

    toggle: function (e) {
        var $this = $(this)
    
        if ($this.is('.disabled, :disabled')) return
    
        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')
    
        clearMenus()
    
        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
            }
    
            var relatedTarget = { relatedTarget: this }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))
    
            if (e.isDefaultPrevented()) return
    
            $this
                .trigger('focus')
                .attr('aria-expanded', 'true')
    
            $parent
                .toggleClass('open')
                .trigger('shown.bs.dropdown', relatedTarget)
        }
    
        return false
    },
    
    keydown: function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return
    
        var $this = $(this)
    
        e.preventDefault()
        e.stopPropagation()
    
        if ($this.is('.disabled, :disabled')) return
    
        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')
    
        if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
            if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }
    
        var desc = ' li:not(.disabled):visible a'
        var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)
    
        if (!$items.length) return
    
        var index = $items.index(e.target)
    
        if (e.which == 38 && index > 0)                 index--                        // up
        if (e.which == 40 && index < $items.length - 1) index++                        // down
        if (!~index)                                      index = 0
    
        $items.eq(index).trigger('focus')
    }

})