import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Raven from 'raven-js';

import LogRocket from 'logrocket';
LogRocket.init('evmn92/pacosi');

/*
Raven.setDataCallback(function (data) {
    data.extra.sessionURL = LogRocket.sessionURL;
    return data;
});

Raven.config('https://168a490cc82a405caf610da4cd224ea5@sentry.io/280940').install();
*/



const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: new HttpLink({credentials: 'same-origin'}),
  cache: new InMemoryCache()
});

const redux_state_version = 4;
const psconfig = {
    key: 'root',
    storage,
    version:redux_state_version,
    migrate: (state) => {
        if (state===undefined) return Promise.resolve({});
        if ((state._persist) && (state._persist.version<redux_state_version)) {
            console.log("redux state reset");
            return Promise.resolve({})
        } else {
            return Promise.resolve(state)
        }
    }
}
const preducer = persistReducer(psconfig, reducer)

const store = createStore(preducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware( LogRocket.reduxMiddleware()),
);

let persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ApolloProvider>
        </PersistGate>
    </Provider>
    , document.getElementById('root'));

registerServiceWorker();
