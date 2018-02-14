import document from "document"
import isFunction from "lodash-es/isFunction"
import MeasurementFramework from "./MeasurementFramework"

const domReady = function (callback) {
    if (isFunction(callback)) {
        MeasurementFramework.register(function (callback) {
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
        })
        return {
            "rmf": {
                "domReady": true
            }
        }
    } else {
        console.warn("Measurement Framework function failed, must be a function.")
    }
}

export default domReady