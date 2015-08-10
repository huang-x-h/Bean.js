/**
 * Created by huangxinghui on 2015/8/10.
 */

var Bean = require('./core');
var callbacks = [];

Bean.locale = {
    value: {
        validator: {
            requiredError: 'Please input the {0}.',
            emailError: 'The email address is invalid. Please input again.',
            equalError: 'The {0} should be equal to the {1}. Please input again.',
            greaterEqualError: 'The {0} should be greater than or equal to the {1}. Please input again.',
            greaterError: 'The {0} should be greater than the {1}. Please input again.',
            lessEqualError: 'The {0} should be less than or equal to the {1}. Please input again.',
            lessError: 'The {0} should be less than the {1}. Please input again.',
            notEqualError: 'The {0} can not be equal to the {1}. Please input again.',
            tooLongError: 'The length of {0} is greater than the maximum length of {2} character(s). Please input again.',
            tooShortError: 'The length of {0} is less than the minimum length of {1} character(s). Please input again.',
            notBetweenError: 'The length of {0} should be between {1} character(s) and {2} character(s). Please input again.'
        }
    },

    publish: function () {
        callbacks.forEach(function (callback) {
            callback(this.value);
        });
    },

    subscribe: function (fn) {
        callbacks.push(fn);
    }
};