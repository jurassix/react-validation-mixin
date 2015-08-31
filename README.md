# react-validation-mixin
_Simple validation library for React._

This library simply wraps your React Component, transferring it props containing the boilerplate to validate a React form.

**react-validation-mixin** aims to provide a low-level toolkit for _React.Component_ validation, relying on existing validation libraries.

This library currently supports a single strategy _joi-validation-strategy_ but the community is urged to expand the available strategies. Each strategy is responsible for the data validation and error message responses. _A complete list of strategies will be maintained here for community reference._

Users of the library are required to install and include the mixin and a chosen strategy.

---

Simply define the validation schema using Joi validators, and the mixin will give you access to each fields validity and error messages.

## Install

Install mixin via npm:

    > npm install --save react-validation-mixin

---

## [Read the Documentation](http://jurassix.gitbooks.io/docs-react-validation-mixin/content/overview/index.html)

## [Steps for migrating from 4.x](http://jurassix.gitbooks.io/docs-react-validation-mixin/content/overview/migration-to-5.html)

### _Please contribute suggestions, features, issues, and pull requests._
