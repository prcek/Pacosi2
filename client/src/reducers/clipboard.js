import Moment from 'moment';

function def_expire(exp) {
  if (exp) { 
    return Moment(exp).toISOString();
  } else {
    return Moment().add(1,"minutes").toISOString();
  }
}

const clipboard = (state={massage_order:null,lesson_member:null,massage_expire:null,lesson_expire:null}, action) => {
    switch (action.type) {
      case 'SET_CLIPBOARD_MASSAGE_ORDER':
        console.log("SET_CLIPBOARD_MASSAGE_ORDER",action)
        return  Object.assign({}, state, {
          massage_order: action.massage_order,
          massage_expire: def_expire(action.expire)
        })
      case 'CLEAR_CLIPBOARD_MASSAGE_ORDER':
        console.log("CLEAR_CLIPBOARD_MASSAGE_ORDER");
        return  Object.assign({}, state, {
          massage_order: null,
          massage_expire: null
        })
      case 'SET_CLIPBOARD_LESSON_MEMBER':
        console.log("SET_CLIPBOARD_LESSON_MEMBER",action)
        return  Object.assign({}, state, {
          lesson_member: action.lesson_member,
          lesson_expire: def_expire(action.expire)
        })
      case 'CLEAR_CLIPBOARD_LESSON_MEMBER':
        console.log("CLEAR_CLIPBOARD_LESSON_MEMBER");
        return  Object.assign({}, state, {
          lesson_member: null,
          lesson_expire: null
        })

      default:
        return state
    }
  }
  
  export default clipboard;