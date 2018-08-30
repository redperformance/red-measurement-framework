import window from "window"
import isString from "lodash-es/isString"
import isObject from "lodash-es/isObject"
import isFunction from "lodash-es/isFunction"
import {version} from "../../package.json"
import MeasurementFramework from "../MeasurementFramework"
import forEach from "lodash-es/forEach"

/**
 *
 * Utility function to push to the dataLayer.
 *
 * @param data
 * @param eventName
 */
function dataLayerPush(eventName, data) {
    let dataLayerName = 'dataLayer'
    if (!isObject(data)) {
        data = {}
    }
    if (isString(eventName)) {
        data.event = eventName
    }
    data._mf = {
        "version": version,
        "buildtime": "RMFBUILDTIME"
    }
    forEach(MeasurementFramework.vars, function (value, key) {
        if (isFunction(value)) {
            data[key] = value()
        } else {
            data[key] = value
        }
    })
    window[dataLayerName] = window[dataLayerName] || []
    window[dataLayerName].push(data)
    console.log(data)
}

export default dataLayerPush