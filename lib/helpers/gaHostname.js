import document from "document"

/**
 * Get hostname from location.
 *
 * @return {string}
 */
const gaHostname = function () {
    let hostname = '' + document.location.hostname
    return (0 === hostname.indexOf('www.') ? hostname.substring(4) : hostname)
}

export default gaHostname