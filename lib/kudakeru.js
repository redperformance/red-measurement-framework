import window from "window";
import document from "document";
import isString from "lodash-es/isString";
import now from "lodash-es/now";
import uniq from "lodash-es/uniq";
import setCookie from "@firstandthird/cookie-monster/lib/set";
import getCookie from "@firstandthird/cookie-monster/lib/get";
import jsonp from "jsonp-es6";
import random from "alphanumeric";
import dataLayerPush from "./helpers/dataLayerPush";
import gaLoaded from "./helpers/gaExists";
import fbqLoaded from "./helpers/fbqExists";
import forEach from "lodash-es/forEach";


function kudakeru(kudakeruCallback) {
    let cookieName = "kudakeru";
    let sessionTimeout = 10;

    // just an utility function to shorten the time calculation.
    let timestamp = function () {
        return Math.round(now() / 1000);
    };

    let getTrackingUrl = function () {
        if (window.__kudakeru_test) {
            return "/" + cookieName;
        } else {
            return "https://collect-dot-rpsleads.appspot.com/" + cookieName;
        }
    };

    // Wrapper for the cookie setMethod
    let upsertCookie = function (kid) {
        console.log("Upserting Cookie:", kid);
        setCookie(cookieName, kid + "." + timestamp(), 730, "/");
    };

    // Function that sends data back to the Katana service.
    let sendData = function (queryData) {
        console.log("Sending data to server:", queryData);
        jsonp(getTrackingUrl(), queryData).then(function (responseData) {
            console.log("Received data from server:", responseData);
            if (!responseData.kid) {
                console.log("Server is broken: ", trackingUrl);
                dataLayerPush({"error": responseData}, cookieName + "Error");
                return false;
            }
            // Only when the server is responsing a cookie is updated and written.
            upsertCookie(responseData.kid);
            kudakeruCallback(responseData);
            dataLayerPush(responseData, cookieName + "Loaded");
            if (responseData.fbel && window.fbq) {
                window.fbq("trackCustom", responseData.fbel);
            }
        }).catch(function (ex) {
            dataLayerPush({"error": ex}, "Error");
        });
    };
    setTimeout(function () {
        let queryData = {
            "tid": [],
            "cid": "",
            "fb": [],
            "ot": 0,
            "dl": document.location.hostname + document.location.pathname
        };

        // Checking if GA object exists and collect data from it.
        if (gaLoaded()) {
            forEach(window.ga.getAll(), function (tracker) {
                queryData.cid = tracker.get("clientId");
                queryData.tid.push(tracker.get("trackingId"));
            });
        }

        // Checking if FBQ exitsts
        if (fbqLoaded()) {
            forEach(window.fbq.getState().pixels, function (pixel) {
                queryData.fb.push(pixel.id);
            });
        }

        // Checking if the Cookie exists
        let oldCookie = getCookie(cookieName);
        if (isString(oldCookie) && oldCookie.split(".").length === 2) {
            queryData.ot = oldCookie.split(".")[1];
            queryData.kid = oldCookie.split(".")[0];
        } else {
            queryData.kid = random(12);
        }

        // Sending data to the server only if its more than 30 minutes since last hit
        console.log("Kudakeru Query Data", queryData);
        if (timestamp() - queryData.ot > sessionTimeout) {
            queryData.tid = uniq(queryData.tid).join(",");
            queryData.fb = queryData.fb.join(",");
            sendData(queryData);
        } else {
            upsertCookie(queryData.kid);
        }
    }, 5000);
}

export default kudakeru;