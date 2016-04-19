/**
 * Created by huangxinghui on 2016/1/20.
 */

var $ = require('jquery')
var Widget = require('../../widget')
var plugin = require('../../plugin')
var TreeNode = require('./treenode')

var Tree = Widget.extend({
  options: {
    'labelField': null,
    'labelFunction': null,
    'childrenField': 'children',
    'autoOpen': true
  },

  events: {
    'click li': '_onSelect',
    'click i': '_onExpand'
  },

  _create: function() {
    this.$element.addClass('tree')

    var that = this
    var $ul = $('<ul></ul>')
    this._loadFromDataSource()

    this.nodes.forEach(function(node) {
      that._createNode(node)
      $ul.append(node.element)
    })

    this.$element.append($ul)
  },

  _onSelect: function(e) {
    var $li = $(e.currentTarget),
      node = $li.data('node')

    e.preventDefault()
    if (!$li.hasClass('active')) {
      this._setSelectedNode(node)
      this._trigger('itemClick', node.data)
    }
  },

  _onExpand: function(e) {
    var $li = $(e.currentTarget).closest('li'),
      node = $li.data('node')

    e.preventDefault()
    if (node.isOpen) {
      this.collapseNode(node)
    }
    else {
      this.expandNode(node)
    }
  },

  _setSelectedNode: function(node) {
    var $active = this.$element.find('.active')
    $active.removeClass('active')

    var $li = node.element
    $li.addClass('active')
    this._trigger('change', node.data)
  },

  _createNode: function(node) {
    if (node.isBranch()) {
      this._createFolder(node)
    }
    else {
      this._createLeaf(node)
    }
  },

  _createLeaf: function(node) {
    var html = ['<li><a href="#"><span>']
    html.push(this._createIndentationHtml(node.getLevel()))
    html.push(this.itemToLabel(node.data))
    html.push('</span></a></li>')

    var $li = $(html.join(''))
    $li.data('node', node)
    node.element = $li
    return $li
  },

  _createFolder: function(node) {
    var that = this
    var html = []
    if (node.isOpen) {
      html.push('<li class="open"><a href="#"><span>')
      html.push(this._createIndentationHtml(node.getLevel() - 1))
      html.push('<i class="glyphicon glyphicon-minus-sign js-folder"></i>')
    }
    else {
      html.push('<li><a href="#"><span>')
      html.push(this._createIndentationHtml(node.getLevel() - 1))
      html.push('<i class="glyphicon glyphicon-plus-sign js-folder"></i>')
    }
    html.push(this.itemToLabel(node.data))
    html.push('</span></a></li>')

    var $li = $(html.join(''))
    var $ul = $('<ul class="children-list"></ul>')
    node.children.forEach(function(childNode) {
      that._createNode(childNode)
      $ul.append(childNode.element)
    })
    $li.append($ul)
    $li.data('node', node)
    node.element = $li
    return $li
  },

  _createLabel: function(node) {
    var html = ['<span>']
    var level = node.getLevel()
    if (node.isBranch()) {
      html.push(this._createIndentationHtml(level - 1))
      html.push('<i class="glyphicon ',
        node.isOpen ? 'glyphicon-minus-sign' : 'glyphicon-plus-sign',
        ' js-folder"></i>')
    }
    else {
      html.push(this._createIndentationHtml(level))
    }
    html.push(this.itemToLabel(node.data))
    html.push('</span>')
    return html.join('')
  },

  _createIndentationHtml: function(count) {
    var html = []
    for (var i = 0; i < count; i++) {
      html.push('<i class="glyphicon tree-indentation"></i>')
    }
    return html.join('')
  },

  _loadFromDataSource: function() {
    var node, children, nodes = [], that = this
    if (this.options.dataSource) {
      this.options.dataSource.forEach(function(item) {
        node = new TreeNode(item)
        children = item[that.options.childrenField]
        if (children) {
          node.isOpen = that.options.autoOpen
          that._loadFromArray(children, node)
        }
        nodes.push(node)
      })
    }
    this.nodes = nodes
  },

  _loadFromArray: function(array, parentNode) {
    var node, children, that = this
    array.forEach(function(item) {
      node = new TreeNode(item)
      parentNode.addChild(node)
      children = item[that.childrenField]
      if (children) {
        node.isOpen = that.autoOpen
        that._loadFromArray(children, node)
      }
    })
  },

  expandNode: function(node) {
    if (!node.isBranch()) {
      return
    }

    var $li = node.element
    var $disclosureIcon = $li.children('a').find('.js-folder')
    if (!node.isOpen) {
      node.isOpen = true
      $li.addClass('open')
      $disclosureIcon.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign')
      this._trigger('itemOpen')
    }
  },

  collapseNode: function(node) {
    if (!node.isBranch()) {
      return
    }

    var $li = node.element
    var $disclosureIcon = $li.children('a').find('.js-folder')
    if (node.isOpen) {
      node.isOpen = false
      $li.removeClass('open')
      $disclosureIcon.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign')
      this._trigger('itemClose')
    }
  },

  expandAll: function() {
    var that = this
    this.nodes.forEach(function(node) {
      that.expandNode(node)
    })
  },

  collapseAll: function() {
    var that = this
    this.nodes.forEach(function(node) {
      that.collapseNode(node)
    })
  },

  append: function(item, parentNode) {
    var $ul, $li, $prev, node = new TreeNode(item)

    if (parentNode.isBranch()) {
      parentNode.addChild(node)
      $ul = parentNode.element.children('ul')
      this._createNode(node)
      $li = node.element
      $ul.append($li)
    }
    else {
      parentNode.addChild(node)
      $li = parentNode.element
      $prev = $li.prev()
      $ul = $li.parent()

      parentNode.element = null
      $li.remove()
      $li = this._createFolder(parentNode)

      if ($prev.length) {
        $prev.after($li)
      }
      else {
        $ul.append($li)
      }
    }
    this.expandNode(parentNode)
    this._setSelectedNode(node)
  },

  remove: function(node) {
    var parentNode = node.parent
    node.element.remove()
    node.destroy()
    this._setSelectedNode(parentNode)
  },

  update: function(node) {
    var $li = node.element
    $li.children('a').html(this._createLabel(node))
  },

  getSelectedNode: function() {
    var $li = this.$element.find('.active')
    return $li.data('node')
  },

  getSelectedItem: function() {
    var node = this.getSelectedNode()
    return node.data
  },

  itemToLabel: function(data) {
    if (!data) {
      return ''
    }

    if (this.options.labelFunction != null) {
      return this.options.labelFunction(data)
    }
    else if (this.options.labelField != null) {
      return data[this.options.labelField]
    }
    else {
      return data
    }
  }
})

plugin('tree', Tree)
