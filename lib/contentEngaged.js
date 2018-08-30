import window from "window"
import now from "lodash-es/now"
import listen from "./helpers/listen"
import dataLayerPush from "./helpers/dataLayerPush"
import MeasurementFramework from "./MeasurementFramework"

const beforeunload = 'beforeunload'
const pulseSec = 3
let timeEngaged = 0
let idle = true
let idleTimer = null
let startEngage = now()
let absoluteStartEngage = now()

/*  Set the user as idle, and calculate the time
 they were non-idle */
let setIdle = function () {
    timeEngaged += now() - startEngage
    idle = true
}


/*  Reset the X second idle timer.
 If the user was idle, start the non-idle timer */
let pulse = function () {
    if (idle) {
        idle = false
        startEngage = now()
    }
    window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(setIdle, pulseSec * 1000)
}

let getTimeEngaged = function () {
    let thisTimeEngaged = timeEngaged + (now() - startEngage)
    if (idle) {
        thisTimeEngaged = timeEngaged
    }
    return thisTimeEngaged
}
let getTimeElapsed = function () {
    return now() - absoluteStartEngage
}

MeasurementFramework.register(function () {
    listen('click', pulse)
    listen('mousedown', pulse)
    listen('keydown', pulse)
    listen('scroll', pulse)
    listen('mousemove', pulse)
    listen('touchstart', pulse)
    listen('touchmove', pulse)
    listen('touchend', pulse)
    /**
     * Adding a before unload-function that can be used to measure real time on site.
     */
    listen(beforeunload, function () {
        dataLayerPush("Before Unload", {
            "timeEngaged": getTimeEngaged(),
            "timeElapsed": getTimeElapsed()
        })
    })
})


/**
 *
 * @param eventName
 * @param reportSecPre
 * @param callback
 */
function contentEngaged(eventName, reportSecPre, callback) {
    'use strict'
    const reportSec = reportSecPre || 15
    let reportTimer
    let pushedToDataLayer = false

    /* Push an event to dataLayer after X seconds unless the user is idle.
     Also, push an event when the user leaves the page */
    let report = function (e) {
        let thisTimeEngaged = getTimeEngaged()
        //console.log("checking contentEngaged at: " + eventName + " at " + thisTimeEngaged);
        let dataLayerObj = {
            'reportSecPre': reportSecPre,
            'timeEngaged': parseInt(thisTimeEngaged),
            'timeElapsed': getTimeElapsed()
        }
        // Push the payload to dataLayer, and only push valid time values
        if (!pushedToDataLayer && thisTimeEngaged > (reportSec * 1000) && thisTimeEngaged < 3600000) {
            callback(dataLayerObj)
            dataLayerPush(eventName,dataLayerObj)
            pushedToDataLayer = true
        } else {
            let nextReportCheck = (reportSec * 1000) - thisTimeEngaged
            if (idle && nextReportCheck < 500) {
                nextReportCheck = 500
            }
            // Putting the next timer as close at the reportTime as possible.
            window.clearTimeout(reportTimer)
            reportTimer = window.setTimeout(report, nextReportCheck)
        }

        // Fix possible beforeunload duplication problem
        // Sending the before unload event to the UI
        if (e && e.type === beforeunload) {
            window.removeEventListener(beforeunload, report)
        }
    }
    // Defining what events the script should listen to
    MeasurementFramework.register(function () {
        listen(beforeunload, report)
        reportTimer = window.setTimeout(report, reportSec * 1000)
        return {
            "contentEngagementLoaded": true
        }
    })
}

export default contentEngaged