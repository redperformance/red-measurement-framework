/**
 * Created by RED Performance.
 */
import window from "window"

// utility to check if we currently are in an iframe
function inIframe() {
    try {
        return window.self !== window.top
    } catch (e) {
        return true
    }
}

export default inIframe