
const setLocation = (location_id) => ({
    type: 'SET_LOCATION',
    location_id
})
const setClientPageNo = (page_no) => ({
    type: 'SET_CLIENT_PAGE_NO',
    page_no
})
const setClientPageLength = (page_length) => ({
    type: 'SET_CLIENT_PAGE_LENGTH',
    page_length
})
const setOrderPageNo = (page_no) => ({
    type: 'SET_ORDER_PAGE_NO',
    page_no
})
const setOrderPageLength = (page_length) => ({
    type: 'SET_ORDER_PAGE_LENGTH',
    page_length
})


export {
    setLocation,
    setClientPageNo,
    setClientPageLength,
    setOrderPageNo,
    setOrderPageLength,
}