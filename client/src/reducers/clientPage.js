
const client_page_no = (state={pageNo:0,pageLength:10}, action) => {
    switch (action.type) {
      case 'SET_CLIENT_PAGE_NO':
        return  Object.assign({}, state, {
          pageNo: action.page_no
        })
      case 'SET_CLIENT_PAGE_LENGTH':
        return  Object.assign({}, state, {
          pageLength: action.page_length
        })
      default:
        return state
    }
  }
  
  export default client_page_no;