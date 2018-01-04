import { combineReducers } from 'redux'

import location from './location';
import clientPage from './clientPage';

const pacosiApp = combineReducers({
    location, clientPage
})
  
export default pacosiApp