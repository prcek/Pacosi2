
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
const setClientFilter = (filter) => ({
    type: 'SET_CLIENT_FILTER',
    filter
})
const setOrderPageNo = (page_no) => ({
    type: 'SET_ORDER_PAGE_NO',
    page_no
})
const setOrderPageLength = (page_length) => ({
    type: 'SET_ORDER_PAGE_LENGTH',
    page_length
})
const setOrderFilter = (filter) => ({
    type: 'SET_ORDER_FILTER',
    filter
})

const setAuth = (auth_token,auth_user) => ({
    type: 'SET_AUTH',
    auth_token, auth_user
})

const clearAuth = () => ({
    type: 'SET_AUTH_CLEAR'
    
})

export {
    setLocation,
    setClientPageNo,
    setClientPageLength,
    setClientFilter,
    setOrderPageNo,
    setOrderPageLength,
    setOrderFilter,
    setAuth,
    clearAuth
}