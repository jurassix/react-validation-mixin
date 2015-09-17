import React from 'react';
import {render} from 'react-dom';
import SignupComponent from '../node_modules/react-validation-mixin/lib/spec/components/Signup';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

const Signup = validation(strategy)(SignupComponent);

render(<Signup />, document.getElementById('app'));
