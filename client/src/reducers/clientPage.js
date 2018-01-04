
const client_page_no = (state=0, action) => {
    switch (action.type) {
      case 'SET_CLIENT_PAGE_NO':
        return action.page_no
      default:
        return state
    }
  }
  
  export default client_page_no;