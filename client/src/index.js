import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: new HttpLink(),
  cache: new InMemoryCache()
});


const psconfig = {
    key: 'root',
    storage,
}
const preducer = persistReducer(psconfig, reducer)

const store = createStore(preducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

let persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </PersistGate>
    </Provider>
    , document.getElementById('root'));

registerServiceWorker();
