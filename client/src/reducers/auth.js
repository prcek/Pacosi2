
const auth = (state={token:""}, action) => {
    switch (action.type) {
      case 'SET_AUTH_TOKEN':
        return  Object.assign({}, state, {
          token: action.auth_token
        })
      default:
        return state
    }
  }
  
  export default auth;