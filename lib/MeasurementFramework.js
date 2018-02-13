/**
 * Singelton object to register all user functions.
 */
import dataLayerPush from "./helpers/dataLayerPush";
import forEach from "lodash-es/forEach";
import isUndefined from "lodash-es/isUndefined";
import isFunction from "lodash-es/isFunction";
import merge from "lodash-es/merge";

class MeasurementFramework {

    constructor() {
        console.log("Measurement Framework constructed");
        this.registered = [];
        this.a = "__mf_lock";
    }

    register(func) {
        if (isFunction(func)) {
            this.registered.push(func);
        } else {
            console.warn("Measurement Framework received a non-function.", func);
        }

    }

    init() {
        if (isUndefined(window[this.a])) {
            console.log("Measurement Framework Loaded");
            let initDataLayer = {};
            forEach(this.registered, function (func) {
                initDataLayer = merge(initDataLayer, func.call({}));
            });
            dataLayerPush(initDataLayer, "Measurement Framework Loaded");
            window[this.a] = true;
        } else {
            console.log("Measurement Framework Loaded");
        }

    }
}


export default new MeasurementFramework();