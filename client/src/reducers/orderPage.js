
const order_page = (state={pageNo:0,pageLength:10,filter:null}, action) => {
    switch (action.type) {
      case 'SET_ORDER_PAGE_NO':
        return  Object.assign({}, state, {
          pageNo: action.page_no
        })
      case 'SET_ORDER_PAGE_LENGTH':
        return  Object.assign({}, state, {
          pageLength: action.page_length
        })
      case 'SET_ORDER_FILTER':
        return  Object.assign({}, state, {
          filter: action.filter
        })
      default:
        return state
    }
  }
  
  export default order_page;