import window from "window"
import document from "document"
import inIframe from "./helpers/inIframe"

function postMessageSend(message) {
    /* check if we are in an iframe */
    if (inIframe()) {
        message.iframeUrl = window.location.href
        message.iframeTitle = document.title
        window.parent.postMessage(JSON.stringify(message), "*")
    } else {
        /* here we could send some warning */
    }
}

export default postMessageSend