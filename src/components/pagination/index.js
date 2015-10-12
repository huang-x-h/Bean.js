/**
 * Created by huangxinghui on 2015/5/22.
 */

var $ = require('jquery');
var Handlebars = require("hbsfy/runtime");
var plugin = require('../../plugin');
var Widget = require('../../widget');
var template = require('./pagination.hbs');

Handlebars.registerHelper('pagination', function(context, options) {
  var i = 2,
      out = '<li class="active"><a href="javascript:;">1</a></li>';
  if (context > 7) {
    for (; i < 6; i++) {
      out += '<li><a href="javascript:;">' + i + '</a></li>'
    }
    out += '<li data-index="6"><a href="javascript:;">...</a></li>';
    out += '<li><a href="javascript:;">' + context + '</a></li>';
  } else {
    for (; i <= context; i++) {
      out += '<li><a href="javascript:;">' + i + '</a></li>'
    }
  }

  return out;
});

var Pagination = Widget.extend({
  options: {
    pageSize: 10,
    totalSize: 50
  },

  events: {
    'click li': 'onClick'
  },

  _create: function() {
    var pages = this.options.totalSize / this.options.pageSize;
    this.pages = this.options.totalSize % this.options.pageSize === 0 ? pages : pages + 1;
    this.pageIndex = 1;

    this.$element.append(template({
      pages: this.pages
    }));

    this.$lis = this.$element.find('li');
    this.$prev = this.$lis.first();
    this.$next = this.$lis.last();
  },

  onClick: function(e) {
    var $li = $(e.currentTarget),
        index;

    if ($li.hasClass('disabled') || $li.hasClass('active')) return;

    if (e.currentTarget == this.$prev[0]) {
      this.previous();
    } else if (e.currentTarget == this.$next[0]) {
      this.next();
    } else {
      index = $li.find('a').text();

      if (index === '...') {
        this.goTo(parseInt($li.data('index')));
      } else {
        this.goTo(parseInt(index));
      }
    }
  },

  goTo: function(index) {
    this.pageIndex = index;

    this.$prev.toggleClass('disabled', this.pageIndex === 1);
    this.$next.toggleClass('disabled', this.pageIndex === this.pages);

    if (this.pages > 7) {
      this._rebuildPages(index);
    } else {
      this.$element.find('.active').removeClass('active');
      this.$lis.eq(index).addClass('active');
    }

    this.dispatchPageChange();
  },

  _rebuildPages: function(index) {
    var i;

    this.$element.find('.active').removeClass('active');

    if (index < 6) {
      for (i = 1; i < 6; i++) {
        this.$lis.eq(i).find('a').text(i);
      }
      this.$lis.eq(6).data('index', 6).find('a').text('...');
      this.$lis.eq(7).find('a').text(this.pages);
      this.$lis.eq(index).addClass('active');
    } else if (index + 5 > this.pages) {
      this.$lis.eq(1).find('a').text('1');
      this.$lis.eq(2).data('index', this.pages - 5).find('a').text('...');

      for (i = 0; i < 5; i++) {
        this.$lis.eq(7 - i).find('a').text(this.pages - i);
      }

      this.$lis.eq(7 - this.pages + index).addClass('active');
    } else {
      this.$lis.eq(1).find('a').text('1');
      this.$lis.eq(2).data('index', index - 2).find('a').text('...');
      this.$lis.eq(3).find('a').text(index - 1);
      this.$lis.eq(4).addClass('active').find('a').text(index);
      this.$lis.eq(5).find('a').text(index + 1);
      this.$lis.eq(6).data('index', index + 2).find('a').text('...');
      this.$lis.eq(7).find('a').text(this.pages);
    }
  },

  previous: function() {
    this.goTo(this.pageIndex - 1);
  },

  next: function() {
    this.goTo(this.pageIndex + 1);
  },

  dispatchPageChange: function() {
    this.trigger('pagechange', this.pageIndex);
  }
});

plugin('pagination', Pagination);

module.exports = Pagination;