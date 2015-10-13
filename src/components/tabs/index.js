/**
 * Created by huangxinghui on 2015/10/12.
 */

var $ = require('jquery');
var _ = require('underscore');
var Widget = require('../../widget');
var plugin = require('../../plugin');
var headingTemplate = require('./heading.hbs');
var contentTemplate = require('./content.hbs');
var defaultTabOptions = {
  heading: '',
  content: '',
  active: true,
  disabled: false
};

var Tabs = Widget.extend({
  options: {
    selectedIndex: 0
  },

  events: {
    'click li': '_onClick'
  },

  _create: function() {
    this.$tabs = this.$element.children('.nav');
    this.$tabContent = this.$element.children('.tab-content');

    this._buildTabs(this.$tabs.children(), this.$tabContent.children());
    this._setSelectedIndex(this.options.selectedIndex);
  },

  selectedIndex: function(index) {
    if (_.isUndefined(index)) {
      return this._selectedIndex;
    } else if (this._selectedIndex != value) {
      this._setSelectedIndex(index);
    }
  },

  _setSelectedIndex: function(index) {
    var tab = _.find(this.tabs, function(tab) {
      return tab.active;
    });

    if (tab) {
      this._toggleActiveTab(tab, false);
    }

    tab = this.tabs[index];
    this._toggleActiveTab(tab, true);

    this._selectedIndex = index;
    this._trigger('active', index);
  },

  _toggleActiveTab: function(tab, active) {
    tab.heading.toggleClass('active', active);
    tab.content.toggleClass('active', active);
    tab.active = active;
  },

  addTab: function(options, index) {
    var tab = this._buildTab(options),
        heading = tab.heading;

    if (_.isUndefined(index)) {
      this.tabs.push(tab);
      index = this.tabs.length - 1;
    }
    else {
      this.tabs.splice(index, null, tab);
    }

    if (index === 0) {
      this.$tabs.prepend(heading);
    } else if (index === this.tabs.length - 1) {
      this.$tabs.append(heading);
    } else {
      this.$tabs.children().eq(index).before(heading);
    }

    this.$tabContent.append(tab.content);

    if (tab.active) {
      this._setSelectedIndex(index);
    }
  },

  removeTab: function(index) {
    var tab, newActiveIndex;

    if (index >= 0 && index < this.tabs.length) {
      tab = this.tabs[index];
      tab.heading.remove();
      tab.content.remove();
      this.tabs.splice(index, 1);

      if (tab.active && this.tabs.length > 1) {
        newActiveIndex = index == this.tabs.length ? index - 1 : index;
        this._setSelectedIndex(newActiveIndex);
      }
    }
  },

  _onClick: function(e) {
    var index = this.$tabs.children().index(e.currentTarget);
    this._setSelectedIndex(index);
  },

  _buildTabs: function(tabs, tabContents) {
    var that = this;
    this.tabs = [];

    tabs.each(function(index, tab) {
      var $tab = $(tab);
      that.tabs.push({
        heading: $tab,
        content: $(tabContents[index]),
        active: $tab.hasClass('active')
      });
    });
  },

  _buildTab: function(options) {
    options = $.extend({}, defaultTabOptions, options);

    var tab = {};
    tab.heading = $(headingTemplate(options));
    tab.content = $(contentTemplate(options));
    tab.active = options.active;
    return tab;
  }
});

plugin('tabs', Tabs);