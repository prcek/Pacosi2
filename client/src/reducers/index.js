import { combineReducers } from 'redux'

import location from './location';
import clientPage from './clientPage';
import orderPage from './orderPage';

const pacosiApp = combineReducers({
    location, clientPage, orderPage
})
  
export default pacosiApp