import { combineReducers } from 'redux'

import location from './location';
import clientPage from './clientPage';
import orderPage from './orderPage';
import auth from './auth';

const pacosiApp = combineReducers({
    location, clientPage, orderPage,auth
})
  
export default pacosiApp