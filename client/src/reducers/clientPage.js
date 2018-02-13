
const client_page = (state={pageNo:0,pageLength:10,filter:null}, action) => {
    switch (action.type) {
      case 'SET_CLIENT_PAGE_NO':
        return  Object.assign({}, state, {
          pageNo: action.page_no
        })
      case 'SET_CLIENT_PAGE_LENGTH':
        return  Object.assign({}, state, {
          pageLength: action.page_length
        })
      case 'SET_CLIENT_FILTER':
        return  Object.assign({}, state, {
          filter: action.filter
        })
      default:
        return state
    }
  }
  
  export default client_page;