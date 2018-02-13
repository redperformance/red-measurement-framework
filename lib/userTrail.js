import setCookie from "@firstandthird/cookie-monster/lib/set";
import getCookie from "@firstandthird/cookie-monster/lib/get";
import repeat from "lodash-es/repeat";
import gaCookieDomain from "./helpers/gaCookieDomain";
import forEach from "lodash-es/forEach";
import isUndefined from "lodash-es/isUndefined";
import isNull from "lodash-es/IsNull";
import isString from "lodash-es/isString";
import isFunction from "lodash-es/isFunction";
import isArray from "lodash-es/isArray";


import sendHitTask from "./sendHitTask";
import MeasurementFramework from "./MeasurementFramework";


const cookieName = "rmf";
let frameworkEvents = [];
let frameworkStages = [];
export const rmfCookieIsUndefined = function () {
    let val = getCookie(cookieName);
    return (isUndefined(val) || isNull(val));
};

export const loadCookieValue = function () {
    let val = getCookie(cookieName);
    if (isUndefined(val) || isNull(val)) {
        val = repeat("0", 64);
    }
    return val;
};

export const getEventMatrix = function () {
    let cookieValue = loadCookieValue();
    let matrix = {};
    forEach(frameworkEvents, function (value, key) {
        let safeEventName = value.replace(/\s+/g, '');
        matrix[safeEventName] = parseInt(cookieValue[key]);
    });
    return matrix;
};

export const getEventIndex = function (eventActionName) {
    return frameworkEvents.indexOf(eventActionName);
};

export const getEventValue = function (eventActionName) {
    let eventIndex = getEventIndex(eventActionName);
    if (eventIndex === -1) {
        return 0;
    } else {
        let cookieValue = loadCookieValue();
        let cookieSplitted = cookieValue.split("");
        return cookieSplitted[eventIndex] || 0;
    }
};
export const greater = function (action, than) {
    return getEventValue(action) > than;
};

export const incrementEventValue = function (eventActionName) {
    let eventIndex = getEventIndex(eventActionName);
    if (eventIndex === -1) {
        return false;
    } else {
        let cookieValue = loadCookieValue();
        let cookieSplitted = cookieValue.split("");
        if (cookieSplitted[eventIndex] < 9) {
            cookieSplitted[eventIndex]++;
            console.log("Event Value Incremented:", eventActionName);
        } else {
            console.log("Event Value reached max:", eventActionName);
        }
        cookieValue = cookieSplitted.join("");
        console.log("Setting Cookie " + cookieName + ":", cookieValue);
        setCookie(cookieName, cookieValue, 365, '/', gaCookieDomain());
        return true;
    }
};

const validateStage = function (stage) {
    return isString(stage.name) && isFunction(stage.func);
};

/**
 * Function returning some defaults
 *
 * @param userTrailCallback
 * @returns {{cookieDomain, customTask: *, userTrail}}
 */
export default function userTrail(events, stages) {
    if (isArray(events)) {
        frameworkEvents = events;
    } else {
        console.warn("userTrail require the event config to be an Array.");
        return false;
    }
    if (isArray(stages)) {
        frameworkStages = stages;

    } else {
        console.warn("userTrail require the stages config variable to be an Array.");
        return false;
    }
    if (!forEach(stages, validateStage)) {
        console.warn("Wrong in stage configuration");
        return false;
    }


    MeasurementFramework.register(function () {
        /**
         * Register A standard callback on the custom event registered in the measurement framework
         */
        sendHitTask(function (model) {
            let dlObj = {};
            forEach(["eventAction", "eventCategory", "eventLabel", "eventValue"], function (value) {
                dlObj[value] = model.get(value);
            });
            dlObj.isStandardEvent = incrementEventValue(model.get("eventAction"));
            dlObj.userTrail = getEventMatrix();
            return dlObj;
        });
        return {
            "cookieDomain": gaCookieDomain(),
            "userTrail": getEventMatrix()
        };
    });
}
