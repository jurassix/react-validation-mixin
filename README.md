# react-validation-mixin
_Simple validation library for React._

This library simply wraps your React Component, transferring it props containing the boilerplate to validate a React form.

**react-validation-mixin** aims to provide a low-level toolkit for _React.Component_ validation, relying on existing validation libraries.

This library currently supports a single strategy [joi-validation-strategy](https://github.com/jurassix/joi-validation-strategy) but the community is urged to expand the available strategies. Each strategy is responsible for the data validation and error message responses. _A complete list of strategies will be maintained here for community reference._

Users of the library are required to install and include the mixin and a chosen strategy.

---

### [View the Demo](http://jurassix.github.io/react-validation-mixin/)

### [Read the Documentation](http://jurassix.gitbooks.io/docs-react-validation-mixin/content/overview/index.html)

### [Steps for migrating from 4.x](http://jurassix.gitbooks.io/docs-react-validation-mixin/content/overview/migration-to-5.html)

---

### Install

Install **mixin** via npm:

```javascript
> npm install --save react-validation-mixin
```

Install **validation strategy** via npm:

```javascript
> npm install --save joi-validation-strategy
```

Make sure you install the peer dependency [Joi](https://github.com/hapijs/joi) if using the _joi-validation-strategy_:

```javascript
> npm install --save joi
```

*See [Joi](https://github.com/hapijs/joi) for a full list of api validation strategies available.*

---

### _Please contribute suggestions, features, issues, and pull requests._
