
const auth = (state={token:null,user:null}, action) => {
    switch (action.type) {
      case 'SET_AUTH':
        console.log("SET_AUTH",action)
        return  Object.assign({}, state, {
          token: action.auth_token,
          user: action.auth_user
        })
        case 'SET_AUTH_CLEAR':
        return  Object.assign({}, state, {
          user: null,
          token: null
        })
        default:
        return state
    }
  }
  
  export default auth;