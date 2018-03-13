import { combineReducers } from 'redux'

import location from './location';
import clientPage from './clientPage';
import orderPage from './orderPage';
import auth from './auth';
import clipboard from './clipboard';

const pacosiApp = combineReducers({
    location, clientPage, orderPage,auth,clipboard
})
  
export default pacosiApp