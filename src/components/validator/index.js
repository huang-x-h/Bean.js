/**
 * Created by huangxinghui on 2015/7/17.
 */

var $ = require('jquery');
var _ = require('underscore');
var Widget = require('../../widget');
var plugin = require('../../plugin');
var ValidatorField = require('./filed');

var Validator = Widget.extend({
    options: {
        messages: {},
        fields: [],
        errorContainer: null,
        errorClass: ''
    },

    _create: function () {
        this.fields = {};
        this._parseFields();
    },

    isValid: function () {
        var result = true;

        $.each(this.fields, function (name, validator) {
            var valid = validator.isValid();
            if (!valid) result = false;
            return valid;
        });

        return result;
    },

    validate: function () {
        var that = this;
        this.validationResult = [];

        _.each(this.fields, function (validator, name) {
            var validationResult = validator.validate();
            that.validationResult.push({
                name: name,
                validationResult: validationResult
            });
        });

        return this.validationResult;
    },

    reset: function () {

    },

    disabled: function (field) {
        if (field) {

        }
    },

    enabled: function (field) {

    },

    _parseFields: function () {
        var that = this;
        _.each(this.options.fields, function (field) {
            that._addFiled(field);
        });
    },

    _addFiled: function (field) {
        var name = field.name,
            $element = this.$element.find(name);

        this.fields[name] = new ValidatorField($element, field);
    }
});

plugin('validator', Validator);