import { applyMiddleware, createStore } from 'redux';
//import { Provider } from 'react-redux';
import reducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
//import { PersistGate } from 'redux-persist/lib/integration/react';
import LogRocket from 'logrocket';


const redux_state_version = 4;
const psconfig = {
    key: 'root',
    storage,
    blacklist: ['notify'], 
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

const persistor = persistStore(store);


export {
    store,
    persistor
}