/**
 * Created by huangxinghui on 2015/8/10.
 */

var _ = require('underscore');
var rules = require('./rules');
var Tooltip = require('../tooltip');

var ValidatorField = function (element, options) {
    this.constraints = [];
    this.options = options;
    this.$element = element;
    this.validateEnabled = true;
    this._bindConstraints();
};

ValidatorField.prototype = {
    enabled: function () {
        this.validateEnabled = true;
    },

    disabled: function () {
        this.validateEnabled = false;
    },

    getValue: function () {
        var value;

        // Value could be overriden in DOM or with explicit options
        if ('function' === typeof this.options.value)
            value = this.options.value(this);
        else if ('undefined' !== typeof this.options.value)
            value = this.options.value;
        else
            value = this.$element.val();

        // Handle wrong DOM or configurations
        if ('undefined' === typeof value || null === value)
            return '';

        return value;
    },

    validate: function () {
        if (this.validateEnabled) return;

        this.value = this.getValue();
        this.isValid(this.value);

        if (this.validationResult) {
            this.$element.addClass('has-error');
            this.tooltip = new Tooltip(this.$element, {
                title: this.validationResult
            });
            this.tooltip.show();
        } else {
            this.tooltip.hide();
        }

        return this.validationResult;
    },

    isValid: function (value) {
        var that = this,
            valid = true;

        this.validationResult = '';

        if (!this.hasConstraints())
            return true;

        if ('undefined' === typeof value || null === value)
            value = this.getValue();

        $.each(this.constraints, function (index, constraint) {
            var result = constraint.rule.validate.apply(null, [value].concat(constraint.options));

            if (!result) {
                that.validationResult = rules.getMessage(constraint.name);
                valid = false;
                return false;
            }
        });

        return valid;
    },

    hasConstraints: function () {
        return 0 !== this.constraints.length;
    },

    _bindConstraints: function () {
        for (var name in this.options.rules)
            this.addConstraint(name, this.options.rules[name]);

        return this._bindHtml5Constraints();
    },

    _bindEvents: function () {
        var trigger = this.options.trigger;
    },

    addConstraint: function (name) {
        var args = Array.prototype.slice.call(arguments, 1),
            rule = rules.getRule(name);

        this.constraints.push({
            name: name,
            options: args,
            rule: rule
        });

        return this;
    },

    _bindHtml5Constraints: function () {
        // html5 required
        if (this.$element.attr('required'))
            this.addConstraint('required');

        // html5 pattern
        if ('string' === typeof this.$element.attr('pattern'))
            this.addConstraint('pattern', this.$element.attr('pattern'));

        // range
        if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max'))
            this.addConstraint('number', {min: this.$element.attr('min'), max: this.$element.attr('max')});

        // HTML5 min
        else if ('undefined' !== typeof this.$element.attr('min'))
            this.addConstraint('number', {min: this.$element.attr('min')});

        // HTML5 max
        else if ('undefined' !== typeof this.$element.attr('max'))
            this.addConstraint('number', {max: this.$element.attr('max')});

        // length
        if ('undefined' !== typeof this.$element.attr('minlength') && 'undefined' !== typeof this.$element.attr('maxlength'))
            this.addConstraint('length', this.$element.attr('minlength'), this.$element.attr('maxlength'));

        // HTML5 minlength
        else if ('undefined' !== typeof this.$element.attr('minlength'))
            this.addConstraint('length', this.$element.attr('minlength'));

        // HTML5 maxlength
        else if ('undefined' !== typeof this.$element.attr('maxlength'))
            this.addConstraint('length', this.$element.attr('maxlength'));


        // html5 types
        var type = this.$element.attr('type');

        if ('undefined' === typeof type)
            return this;

        // Small special case here for HTML5 number: integer validator if step attribute is undefined or an integer value, number otherwise
        if ('number' === type) {
            if (('undefined' === typeof this.$element.attr('step')) || (0 === parseFloat(this.$element.attr('step')) % 1)) {
                return this.addConstraint('number', 'integer', undefined, true);
            } else {
                return this.addConstraint('number', 'number', undefined, true);
            }
            // Regular other HTML5 supported types
        } else if (/^(email|url|range)$/i.test(type)) {
            return this.addConstraint(type);
        }
        return this;
    }
};

module.exports = ValidatorField;