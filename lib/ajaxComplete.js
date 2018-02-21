import window from "window"
import document from "document"
import objMap from "./helpers/objMap"
import dataLayerPush from "./helpers/dataLayerPush"
import forEach from "lodash-es/forEach"
import isUndefined from "lodash-es/isUndefined"
import indexOf from "lodash-es/indexOf"
import MeasurementFramework from "./MeasurementFramework"
import merge from "lodash-es/merge"

let actionCount = {}

const createActionIdentifier = function (query, actionIds) {
    let ident = []
    forEach(actionIds, function (actionId) {
        if (!isUndefined(query[actionId])) {
            ident.push(query[actionId])
        }
    })
    return ident.join(".")
}

/**
 *
 * @param ajaxCompleteCallback
 * @param actionIds
 */
const ajaxComplete = function (ajaxCompleteCallback, actionIds) {
    'use strict'
    let jquery
    let n = 0
    let allParams = []

    /**
     * This code would benefit from being run with the domReady module.
     */
    const init = function () {
        // Ensure jQuery is available before anything
        if (typeof window.jQuery !== 'undefined') {
            // Define our $ shortcut locally
            jquery = window.jQuery
            bindToAjax()
            // Check for up to 10 seconds
        } else if (n < 20) {
            n++
            setTimeout(init, 500)
        }
    }

    MeasurementFramework.register(function () {
        init()
        return {
            "ajaxCompleteLoaded": true
        }
    })

    function noop() {}

    function bindToAjax() {
        jquery(document).bind('ajaxComplete', function (evt, jqXhr, opts) {
            // Create a fake a element for magically simple URL parsing
            let fullUrl = document.createElement('a')
            fullUrl.href = opts.url
            // Manually remove the leading question mark, if there is one
            let queryString = fullUrl.search[0] === '?' ? fullUrl.search.slice(1) : fullUrl.search
            let qs = []
            if (queryString) {
                qs.push(queryString)
            }
            if (opts.data) {
                qs.push(opts.data)
            }

            // Turn our params and headers into objects for easier reference
            let queryParameters = objMap(qs.join('&'), '&', '=', true)

            forEach(queryParameters, function (val, key) {
                if (indexOf(allParams, key) === -1) {
                    allParams.push(key)
                }
            })
            forEach(allParams, function (value) {
                if (isUndefined(queryParameters[value])) {
                    queryParameters[value] = noop()
                }
            })


            /**
             * Request Object
             */
            let request = {
                // Return empty strings to prevent accidental inheritance of old data
                'type': opts.type || noop(),
                'url': fullUrl.href || noop(),
                'query': queryParameters,
                'contentType': opts.contentType || noop()
            }
            if (isUndefined(request.query)) {
                request.query = {}
            }

            /**
             * Creating and counting ajax Action
             */
            request.actionId = createActionIdentifier(request.query, actionIds)
            if (actionCount[request.actionId]) {
                actionCount[request.actionId]++
            } else {
                actionCount[request.actionId] = 1
            }
            request.actionCount = actionCount[request.actionId]


            /**
             * Response Object
             */
            let headers = objMap(jqXhr.getAllResponseHeaders(), '\n', ':')
            let response = {
                // Return empty strings to prevent accidental inheritance of old data
                'statusCode': jqXhr.status || noop(),
                'statusText': jqXhr.statusText || noop(),
                'headers': headers,
                'timestamp': evt.timeStamp || noop(),
                'body': jqXhr.responseJSON || noop()
            }
            if (isUndefined(response.body)) {
                response.body = {}
            }

            let dlPush = {
                'ajax': merge(request, response)
            }

            let result = ajaxCompleteCallback(request, response)
            dlPush = merge(result, dlPush)
            dataLayerPush('Ajax Complete',dlPush)
        })

    }

}

export default ajaxComplete