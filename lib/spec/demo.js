'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _node_modulesReactValidationMixinLibSpecComponentsSignup = require('../node_modules/react-validation-mixin/lib/spec/components/Signup');

var _node_modulesReactValidationMixinLibSpecComponentsSignup2 = _interopRequireDefault(_node_modulesReactValidationMixinLibSpecComponentsSignup);

var _reactValidationMixin = require('react-validation-mixin');

var _reactValidationMixin2 = _interopRequireDefault(_reactValidationMixin);

var _joiValidationStrategy = require('joi-validation-strategy');

var _joiValidationStrategy2 = _interopRequireDefault(_joiValidationStrategy);

var Signup = _reactValidationMixin2['default'](_joiValidationStrategy2['default'])(_node_modulesReactValidationMixinLibSpecComponentsSignup2['default']);

_reactDom.render(_react2['default'].createElement(Signup, null), document.getElementById('app'));