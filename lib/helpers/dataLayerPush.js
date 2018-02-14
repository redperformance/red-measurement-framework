import window from "window"
import isString from "lodash-es/isString"
import isObject from "lodash-es/isObject"
import {version} from "../../package.json"

/**
 *
 * Utility function to push to the dataLayer.
 *
 * @param eventObj
 * @param eventName
 */
function dataLayerPush(eventObj, eventName) {
    let dataLayerName = 'dataLayer'
    if (!isObject(eventObj)) {
        eventObj = {}
    }
    if (isString(eventName)) {
        eventObj.event = eventName
    }
    eventObj.rmf = {
        "version": version,
        "buildtime": "RMFBUILDTIME"
    }
    window[dataLayerName] = window[dataLayerName] || []
    window[dataLayerName].push(eventObj)
    console.log(eventObj)
}

export default dataLayerPush