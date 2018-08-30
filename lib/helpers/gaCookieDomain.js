import window from "window"
import isFunction from "lodash-es/isFunction"
import gaHostname from "./gaHostname"

const gaCookieDomain = function () {
    let cookieDomain = gaHostname()
    if (isFunction(window.ga) && isFunction(window.ga.getAll)) {
        cookieDomain = window.ga.getAll()[0].get("cookieDomain")
    }
    return cookieDomain
}

export default gaCookieDomain