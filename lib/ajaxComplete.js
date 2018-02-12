import window from "window";
import document from "document";
import objMap from "./helpers/objMap";
import dataLayerPush from "./helpers/dataLayerPush";
import forEach from "lodash-es/forEach";
import isUndefined from "lodash-es/isUndefined";
import indexOf from "lodash-es/indexOf";
import MeasurementFramework from "./MeasurementFramework";
/**
 *
 * @param ajaxCompleteCallback
 */
function ajaxComplete(ajaxCompleteCallback) {
    'use strict';
    let jquery;
    let n = 0;
    let allParams = [];
    MeasurementFramework.register(function(){
        // Ensure jQuery is available before anything
        if (typeof window.jQuery !== 'undefined') {
            // Define our $ shortcut locally
            jquery = window.jQuery;
            bindToAjax();
            // Check for up to 10 seconds
        } else if (n < 20) {
            n++;
            setTimeout(init, 500);
        }
    });

    function noop() {
    }

    function bindToAjax() {
        jquery(document).bind('ajaxComplete', function (evt, jqXhr, opts) {
            // Create a fake a element for magically simple URL parsing
            let fullUrl = document.createElement('a');
            fullUrl.href = opts.url;
            // Manually remove the leading question mark, if there is one
            let queryString = fullUrl.search[0] === '?' ? fullUrl.search.slice(1) : fullUrl.search;
            let qs = [];
            if (queryString) {
                qs.push(queryString);
            }
            if (opts.data) {
                qs.push(opts.data);
            }
            // Turn our params and headers into objects for easier reference
            let queryParameters = objMap(qs.join('&'), '&', '=', true);

            forEach(queryParameters, function (val, key) {
                if (indexOf(allParams, key) === -1) {
                    allParams.push(key);
                }
            });
            forEach(allParams, function (value) {
                if (isUndefined(queryParameters[value])) {
                    queryParameters[value] = noop();
                }
            });
            let headers = objMap(jqXhr.getAllResponseHeaders(), '\n', ':');

            let dlPush = {
                'ajax': {
                    // Return empty strings to prevent accidental inheritance of old data
                    'type': opts.type || noop(),
                    'url': fullUrl.href || noop(),
                    'query': queryParameters,
                    'statusCode': jqXhr.status || noop(),
                    'statusText': jqXhr.statusText || noop(),
                    'headers': headers,
                    'timestamp': evt.timeStamp || noop(),
                    'contentType': opts.contentType || noop(),
                    'response': jqXhr.responseJSON || noop(),
                }
            };
            ajaxCompleteCallback(dlPush);
            dataLayerPush(dlPush, 'ajaxComplete');
        });

    }

}
export default ajaxComplete;