
const location = (state=null, action) => {
    switch (action.type) {
      case 'SET_LOCATION':
        return action.location_id
      default:
        return state
    }
  }
  
  export default location;