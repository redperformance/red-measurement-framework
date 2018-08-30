import document from "document"
import isFunction from "lodash-es/isFunction"
import MeasurementFramework from "./MeasurementFramework"

/**
 * Module let you run code at DOM Ready with a callback function.
 *
 * @param callback
 * @returns {{domReadyLoaded: boolean}}
 */
const domReady = function (callback) {
    if (isFunction(callback)) {
        MeasurementFramework.register(function () {
            let readyState = document.readyState
            if (readyState === "complete" || readyState === "loaded" || readyState === "interactive") {
                return callback()
            } else if (isFunction(document.attachEvent)) {
                document.attachEvent("onreadystatechange", function () {
                    if (readyState === "complete") {
                        return callback()
                    }
                })
            } else {
                document.addEventListener("DOMContentLoaded", callback)
            }
            return {
                "domReadyLoaded": true
            }
        })
    } else {
        console.warn("Measurement Framework DOM Ready callback must be a function.")
    }
}

export default domReady