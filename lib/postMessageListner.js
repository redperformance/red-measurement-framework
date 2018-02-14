import window from "window"
import listen from "./helpers/listen"
import dataLayerPush from "./helpers/dataLayerPush"
import isJson from "is-json"


function postMessageListner(postMessageCallback) {
    let status = {}
    /* browser capabilities check */
    if (!window.postMessage) {
        status.error = 'cannot run this browser, no postMessage'
        return status
    }
    if (!window.JSON || !window.JSON.stringify || !window.JSON.parse) {
        status.error = 'cannot run this browser, no JSON parsing/serialization'
        return status
    }
    let lastLoadedUrl = ""
    listen("message", function (event) {
        console.log(event)
        if (isJson(event.data)) {
            let message = JSON.parse(event.data)
            if (message.event === "iframe.load") {
                if (message.iframeUrl !== lastLoadedUrl) {
                    postMessageCallback(message)
                    dataLayerPush(message)
                }
                lastLoadedUrl = message.iframeUrl
            }
        } else {
            console.log("Invalid event.")
        }
    })
    return status
}

export default postMessageListner