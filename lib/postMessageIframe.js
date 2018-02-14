import postMessageSend from "./postMessageSend"
import attrib from "./helpers/attrib"
import listen from "./helpers/listen"

function postMessageIframe(postMessageCallback) {
    listen("click", function (event) {
        let element = event.target || event.srcElement || {}
        let dlObj = {
            "event": "gtm.click",
            "gtm.elementClasses": element.className,
            "gtm.elementId": element["for"] || attrib(element, "id") || "",
            "gtm.elementTarget": element.formTarget || element.target || "",
            "gtm.elementUrl": (element.attributes && element.attributes.formaction ? element.formAction : "") || element.action || element.href || element.src || element.code || element.codebase || ""
        }
        postMessageCallback(dlObj)
        postMessageSend(dlObj)
        console.log(dlObj)
    })
    console.log("loaded")
}

export default postMessageIframe