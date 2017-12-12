"use strict"

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import reducers from './reducers/terminalReducer';


// STEP 1 create the store
const middleware = applyMiddleware(logger);
const store = createStore(reducers, middleware);


import Terminal from './components/pages/terminal';

render (
    (<Provider store={store}>
        <Terminal />
    </Provider>), document.getElementById('app')
);
