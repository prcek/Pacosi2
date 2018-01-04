
const setLocation = (location_id) => ({
    type: 'SET_LOCATION',
    location_id
})
const setClientPageNo = (page_no) => ({
    type: 'SET_CLIENT_PAGE_NO',
    page_no
})


export {
    setLocation,
    setClientPageNo
}