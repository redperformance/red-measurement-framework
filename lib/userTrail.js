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
let cookieValue

export const loadCookieValue = function () {
    cookieValue = Cookies.get(cookieName)
    if (isUndefined(cookieValue) || isNull(cookieValue)) {
        cookieValue = repeat("0", 64)
        setCookieValue(cookieValue)
    }
    return cookieValue
}

export const getEventMatrix = function () {
    cookieValue = loadCookieValue()
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
        cookieValue = loadCookieValue()
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
const setCookieValue = function (newCookieValue) {
    cookieValue = newCookieValue
    /**
     * Setting Cookie
     */
    console.log("Setting Cookie " + cookieName + ":", newCookieValue)
    Cookies.set(cookieName, newCookieValue, {
        expires: 365,
        domain: gaCookieDomain()
    })
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
            setCookieValue(newCookieValue)
        } else {
            console.log("Event Value reached max, doing nothing.", eventActionName)
            return false
        }
        return true
    } else {
        return false
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
 * Module that takes an array of events and an array of stage functions and
 * calculate the user funnel stage.
 *
 * @param events
 * @param stages
 * @returns {boolean}
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
        let previousFunnelStage = getUserFunnelStage()
        let dlObj = {}
        forEach(["eventAction", "eventCategory", "eventLabel", "eventValue"], function (value) {
            dlObj[value] = model.get(value)
        })
        dlObj.userFunnelStagePrevious = previousFunnelStage
        dlObj.isStandardEvent = (incrementEventValue(model.get("eventAction")))
        let newFunnelStage = getUserFunnelStage()
        dlObj.funnelChangeLabel = previousFunnelStage + ' > ' + newFunnelStage
        dlObj.funnelStageChanged = (dlObj.isStandardEvent && (previousFunnelStage !== newFunnelStage))
        dlObj.funnelStage = newFunnelStage
        return dlObj
    })
    /**
     * Register some initial values
     */
    MeasurementFramework.register(function () {
        return {
            "cookieDomain": gaCookieDomain,
            "userTrail": getEventMatrix,
            "funnelStage": getUserFunnelStage
        }
    })
}
