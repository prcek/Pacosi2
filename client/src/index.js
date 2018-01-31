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


import LogRocket from 'logrocket';
LogRocket.init('evmn92/pacosi');


const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: new HttpLink(),
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
