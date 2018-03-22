import { combineReducers } from 'redux'

import location from './location';
import clientPage from './clientPage';
import orderPage from './orderPage';
import auth from './auth';
import clipboard from './clipboard';
import notify from './notify';

const pacosiApp = combineReducers({
    location, clientPage, orderPage,auth,clipboard,notify
})
  
export default pacosiApp