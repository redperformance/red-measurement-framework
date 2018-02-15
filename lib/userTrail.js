import Cookies from 'js-cookie'
import repeat from "lodash-es/repeat"
import gaCookieDomain from "./helpers/gaCookieDomain"
import forEach from "lodash-es/forEach"
import isUndefined from "lodash-es/isUndefined"
import isNull from "lodash-es/IsNull"
import isFunction from "lodash-es/isFunction"
import isString from "lodash-es/isString"
import isArray from "lodash-es/isArray"
import sendHitTask from "./sendHitTask"
import MeasurementFramework from "./MeasurementFramework"
import {charCodeToValue, valueToChar} from "./helpers/charCodeCounter"
import reverse from "lodash-es/reverse"


const cookieName = "rmf"
let frameworkEvents = []
let frameworkStages = []

export const loadCookieValue = function () {
    let val = Cookies.get(cookieName)
    if (isUndefined(val) || isNull(val)) {
        val = repeat("0", 64)
    }
    return val
}

export const getEventMatrix = function () {
    let cookieValue = loadCookieValue()
    let matrix = {}
    forEach(frameworkEvents, function (value, index) {
        let safeEventName = value.replace(/\s+/g, '')
        let charCode = cookieValue.charCodeAt(index)
        matrix[safeEventName] = charCodeToValue(charCode)
    })
    return matrix
}

export const getEventIndex = function (eventActionName) {
    return frameworkEvents.indexOf(eventActionName)
}

export const getEventCount = function (eventActionName) {
    let eventIndex = getEventIndex(eventActionName)
    if (eventIndex === -1) {
        return 0
    } else {
        let cookieValue = loadCookieValue()
        let charCode = cookieValue.charCodeAt(eventIndex)
        let eventCount = charCodeToValue(charCode)
        return eventCount || 0
    }
}

const eventExists = function (eventActionName) {
    return (getEventIndex(eventActionName) !== -1)
}

export const greater = function (action, than) {
    return getEventCount(action) > than
}

export const incrementEventValue = function (eventActionName) {
    if (eventExists(eventActionName)) {
        let eventCount = getEventCount(eventActionName)
        if (eventCount < 62) {
            /**
             * Increment and transform value
             */
            eventCount++
            console.log("Event Value Incremented:", eventActionName)
            let eventIndex = getEventIndex(eventActionName)
            let cookieSplitted = loadCookieValue().split("")
            cookieSplitted[eventIndex] = valueToChar(eventCount)
            let newCookieValue = cookieSplitted.join("")

            /**
             * Setting Cookie
             */
            console.log("Setting Cookie " + cookieName + ":", newCookieValue)
            Cookies.set(cookieName, newCookieValue, {
                expires: 365,
                domain: gaCookieDomain()
            })
        } else {
            console.log("Event Value reached max, doing nothing.", eventActionName)
        }
        return true
    }
}

const getUserFunnelStage = function () {
    let stage
    forEach(frameworkStages, function (stageFunc) {
        stage = stageFunc()
        if (isString(stage)) {
            return false
        }
    })
    return stage
}
/**
 * Function returning some defaults
 *
 * @param userTrailCallback
 * @returns {{cookieDomain, customTask: *, userTrail}}
 */
export default function userTrail(events, stages) {
    if (isArray(events)) {
        frameworkEvents = events
    } else {
        console.warn("userTrail require the event config to be an Array.")
        return false
    }
    if (isArray(stages)) {
        frameworkStages = reverse(stages)
    } else {
        console.warn("userTrail require the stages config variable to be an Array.")
        return false
    }
    if (!forEach(stages, isFunction)) {
        console.warn("Wrong in stage configuration")
        return false
    }
    /**
     * Register A standard callback on the custom event registered in the measurement framework
     */
    sendHitTask(function (model) {
        let dlObj = {}
        forEach(["eventAction", "eventCategory", "eventLabel", "eventValue"], function (value) {
            dlObj[value] = model.get(value)
        })
        dlObj.userFunnelStagePrevious = getUserFunnelStage()
        dlObj.isStandardEvent = incrementEventValue(model.get("eventAction"))
        dlObj.userTrail = getEventMatrix()
        dlObj.funnelStage = getUserFunnelStage()
        dlObj.funnelChangeLabel = dlObj.userFunnelStagePrevious + ' > ' + dlObj.funnelStage
        dlObj.funnelStageChanged = (eventExists(model.get("eventAction")) && dlObj.userFunnelStagePrevious !== dlObj.funnelStage)
        return dlObj
    })
    /**
     * Register some initial values
     */
    MeasurementFramework.register(function () {
        return {
            "cookieDomain": gaCookieDomain(),
            "userTrail": getEventMatrix(),
            "funnelStage": getUserFunnelStage(),
            "funnelStageChanged": false
        }
    })
}
