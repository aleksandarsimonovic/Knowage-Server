export default {
    logout() {
        let url = new URL(window.location.origin)
        window.location.href = url + 'knowage/servlet/AdapterHTTP?ACTION_NAME=LOGOUT_ACTION&LIGHT_NAVIGATOR_DISABLED=TRUE&NEW_SESSION=TRUE'
    }
}
