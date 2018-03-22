

import Moment from 'moment';

function def_expire(exp) {
  if (exp) { 
    return Moment(exp).toISOString();
  } else {
    return Moment().add(10,"seconds").toISOString();
  }
}


const notify = (state={error:null,info:null,error_expire:null,info_expire:null}, action) => {
    switch (action.type) {
      case 'SET_ERROR_MESSAGE':
        console.log("SET_ERROR_MESSAGE",action)
        return  Object.assign({}, state, {
          error: action.message,
          error_expire: def_expire(action.expire)
        })
      case 'CLEAR_ERROR_MESSAGE':
        console.log("CLEAR_ERROR_MESSAGE",action)
        return  Object.assign({}, state, {
          error: null,
          error_expire: null
        })
      case 'SET_INFO_MESSAGE':
        console.log("SET_INFO_MESSAGE",action)
        return  Object.assign({}, state, {
          info: action.message,
          info_expire: def_expire(action.expire)
        })
      case 'CLEAR_INFO_MESSAGE':
        console.log("CLEAR_INFO_MESSAGE",action)
        return  Object.assign({}, state, {
          info: null,
          info_expire: null
        })
      default:
        return state
    }
  }
  
  export default notify;