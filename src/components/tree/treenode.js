/**
 * Created by huangxinghui on 2016/1/20.
 */

var TreeNode = function(data) {
  this.data = data;
  this.parent = null;
  this.isOpen = false;
};

TreeNode.prototype = {
  addChild: function(node) {
    node.parent = this;

    if (!this.children) {
      this.children = [];
    }
    this.children.push(node);
  },

  removeChild: function(node) {
    node.parent = null;
    this.children.splice(this.getChildIndex(node), 1);
  },

  getChildIndex: function(node) {
    return this.children.indexOf(node);
  },

  hasChildren: function() {
    return this.children.length !== 0;
  },

  isBranch: function() {
    return !!this.children;
  },

  getPreviousSibling: function() {
    var previousIndex;
    if (!this.parent) {
      return null;
    }

    previousIndex = this.parent.getChildIndex(this) - 1;
    if (previousIndex >= 0) {
      return this.parent.children[previousIndex];
    }
    return null;
  },

  getNextSibling: function() {
    var nextIndex;
    if (!this.parent) {
      return null;
    }

    nextIndex = this.parent.getChildIndex(this) + 1;
    if (nextIndex < this.parent.children.length) {
      return this.parent.children[nextIndex];
    }
    return null;
  },

  getLevel: function() {
    var level = 1;
    var parent = this.parent;
    while(parent) {
      level++;
      parent = parent.parent;
    }
    return level;
  },

  destroy: function() {
    this.parent = null;
  }
};

module.exports = TreeNode;
